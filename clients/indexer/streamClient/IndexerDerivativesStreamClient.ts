import { ChannelCredentials, credentials, ChannelOptions } from "@grpc/grpc-js";

import { StreamManager } from "../../../managers/StreamManager";
import {
  InjectiveDerivativeExchangeRPCClient,
  StreamPositionsV2Request,
  StreamOrderbookV2Request,
  StreamTradesV2Request,
  StreamOrderbookV2Response,
  StreamPositionsV2Response,
  StreamTradesV2Response,
  StreamOrderbookUpdateResponse,
  StreamOrderbookUpdateRequest,
  StreamOrdersRequest,
  StreamOrdersResponse,
  StreamOrdersHistoryRequest,
  StreamOrdersHistoryResponse,
  InjectiveDerivativeExchangeRPCService,
  StreamMarketRequest,
  StreamMarketResponse,
} from "../../../gen/exchange/injective_derivative_exchange_rpc";

export class IndexerDerivativesStreamClient {
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

  public streamMarket(
    params?: Partial<StreamMarketRequest>,
  ): StreamManager<StreamMarketResponse> {
    const streamFactory = () =>
      this.client.streamMarket(StreamMarketRequest.create(params));
    return new StreamManager(
      streamFactory,
      InjectiveDerivativeExchangeRPCService.streamMarket.path,
    );
  }

  public streamOrderbookV2(
    params?: Partial<StreamOrderbookV2Request>,
  ): StreamManager<StreamOrderbookV2Response> {
    const streamFactory = () =>
      this.client.streamOrderbookV2(StreamOrderbookV2Request.create(params));
    return new StreamManager(
      streamFactory,
      InjectiveDerivativeExchangeRPCService.streamOrderbookV2.path,
    );
  }

  public streamOrderbookUpdate(
    params?: Partial<StreamOrderbookUpdateRequest>,
  ): StreamManager<StreamOrderbookUpdateResponse> {
    const streamFactory = () =>
      this.client.streamOrderbookUpdate(
        StreamOrderbookUpdateRequest.create(params),
      );
    return new StreamManager(
      streamFactory,
      InjectiveDerivativeExchangeRPCService.streamOrderbookUpdate.path,
    );
  }

  public streamPositionsV2(
    params?: Partial<StreamPositionsV2Request>,
  ): StreamManager<StreamPositionsV2Response> {
    const streamFactory = () =>
      this.client.streamPositionsV2(StreamPositionsV2Request.create(params));
    return new StreamManager(
      streamFactory,
      InjectiveDerivativeExchangeRPCService.streamPositionsV2.path,
    );
  }

  public streamTradesV2(
    params?: Partial<StreamTradesV2Request>,
  ): StreamManager<StreamTradesV2Response> {
    const streamFactory = () =>
      this.client.streamTradesV2(StreamTradesV2Request.create(params));
    return new StreamManager(
      streamFactory,
      InjectiveDerivativeExchangeRPCService.streamTradesV2.path,
    );
  }
  public streamOrders(
    params?: Partial<StreamOrdersRequest>,
  ): StreamManager<StreamOrdersResponse> {
    const streamFactory = () =>
      this.client.streamOrders(StreamOrdersRequest.create(params));
    return new StreamManager(
      streamFactory,
      InjectiveDerivativeExchangeRPCService.streamOrders.path,
    );
  }

  public streamOrdersHistory(
    params?: Partial<StreamOrdersHistoryRequest>,
  ): StreamManager<StreamOrdersHistoryResponse> {
    const streamFactory = () =>
      this.client.streamOrdersHistory(
        StreamOrdersHistoryRequest.create(params),
      );
    return new StreamManager(
      streamFactory,
      InjectiveDerivativeExchangeRPCService.streamOrdersHistory.path,
    );
  }
}
