import { ChannelCredentials, ChannelOptions, credentials } from "@grpc/grpc-js";
import { ApiManager } from "../../../managers/ApiManager";
import {
  InjectiveAccountsRPCClient,
  OrderStatesRequest,
  OrderStatesResponse,
  SubaccountsListRequest,
  SubaccountsListResponse,
  SubaccountBalancesListRequest,
  SubaccountBalancesListResponse,
  SubaccountBalanceEndpointRequest,
  SubaccountBalanceEndpointResponse,
  SubaccountHistoryRequest,
  SubaccountHistoryResponse,
  SubaccountOrderSummaryRequest,
  SubaccountOrderSummaryResponse,
  InjectiveAccountsRPCService,
} from "../../../gen/exchange/injective_accounts_rpc";

export class IndexerAccountsApiClient {
  private client: InjectiveAccountsRPCClient;

  constructor(
    address: string,
    serverCredentials?: ChannelCredentials,
    options?: ChannelOptions,
  ) {
    if (!serverCredentials) serverCredentials = credentials.createSsl();
    this.client = new InjectiveAccountsRPCClient(
      address,
      serverCredentials,
      options,
    );
  }

  //need an actual order to test it
  public async fetchOrderStates(
    params: Partial<OrderStatesRequest>,
  ): Promise<OrderStatesResponse> {
    const response: OrderStatesResponse = await ApiManager(
      this.client.orderStates.bind(this.client),
      OrderStatesRequest.create(params),
      InjectiveAccountsRPCService.orderStates.path,
    );
    return response;
  }

  public async fetchSubaccountsList(
    accountAddress: string,
  ): Promise<SubaccountsListResponse["subaccounts"]> {
    const response: SubaccountsListResponse = await ApiManager(
      this.client.subaccountsList.bind(this.client),
      SubaccountsListRequest.create({ accountAddress }),
      InjectiveAccountsRPCService.subaccountsList.path,
    );
    return response.subaccounts;
  }

  public async fetchSubaccountBalancesList(
    subaccountId: string,
  ): Promise<SubaccountBalancesListResponse["balances"]> {
    const response: SubaccountBalancesListResponse = await ApiManager(
      this.client.subaccountBalancesList.bind(this.client),
      SubaccountBalancesListRequest.create({ subaccountId }),
      InjectiveAccountsRPCService.subaccountBalancesList.path,
    );
    return response.balances;
  }

  public async fetchSubaccountBalance(
    params: SubaccountBalanceEndpointRequest,
  ): Promise<SubaccountBalanceEndpointResponse["balance"]> {
    const response: SubaccountBalanceEndpointResponse = await ApiManager(
      this.client.subaccountBalanceEndpoint.bind(this.client),
      SubaccountBalanceEndpointRequest.create(params),
      InjectiveAccountsRPCService.subaccountBalanceEndpoint.path,
    );
    return response.balance;
  }

  public async fetchSubaccountHistory(
    params: Partial<SubaccountHistoryRequest> &
      Pick<SubaccountHistoryRequest, "subaccountId">,
  ): Promise<SubaccountHistoryResponse> {
    const response: SubaccountHistoryResponse = await ApiManager(
      this.client.subaccountHistory.bind(this.client),
      SubaccountHistoryRequest.create(params),
      InjectiveAccountsRPCService.subaccountHistory.path,
    );
    return response;
  }

  public async fetchSubaccountOrderSummary(
    params: Partial<SubaccountOrderSummaryRequest> &
      Pick<SubaccountOrderSummaryRequest, "subaccountId">,
  ): Promise<SubaccountOrderSummaryResponse> {
    const response: SubaccountOrderSummaryResponse = await ApiManager(
      this.client.subaccountOrderSummary.bind(this.client),
      SubaccountOrderSummaryRequest.create(params),
      InjectiveAccountsRPCService.subaccountOrderSummary.path,
    );
    return response;
  }
}
