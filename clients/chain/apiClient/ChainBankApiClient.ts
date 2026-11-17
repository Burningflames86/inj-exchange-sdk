import { ChannelCredentials, ChannelOptions, credentials } from "@grpc/grpc-js";
import {
  QueryClient,
  QueryAllBalancesRequest,
  QueryAllBalancesResponse,
  QueryBalanceRequest,
  QueryBalanceResponse,
  QueryDenomMetadataRequest,
  QueryDenomMetadataResponse,
  QueryService,
  QuerySpendableBalanceByDenomRequest,
  QuerySpendableBalanceByDenomResponse,
  QuerySpendableBalancesRequest,
  QuerySpendableBalancesResponse,
} from "../../../gen/cosmos/bank/v1beta1/query";
import { ApiManager } from "../../../managers/ApiManager";
import {
  SanitizedPageRequest,
  SanitizedPageResponse,
} from "../../../types/chain/pagination";
import {
  createSanitizedPageResponse,
  createUnSanitizedPageRequest,
} from "../../../utils/pagination";

export class ChainBankApiClient {
  private client: QueryClient;

  constructor(
    address: string,
    serverCredentials?: ChannelCredentials,
    options?: ChannelOptions,
  ) {
    if (!serverCredentials) serverCredentials = credentials.createSsl();
    this.client = new QueryClient(address, serverCredentials, options);
  }

  public async fetchBalance(params: {
    accountAddress: string;
    denom: string;
  }): Promise<QueryBalanceResponse["balance"]> {
    const response: QueryBalanceResponse = await ApiManager(
      this.client.balance.bind(this.client),
      QueryBalanceRequest.create({
        address: params.accountAddress,
        denom: params.denom,
      }),
      QueryService.balance.path,
    );
    return response.balance;
  }

  public async fetchBalances(
    address: string,
    pagination?: SanitizedPageRequest,
  ): Promise<{
    balances: QueryAllBalancesResponse["balances"];
    pagination: SanitizedPageResponse;
  }> {
    const response: QueryAllBalancesResponse = await ApiManager(
      this.client.allBalances.bind(this.client),
      QueryAllBalancesRequest.create({
        address,
        pagination: createUnSanitizedPageRequest(pagination),
      }),
      QueryService.allBalances.path,
    );
    return {
      balances: response.balances,
      pagination: createSanitizedPageResponse(response.pagination),
    };
  }

  public async fetchSpendableBalances(
    address: string,
    pagination?: SanitizedPageRequest,
  ): Promise<{
    balances: QuerySpendableBalancesResponse["balances"];
    pagination: SanitizedPageResponse;
  }> {
    const response: QuerySpendableBalancesResponse = await ApiManager(
      this.client.spendableBalances.bind(this.client),
      QuerySpendableBalancesRequest.create({
        address,
        pagination: createUnSanitizedPageRequest(pagination),
      }),
      QueryService.spendableBalances.path,
    );
    return {
      balances: response.balances,
      pagination: createSanitizedPageResponse(response.pagination),
    };
  }

  public async fetchSpendableBalanceByDenom(params: {
    accountAddress: string;
    denom: string;
  }): Promise<QuerySpendableBalanceByDenomResponse["balance"]> {
    const response: QuerySpendableBalanceByDenomResponse = await ApiManager(
      this.client.spendableBalanceByDenom.bind(this.client),
      QuerySpendableBalanceByDenomRequest.create({
        address: params.accountAddress,
        denom: params.denom,
      }),
      QueryService.spendableBalanceByDenom.path,
    );
    return response.balance;
  }

  public async fetchDenomMetadata(
    denom: string,
  ): Promise<QueryDenomMetadataResponse["metadata"]> {
    const response: QueryDenomMetadataResponse = await ApiManager(
      this.client.denomMetadata.bind(this.client),
      QueryDenomMetadataRequest.create({ denom }),
      QueryService.denomMetadata.path,
    );
    return response.metadata;
  }
}
