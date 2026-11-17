export interface TxRaw {
  bodyBytes: Buffer;
  authInfoBytes: Buffer;
  signatures: Buffer[];
}
