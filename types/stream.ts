import { ServerErrorResponse } from "@grpc/grpc-js";

export enum StreamState {
  Idle,
  Connecting,
  Connected,
  Reconnecting,
  Stopped,
  Destroyed,
}
export interface StreamManagerRetryConfig {
  enabled: boolean;
  maxAttempts: number;
  initialDelayMs: number;
  maxDelayMs: number;
  backoffMultiplier: number;
  stableConnectionMs: number;
}

export enum StreamDisconnectReason {
  UserStopped = "user-stopped",
  StreamError = "stream-error",
  MaxRetries = "max-retries",
  StreamEnded = "stream-ended",
}

type StreamError = Omit<ServerErrorResponse, "metadata"> & {
  serviceName: string;
  methodName: string;
};

export interface EventTypes<StreamResponse> {
  // Data received from stream
  data: (payload: StreamResponse) => void;

  // Connection established
  connect: (payload: { isReconnect: boolean; attempt: number }) => void;

  // Connection lost
  disconnect: (payload: {
    reason: StreamDisconnectReason;
    willRetry: boolean;
    attempt?: number;
  }) => void;

  // Retry attempt starting
  retry: (payload: {
    attempt: number;
    delayMs: number;
    nextBackoff: number | null;
  }) => void;

  // Error occurred
  error: (payload: StreamError) => void;
}
