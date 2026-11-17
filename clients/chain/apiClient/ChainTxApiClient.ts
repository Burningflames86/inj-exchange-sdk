import { ChannelCredentials, ChannelOptions, credentials } from "@grpc/grpc-js";
import {
  BroadcastMode,
  BroadcastTxRequest,
  BroadcastTxResponse,
  GetTxRequest,
  GetTxResponse,
  ServiceClient,
  ServiceService,
  SimulateRequest,
  SimulateResponse,
  TxDecodeRequest,
  TxDecodeResponse,
  TxEncodeRequest,
  TxEncodeResponse,
} from "../../../gen/cosmos/tx/v1beta1/service";
import { ApiManager } from "../../../managers/ApiManager";
import { TxRaw } from "../../../types/chain/tx";
import { createTxBytes } from "../../../utils/tx";

export class ChainTxApiClient {
  private client: ServiceClient;

  constructor(
    address: string,
    serverCredentials?: ChannelCredentials,
    options?: ChannelOptions,
  ) {
    if (!serverCredentials) serverCredentials = credentials.createSsl();
    this.client = new ServiceClient(address, serverCredentials, options);
  }

  public async broadcast(
    txRaw: TxRaw,
    mode: BroadcastMode = BroadcastMode.BROADCAST_MODE_SYNC,
  ): Promise<BroadcastTxResponse["txResponse"]> {
    const response: BroadcastTxResponse = await ApiManager(
      this.client.broadcastTx.bind(this.client),
      BroadcastTxRequest.create({ txBytes: createTxBytes(txRaw), mode }),
      ServiceService.broadcastTx.path,
    );
    return response.txResponse;
  }

  public async simulate(txRaw: TxRaw): Promise<SimulateResponse> {
    const signatures = txRaw.signatures.length
      ? txRaw.signatures
      : [Buffer.alloc(0)];
    const response: SimulateResponse = await ApiManager(
      this.client.simulate.bind(this.client),
      SimulateRequest.create({
        txBytes: createTxBytes({ ...txRaw, signatures }),
      }),
      ServiceService.simulate.path,
    );
    return response;
  }

  public async fetchTx(hash: string): Promise<GetTxResponse> {
    const response: GetTxResponse = await ApiManager(
      this.client.getTx.bind(this.client),
      GetTxRequest.create({ hash }),
      ServiceService.getTx.path,
    );
    return response;
  }

  public async decodeTx(txBytes: Buffer): Promise<TxDecodeResponse["tx"]> {
    const response: TxDecodeResponse = await ApiManager(
      this.client.txDecode.bind(this.client),
      TxDecodeRequest.create({ txBytes }),
      ServiceService.txDecode.path,
    );
    return response.tx;
  }

  public async encodeTx(
    tx: TxEncodeRequest["tx"],
  ): Promise<TxEncodeResponse["txBytes"]> {
    const response: TxEncodeResponse = await ApiManager(
      this.client.txEncode.bind(this.client),
      TxEncodeRequest.create({ tx }),
      ServiceService.txEncode.path,
    );
    return response.txBytes;
  }
}
