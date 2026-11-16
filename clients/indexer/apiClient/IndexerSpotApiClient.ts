import { ChannelCredentials, ChannelOptions, credentials } from "@grpc/grpc-js";
import { ApiManager } from "../../../managers/ApiManager";
import {
  InjectiveSpotExchangeRPCClient,
  MarketsRequest,
  MarketsResponse,
  MarketRequest,
  MarketResponse,
  OrderbookV2Request,
  OrderbookV2Response,
  OrderbooksV2Request,
  OrderbooksV2Response,
  OrdersRequest,
  OrdersResponse,
  TradesV2Request,
  TradesV2Response,
  SubaccountOrdersListRequest,
  SubaccountOrdersListResponse,
  SubaccountTradesListRequest,
  SubaccountTradesListResponse,
  OrdersHistoryRequest,
  OrdersHistoryResponse,
  InjectiveSpotExchangeRPCService,
} from "../../../gen/exchange/injective_spot_exchange_rpc";

export class IndexerSpotApiClient {
  private client: InjectiveSpotExchangeRPCClient;

  constructor(
    address: string,
    serverCredentials?: ChannelCredentials,
    options?: ChannelOptions,
  ) {
    if (!serverCredentials) serverCredentials = credentials.createSsl();
    this.client = new InjectiveSpotExchangeRPCClient(
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
      InjectiveSpotExchangeRPCService.markets.path,
    );
    return response.markets;
  }

  public async fetchMarket(
    marketId: string,
  ): Promise<MarketResponse["market"]> {
    const response: MarketResponse = await ApiManager(
      this.client.market.bind(this.client),
      MarketRequest.create({ marketId }),
      InjectiveSpotExchangeRPCService.market.path,
    );
    return response.market;
  }

  public async fetchOrderbookV2(
    params: Partial<OrderbookV2Request> & Pick<OrderbookV2Request, "marketId">,
  ): Promise<OrderbookV2Response["orderbook"]> {
    const response: OrderbookV2Response = await ApiManager(
      this.client.orderbookV2.bind(this.client),
      OrderbookV2Request.create(params),
      InjectiveSpotExchangeRPCService.orderbookV2.path,
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
      InjectiveSpotExchangeRPCService.orderbooksV2.path,
    );
    return response.orderbooks;
  }

  public async fetchOrders(
    params?: Partial<OrdersRequest>,
  ): Promise<OrdersResponse> {
    const response: OrdersResponse = await ApiManager(
      this.client.orders.bind(this.client),
      OrdersRequest.create(params),
      InjectiveSpotExchangeRPCService.orders.path,
    );
    return response;
  }

  public async fetchTradesV2(
    params?: Partial<TradesV2Request>,
  ): Promise<TradesV2Response> {
    const response: TradesV2Response = await ApiManager(
      this.client.tradesV2.bind(this.client),
      TradesV2Request.create(params),
      InjectiveSpotExchangeRPCService.tradesV2.path,
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
      InjectiveSpotExchangeRPCService.subaccountOrdersList.path,
    );
    return response;
  }

  public async fetchSubaccountTradesList(
    params: Partial<SubaccountTradesListRequest> &
      Pick<SubaccountTradesListRequest, "subaccountId">,
  ): Promise<SubaccountTradesListResponse["trades"]> {
    const response: SubaccountTradesListResponse = await ApiManager(
      this.client.subaccountTradesList.bind(this.client),
      SubaccountTradesListRequest.create(params),
      InjectiveSpotExchangeRPCService.subaccountTradesList.path,
    );
    return response.trades;
  }

  public async fetchOrdersHistory(
    params?: Partial<OrdersHistoryRequest>,
  ): Promise<OrdersHistoryResponse> {
    const response: OrdersHistoryResponse = await ApiManager(
      this.client.ordersHistory.bind(this.client),
      OrdersHistoryRequest.create(params),
      InjectiveSpotExchangeRPCService.ordersHistory.path,
    );
    return response;
  }
}
