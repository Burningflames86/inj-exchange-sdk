import { ChannelCredentials, ChannelOptions, credentials } from "@grpc/grpc-js";
import {
  GetBlockByHeightRequest,
  GetBlockByHeightResponse,
  GetLatestBlockRequest,
  GetLatestBlockResponse,
  ServiceClient,
  ServiceService,
} from "../../../gen/cosmos/base/tendermint/v1beta1/query";
import { ApiManager } from "../../../managers/ApiManager";
import { BlockResponse } from "../../../types/chain/tendermint";
import { sanitizeLatestBlock } from "../../../utils/tendermint";

export class ChainTendermintApiClient {
  private client: ServiceClient;

  constructor(
    address: string,
    serverCredentials?: ChannelCredentials,
    options?: ChannelOptions,
  ) {
    if (!serverCredentials) serverCredentials = credentials.createSsl();
    this.client = new ServiceClient(address, serverCredentials, options);
  }

  public async fetchLatestBlock(): Promise<BlockResponse> {
    const response: GetLatestBlockResponse = await ApiManager(
      this.client.getLatestBlock.bind(this.client),
      GetLatestBlockRequest.create(),
      ServiceService.getLatestBlock.path,
    );
    return sanitizeLatestBlock(response);
  }

  public async fetchBlockByHeight(height: number): Promise<BlockResponse> {
    const response: GetBlockByHeightResponse = await ApiManager(
      this.client.getBlockByHeight.bind(this.client),
      GetBlockByHeightRequest.create({ height }),
      ServiceService.getBlockByHeight.path,
    );
    return sanitizeLatestBlock(response);
  }
}
