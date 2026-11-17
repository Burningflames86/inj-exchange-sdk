import { ChannelCredentials, ChannelOptions, credentials } from "@grpc/grpc-js";
import { ApiManager } from "../../../managers/ApiManager";
import {
  FundingPaymentsRequest,
  FundingPaymentsResponse,
  FundingRatesRequest,
  FundingRatesResponse,
  InjectiveDerivativeExchangeRPCClient,
  MarketsRequest,
  MarketsResponse,
  MarketRequest,
  MarketResponse,
  OrderbooksV2Request,
  OrderbooksV2Response,
  OrderbookV2Request,
  OrderbookV2Response,
  OrdersHistoryRequest,
  OrdersHistoryResponse,
  OrdersRequest,
  OrdersResponse,
  PositionsV2Request,
  PositionsV2Response,
  SubaccountOrdersListRequest,
  SubaccountOrdersListResponse,
  SubaccountTradesListRequest,
  SubaccountTradesListResponse,
  TradesV2Request,
  TradesV2Response,
  InjectiveDerivativeExchangeRPCService,
} from "../../../gen/exchange/injective_derivative_exchange_rpc";

export class IndexerDerivativesApiClient {
  private client: InjectiveDerivativeExchangeRPCClient;

  constructor(
    address: string,
    serverCredentials?: ChannelCredentials,
    options?: ChannelOptions,
  ) {
    if (!serverCredentials) serverCredentials = credentials.createSsl();
    this.client = new InjectiveDerivativeExchangeRPCClient(
      address,
      serverCredentials,
      options,
    );
  }
  public async fetchMarkets(
    params?: Partial<MarketsRequest>,
  ): Promise<MarketsResponse["markets"]> {
    const response: MarketsResponse = await ApiManager(
      this.client.markets.bind(this.client),
      MarketsRequest.create(params),
      InjectiveDerivativeExchangeRPCService.markets.path,
    );
    return response.markets;
  }
  public async fetchMarket(
    marketId: string,
  ): Promise<MarketResponse["market"]> {
    const response: MarketResponse = await ApiManager(
      this.client.market.bind(this.client),
      MarketRequest.create({ marketId }),
      InjectiveDerivativeExchangeRPCService.market.path,
    );
    return response.market;
  }
  public async fetchOrderbookV2(
    params: Partial<OrderbookV2Request> & Pick<OrderbookV2Request, "marketId">,
  ): Promise<OrderbookV2Response["orderbook"]> {
    const response: OrderbookV2Response = await ApiManager(
      this.client.orderbookV2.bind(this.client),
      OrderbookV2Request.create(params),
      InjectiveDerivativeExchangeRPCService.orderbookV2.path,
    );
    return response.orderbook;
  }
  public async fetchOrderbooksV2(
    params: Partial<OrderbooksV2Request> &
      Pick<OrderbooksV2Request, "marketIds">,
  ): Promise<OrderbooksV2Response["orderbooks"]> {
    const response: OrderbooksV2Response = await ApiManager(
      this.client.orderbooksV2.bind(this.client),
      OrderbooksV2Request.create(params),
      InjectiveDerivativeExchangeRPCService.orderbooksV2.path,
    );
    return response.orderbooks;
  }
  public async fetchOrders(
    params?: Partial<OrdersRequest>,
  ): Promise<OrdersResponse> {
    const response: OrdersResponse = await ApiManager(
      this.client.orders.bind(this.client),
      OrdersRequest.create(params),
      InjectiveDerivativeExchangeRPCService.orders.path,
    );
    return response;
  }
  public async fetchPositionsV2(
    params?: Partial<PositionsV2Request>,
  ): Promise<PositionsV2Response> {
    const response: PositionsV2Response = await ApiManager(
      this.client.positionsV2.bind(this.client),
      PositionsV2Request.create(params),
      InjectiveDerivativeExchangeRPCService.positionsV2.path,
    );
    return response;
  }
  public async fetchFundingPayments(
    params?: Partial<FundingPaymentsRequest>,
  ): Promise<FundingPaymentsResponse> {
    const response: FundingPaymentsResponse = await ApiManager(
      this.client.fundingPayments.bind(this.client),
      FundingPaymentsRequest.create(params),
      InjectiveDerivativeExchangeRPCService.fundingPayments.path,
    );
    return response;
  }
  public async fetchFundingRates(
    params?: Partial<FundingRatesRequest>,
  ): Promise<FundingRatesResponse> {
    const response: FundingRatesResponse = await ApiManager(
      this.client.fundingRates.bind(this.client),
      FundingRatesRequest.create(params),
      InjectiveDerivativeExchangeRPCService.fundingRates.path,
    );
    return response;
  }
  public async fetchTradesV2(
    params?: Partial<TradesV2Request>,
  ): Promise<TradesV2Response> {
    const response: TradesV2Response = await ApiManager(
      this.client.tradesV2.bind(this.client),
      TradesV2Request.create(params),
      InjectiveDerivativeExchangeRPCService.tradesV2.path,
    );
    return response;
  }
  public async fetchSubaccountOrdersList(
    params: Partial<SubaccountOrdersListRequest> &
      Pick<SubaccountOrdersListRequest, "subaccountId">,
  ): Promise<SubaccountOrdersListResponse> {
    const response: SubaccountOrdersListResponse = await ApiManager(
      this.client.subaccountOrdersList.bind(this.client),
      SubaccountOrdersListRequest.create(params),
      InjectiveDerivativeExchangeRPCService.subaccountOrdersList.path,
    );
    return response;
  }
  public async fetchSubaccountTradesList(
    params: Partial<SubaccountTradesListRequest> &
      Pick<SubaccountTradesListRequest, "subaccountId">,
  ): Promise<SubaccountTradesListResponse> {
    const response: SubaccountTradesListResponse = await ApiManager(
      this.client.subaccountTradesList.bind(this.client),
      SubaccountTradesListRequest.create(params),
      InjectiveDerivativeExchangeRPCService.subaccountTradesList.path,
    );
    return response;
  }
  public async fetchOrdersHistory(
    params?: Partial<OrdersHistoryRequest>,
  ): Promise<OrdersHistoryResponse> {
    const response: OrdersHistoryResponse = await ApiManager(
      this.client.ordersHistory.bind(this.client),
      OrdersHistoryRequest.create(params),
      InjectiveDerivativeExchangeRPCService.ordersHistory.path,
    );
    return response;
  }
}
