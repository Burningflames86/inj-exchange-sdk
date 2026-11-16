import { ChannelCredentials, ChannelOptions, credentials } from "@grpc/grpc-js";
import { ApiManager } from "../../../managers/ApiManager";
import {
  InjectiveOracleRPCClient,
  OracleListRequest,
  OracleListResponse,
  PriceV2Request,
  PriceV2Response,
  InjectiveOracleRPCService,
  PricePayloadV2,
} from "../../../gen/exchange/injective_oracle_rpc";

export class IndexerOracleApiClient {
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

  public async fetchOracleList(
    params?: Partial<OracleListRequest>,
  ): Promise<OracleListResponse> {
    const response: OracleListResponse = await ApiManager(
      this.client.oracleList.bind(this.client),
      OracleListRequest.create(params),
      InjectiveOracleRPCService.oracleList.path,
    );
    return response;
  }

  //coutlnd't test because of complicated params
  public async fetchPriceV2(
    params: PricePayloadV2[],
  ): Promise<PriceV2Response["prices"]> {
    const response: PriceV2Response = await ApiManager(
      this.client.priceV2.bind(this.client),
      PriceV2Request.create({ filters: params }),
      InjectiveOracleRPCService.priceV2.path,
    );
    return response.prices;
  }
}
