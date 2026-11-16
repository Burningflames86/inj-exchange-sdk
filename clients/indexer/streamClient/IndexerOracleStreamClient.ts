import { ChannelCredentials, credentials, ChannelOptions } from "@grpc/grpc-js";

import { StreamManager } from "../../../managers/StreamManager";
import {
  InjectiveOracleRPCClient,
  StreamPricesByMarketsRequest,
  StreamPricesByMarketsResponse,
  InjectiveOracleRPCService,
} from "../../../gen/exchange/injective_oracle_rpc";

export class IndexerOracleStreamClient {
  private client: InjectiveOracleRPCClient;

  constructor(
    address: string,
    serverCredentials?: ChannelCredentials,
    options?: ChannelOptions,
  ) {
    if (!serverCredentials) serverCredentials = credentials.createSsl();
    this.client = new InjectiveOracleRPCClient(
      address,
      serverCredentials,
      options,
    );
  }

  public streamPricesByMarkets(
    params?: Partial<StreamPricesByMarketsRequest>,
  ): StreamManager<StreamPricesByMarketsResponse> {
    const streamFactory = () =>
      this.client.streamPricesByMarkets(
        StreamPricesByMarketsRequest.create(params),
      );
    return new StreamManager(
      streamFactory,
      InjectiveOracleRPCService.streamPricesByMarkets.path,
    );
  }
}
