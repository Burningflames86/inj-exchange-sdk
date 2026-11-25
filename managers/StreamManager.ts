import { EventEmitter } from "eventemitter3";
import {
  StreamManagerRetryConfig,
  StreamDisconnectReason,
  StreamState,
  EventTypes,
} from "../types/stream";
import {
  ClientReadableStream,
  ServerErrorResponse,
  status,
} from "@grpc/grpc-js";
import { getServiceAndMethodFromPath } from "../utils/helper";

const DEFAULT_RETRY_CONFIG: StreamManagerRetryConfig = {
  enabled: true,
  maxAttempts: 5,
  maxDelayMs: 30000,
  backoffMultiplier: 2,
  initialDelayMs: 1000,
  stableConnectionMs: 5000,
};

function ifRetryableError(code: status | undefined): boolean {
  switch (code) {
    case status.UNAVAILABLE:
    case status.DEADLINE_EXCEEDED:
    case status.RESOURCE_EXHAUSTED:
    case status.UNKNOWN:
    case status.INTERNAL:
    case status.DATA_LOSS:
    case status.ABORTED:
      return true;
    default:
      return false;
  }
}

export class StreamManager<StreamResponse> extends EventEmitter<
  EventTypes<StreamResponse>
> {
  private streamFactory: () => ClientReadableStream<StreamResponse>;
  private subscription: ClientReadableStream<StreamResponse> | null = null;
  private state: StreamState = StreamState.Idle;
  private retryConfig: StreamManagerRetryConfig;
  private streamError: ServerErrorResponse | null = null;
  private retryAttempts: number = 0;
  private reconnectionTimeout: NodeJS.Timeout | null = null;
  private stableConnectionTimeout: NodeJS.Timeout | null = null;
  private path: string;
  // private serviceName: string;
  // private methodName: string;
  constructor(
    streamFactory: () => ClientReadableStream<StreamResponse>,
    path: string,
    retryConfig?: Partial<StreamManagerRetryConfig>,
  ) {
    super();
    this.streamFactory = streamFactory;
    this.path = path;
    this.retryConfig = { ...DEFAULT_RETRY_CONFIG, ...retryConfig };
  }

  public start(): void {
    if (this.isDestroyed) {
      throw new Error("Cannot start a destroyed stream");
    }

    if (this.subscription) return;
    this.subscription = this.streamFactory();
    this.streamError = null;

    this.updateState(
      this.state == StreamState.Idle || this.state == StreamState.Stopped
        ? StreamState.Connecting
        : StreamState.Reconnecting,
    );

    if (
      this.state == StreamState.Reconnecting ||
      this.state == StreamState.Connecting
    )
      this.scheduleConnectionStable();

    this.subscription.on("data", (data: StreamResponse) => {
      if (
        this.state == StreamState.Reconnecting ||
        this.state == StreamState.Connecting
      )
        this.markConnectionStable();
      this.emit("data", data);
    });
    this.subscription.on("error", (error) => {
      if (error.code == 1) return;
      this.streamError = error;
    });
    this.subscription.on("end", () => this.handleReconnection());
  }

  public stop(): void {
    if (this.state == StreamState.Idle || this.state == StreamState.Destroyed)
      return;
    this.clearStableConnectionTimeout();
    this.clearReconnectionTimeout();
    this.clearSubscription();
    this.updateState(StreamState.Stopped);
    this.emit("disconnect", {
      reason: StreamDisconnectReason.UserStopped,
      willRetry: false,
    });
  }

  public destroy(): void {
    if (this.isDestroyed) return;
    if (this.subscription) {
      this.subscription.destroy();
      this.subscription.removeAllListeners();
      this.clearSubscription();
    }
    this.clearStableConnectionTimeout();
    this.clearReconnectionTimeout();
    this.updateState(StreamState.Destroyed);
    this.emit("disconnect", {
      reason: StreamDisconnectReason.UserStopped,
      willRetry: false,
    });
  }

  private get isDestroyed(): boolean {
    return this.state == StreamState.Destroyed;
  }

  private updateState(newState: StreamState): void {
    if (this.state === newState) return;
    this.state = newState;
  }

  private handleReconnection(): void {
    if (this.state == StreamState.Stopped) return;

    this.clearStableConnectionTimeout();
    this.clearReconnectionTimeout();
    this.clearSubscription();

    const streamError = this.streamError;
    if (streamError) {
      const path = getServiceAndMethodFromPath(this.path);
      delete streamError.metadata;
      const emittedError: any = streamError;
      emittedError.serviceName = path.serviceName;
      emittedError.methodName = path.methodName;
      this.emit("error", emittedError);
    }
    const reason: StreamDisconnectReason = streamError
      ? StreamDisconnectReason.StreamError
      : StreamDisconnectReason.StreamEnded;

    const retryAttemptsRemaining: boolean =
      this.retryAttempts < this.retryConfig.maxAttempts;
    let willRetry: boolean = this.retryConfig.enabled && retryAttemptsRemaining;
    if (willRetry && streamError)
      willRetry = ifRetryableError(streamError.code);

    this.emit("disconnect", {
      reason,
      willRetry,
      attempt: willRetry ? this.retryAttempts + 1 : undefined,
    });

    if (!retryAttemptsRemaining) {
      const path = getServiceAndMethodFromPath(this.path);
      this.emit("error", {
        name: "MAX_RETRIES",
        message: `Max retries (${this.retryConfig.maxAttempts}) reached`,
        serviceName: path.serviceName,
        methodName: path.methodName,
      });
    }

    if (!willRetry) {
      this.updateState(StreamState.Stopped);
      return;
    }

    this.updateState(StreamState.Reconnecting);

    const currentBackoff = this.calculateBackoff(streamError);
    this.retryAttempts++;

    this.reconnectionTimeout = setTimeout(() => {
      this.emit("retry", {
        attempt: this.retryAttempts,
        delayMs: currentBackoff,
        nextBackoff: this.calculateBackoff(streamError),
      });
      this.start();
    }, currentBackoff);
  }

  private scheduleConnectionStable(): void {
    if (this.retryConfig.stableConnectionMs <= 0) return;
    this.clearStableConnectionTimeout();
    this.stableConnectionTimeout = setTimeout(
      () => this.markConnectionStable(),
      this.retryConfig.stableConnectionMs,
    );
  }

  private clearStableConnectionTimeout(): void {
    if (this.stableConnectionTimeout)
      clearTimeout(this.stableConnectionTimeout);
    this.stableConnectionTimeout = null;
  }

  private markConnectionStable(): void {
    this.updateState(StreamState.Connected);
    this.emit("connect", {
      isReconnect: this.retryAttempts > 0,
      attempt: this.retryAttempts,
    });
    this.retryAttempts = 0;
    this.clearStableConnectionTimeout();
  }

  private clearReconnectionTimeout(): void {
    if (this.reconnectionTimeout) clearTimeout(this.reconnectionTimeout);
    this.reconnectionTimeout = null;
  }

  private clearSubscription(): void {
    if (!this.subscription) return;
    this.subscription.cancel();
    this.subscription.on("error", () => {});
    this.subscription = null;
  }

  private calculateBackoff(streamError: ServerErrorResponse | null): number {
    const baseDelay =
      streamError?.code == status.RESOURCE_EXHAUSTED
        ? Math.max(5000, this.retryConfig.initialDelayMs)
        : this.retryConfig.initialDelayMs;

    const finalDelay =
      baseDelay *
      Math.pow(this.retryConfig.backoffMultiplier, this.retryAttempts);

    return Math.min(finalDelay, this.retryConfig.maxDelayMs);
  }
}
