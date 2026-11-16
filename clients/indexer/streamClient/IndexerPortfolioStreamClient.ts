import { ChannelCredentials, credentials, ChannelOptions } from "@grpc/grpc-js";

import { StreamManager } from "../../../managers/StreamManager";
import {
  InjectivePortfolioRPCClient,
  StreamAccountPortfolioRequest,
  StreamAccountPortfolioResponse,
  InjectivePortfolioRPCService,
} from "../../../gen/exchange/injective_portfolio_rpc";

export class IndexerPortfolioStreamClient {
  private client: InjectivePortfolioRPCClient;

  constructor(
    address: string,
    serverCredentials?: ChannelCredentials,
    options?: ChannelOptions,
  ) {
    if (!serverCredentials) serverCredentials = credentials.createSsl();
    this.client = new InjectivePortfolioRPCClient(
      address,
      serverCredentials,
      options,
    );
  }

  // check it by transferring funds
  public streamAccountPortfolio(
    params: Partial<StreamAccountPortfolioRequest> &
      Pick<StreamAccountPortfolioRequest, "accountAddress">,
  ): StreamManager<StreamAccountPortfolioResponse> {
    const streamFactory = () =>
      this.client.streamAccountPortfolio(
        StreamAccountPortfolioRequest.create(params),
      );
    return new StreamManager(
      streamFactory,
      InjectivePortfolioRPCService.streamAccountPortfolio.path,
    );
  }
}
