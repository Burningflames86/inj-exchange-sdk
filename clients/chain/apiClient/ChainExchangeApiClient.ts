import { ChannelCredentials, ChannelOptions, credentials } from "@grpc/grpc-js";
import {
  QueryClient,
  QueryDenomDecimalsRequest,
  QueryDenomDecimalsResponse,
  QueryExchangeParamsRequest,
  QueryExchangeParamsResponse,
  QueryService,
  QuerySubaccountDepositsRequest,
  QuerySubaccountDepositsResponse,
  QuerySubaccountPositionsRequest,
  QuerySubaccountPositionsResponse,
  QuerySubaccountTradeNonceRequest,
  QuerySubaccountTradeNonceResponse,
  QueryTraderDerivativeOrdersRequest,
  QueryTraderDerivativeOrdersResponse,
  QueryTraderSpotOrdersRequest,
  QueryTraderSpotOrdersResponse,
} from "../../../gen/injective/exchange/v1beta1/query";
import { ApiManager } from "../../../managers/ApiManager";

export class ChainExchangeApiClient {
  private client: QueryClient;

  constructor(
    address: string,
    serverCredentials?: ChannelCredentials,
    options?: ChannelOptions,
  ) {
    if (!serverCredentials) serverCredentials = credentials.createSsl();
    this.client = new QueryClient(address, serverCredentials, options);
  }

  public async fetchParams(): Promise<QueryExchangeParamsResponse["params"]> {
    const response: QueryExchangeParamsResponse = await ApiManager(
      this.client.queryExchangeParams.bind(this.client),
      QueryExchangeParamsRequest.create(),
      QueryService.queryExchangeParams.path,
    );
    return response.params;
  }

  public async fetchSubaccountDeposits(
    subaccountId: string,
  ): Promise<QuerySubaccountDepositsResponse["deposits"]> {
    const response: QuerySubaccountDepositsResponse = await ApiManager(
      this.client.subaccountDeposits.bind(this.client),
      QuerySubaccountDepositsRequest.create({ subaccountId }),
      QueryService.subaccountDeposits.path,
    );
    return response.deposits;
  }

  public async fetchSubaccountPositions(
    subaccountId: string,
  ): Promise<QuerySubaccountPositionsResponse["state"]> {
    const response: QuerySubaccountPositionsResponse = await ApiManager(
      this.client.subaccountPositions.bind(this.client),
      QuerySubaccountPositionsRequest.create({ subaccountId }),
      QueryService.subaccountPositions.path,
    );
    return response.state;
  }

  public async fetchSubaccountTradeNonce(
    subaccountId: string,
  ): Promise<QuerySubaccountTradeNonceResponse["nonce"]> {
    const response: QuerySubaccountTradeNonceResponse = await ApiManager(
      this.client.subaccountTradeNonce.bind(this.client),
      QuerySubaccountTradeNonceRequest.create({ subaccountId }),
      QueryService.subaccountTradeNonce.path,
    );
    return response.nonce;
  }

  public async fetchSpotOrders(params: {
    marketId: string;
    subaccountId?: string;
  }): Promise<QueryTraderSpotOrdersResponse["orders"]> {
    const response: QueryTraderSpotOrdersResponse = await ApiManager(
      this.client.traderSpotOrders.bind(this.client),
      QueryTraderSpotOrdersRequest.create(params),
      QueryService.traderSpotOrders.path,
    );
    return response.orders;
  }

  public async fetchDerivativeOrders(params: {
    marketId: string;
    subaccountId?: string;
  }): Promise<QueryTraderDerivativeOrdersResponse["orders"]> {
    const response: QueryTraderDerivativeOrdersResponse = await ApiManager(
      this.client.traderDerivativeOrders.bind(this.client),
      QueryTraderDerivativeOrdersRequest.create(params),
      QueryService.traderDerivativeOrders.path,
    );
    return response.orders;
  }

  public async fetchDenomDecimals(
    denoms?: string[],
  ): Promise<QueryDenomDecimalsResponse["denomDecimals"]> {
    const response: QueryDenomDecimalsResponse = await ApiManager(
      this.client.denomDecimals.bind(this.client),
      QueryDenomDecimalsRequest.create({ denoms }),
      QueryService.denomDecimals.path,
    );
    return response.denomDecimals;
  }
}
