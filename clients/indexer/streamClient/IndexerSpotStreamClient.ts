import { ChannelCredentials, credentials, ChannelOptions } from "@grpc/grpc-js";

import { StreamManager } from "../../../managers/StreamManager";
import {
  InjectiveSpotExchangeRPCClient,
  StreamMarketsRequest,
  StreamMarketsResponse,
  StreamOrderbookV2Request,
  StreamOrderbookV2Response,
  StreamOrderbookUpdateRequest,
  StreamOrderbookUpdateResponse,
  StreamOrdersRequest,
  StreamOrdersResponse,
  StreamTradesV2Request,
  StreamTradesV2Response,
  StreamOrdersHistoryRequest,
  StreamOrdersHistoryResponse,
  InjectiveSpotExchangeRPCService,
} from "../../../gen/exchange/injective_spot_exchange_rpc";

export class IndexerSpotStreamClient {
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

  //dropping connections
  public streamMarkets(
    params?: Partial<StreamMarketsRequest>,
  ): StreamManager<StreamMarketsResponse> {
    const streamFactory = () =>
      this.client.streamMarkets(StreamMarketsRequest.create(params));
    return new StreamManager(
      streamFactory,
      InjectiveSpotExchangeRPCService.streamMarkets.path,
    );
  }

  //not in injective-sdk
  public streamOrderbookV2(
    params?: Partial<StreamOrderbookV2Request>,
  ): StreamManager<StreamOrderbookV2Response> {
    const streamFactory = () =>
      this.client.streamOrderbookV2(StreamOrderbookV2Request.create(params));
    return new StreamManager(
      streamFactory,
      InjectiveSpotExchangeRPCService.streamOrderbookV2.path,
    );
  }

  // present but not working properly in injective-sdk
  public streamOrderbookUpdates(
    params?: Partial<StreamOrderbookUpdateRequest>,
  ): StreamManager<StreamOrderbookUpdateResponse> {
    const streamFactory = () =>
      this.client.streamOrderbookUpdate(
        StreamOrderbookUpdateRequest.create(params),
      );
    return new StreamManager(
      streamFactory,
      InjectiveSpotExchangeRPCService.streamOrderbookUpdate.path,
    );
  }

  public streamOrders(
    params?: Partial<StreamOrdersRequest>,
  ): StreamManager<StreamOrdersResponse> {
    const streamFactory = () =>
      this.client.streamOrders(StreamOrdersRequest.create(params));
    return new StreamManager(
      streamFactory,
      InjectiveSpotExchangeRPCService.streamOrders.path,
    );
  }

  public streamTradesV2(
    params?: Partial<StreamTradesV2Request>,
  ): StreamManager<StreamTradesV2Response> {
    const streamFactory = () =>
      this.client.streamTradesV2(StreamTradesV2Request.create(params));
    return new StreamManager(
      streamFactory,
      InjectiveSpotExchangeRPCService.streamTradesV2.path,
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
      InjectiveSpotExchangeRPCService.streamOrdersHistory.path,
    );
  }
}
