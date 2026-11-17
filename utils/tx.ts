import { TxRaw as ProtoTxRaw } from "../gen/cosmos/tx/v1beta1/tx";
import { TxRaw } from "../types/chain/tx";

export function createTxBytes(txRaw: TxRaw): Buffer {
  return Buffer.from(ProtoTxRaw.encode(ProtoTxRaw.create(txRaw)).finish());
}
