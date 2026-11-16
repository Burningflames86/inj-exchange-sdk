import { ChannelCredentials, ChannelOptions, credentials } from "@grpc/grpc-js";
import { ApiManager } from "../../../managers/ApiManager";
import {
  InjectivePortfolioRPCClient,
  AccountPortfolioRequest,
  AccountPortfolioResponse,
  AccountPortfolioBalancesRequest,
  AccountPortfolioBalancesResponse,
  InjectivePortfolioRPCService,
} from "../../../gen/exchange/injective_portfolio_rpc";

export class IndexerPortfolioApiClient {
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

  public async fetchAccountPortfolio(
    accountAddress: string,
  ): Promise<AccountPortfolioResponse["portfolio"]> {
    const response: AccountPortfolioResponse = await ApiManager(
      this.client.accountPortfolio.bind(this.client),
      AccountPortfolioRequest.create({ accountAddress }),
      InjectivePortfolioRPCService.accountPortfolio.path,
    );
    return response.portfolio;
  }

  public async fetchAccountPortfolioBalances(
    accountAddress: string,
  ): Promise<AccountPortfolioBalancesResponse["portfolio"]> {
    const response: AccountPortfolioBalancesResponse = await ApiManager(
      this.client.accountPortfolioBalances.bind(this.client),
      AccountPortfolioBalancesRequest.create({ accountAddress, usd: true }),
      InjectivePortfolioRPCService.accountPortfolioBalances.path,
    );
    return response.portfolio;
  }
}
