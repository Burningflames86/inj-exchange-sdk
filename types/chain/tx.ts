import { Coin } from "../../gen/cosmos/base/v1beta1/coin";
import { SignMode } from "../../gen/cosmos/tx/signing/v1beta1/signing";
import { SignDoc } from "../../gen/cosmos/tx/v1beta1/tx";
import { Msg } from "./msgs";

export interface TxRaw {
  bodyBytes: Buffer;
  authInfoBytes: Buffer;
  signatures: Buffer[];
}

export interface StdFee {
  amount: Coin[];
  gas: string;
  payer?: string;
  granter?: string;
}

export interface SignerDetails {
  /** The signer's compressed public key, base64 encoded. */
  pubKey: string;
  accountNumber: number;
  sequence: number;
}

export interface CreateTransactionParams {
  message: Msg | Msg[];
  chainId: string;
  pubKey: string;
  accountNumber: number;
  sequence: number;
  memo?: string;
  fee: StdFee;
  timeoutHeight?: number;
  /** Defaults to `SIGN_MODE_DIRECT`. */
  signMode?: SignMode;
}

export interface CreateTransactionResult {
  /** Ready to be signed and then handed to `createTxBytes` and broadcast. */
  txRaw: TxRaw;
  signDoc: SignDoc;
  /** The sign doc serialized, which is what a DIRECT signer signs. */
  signBytes: Buffer;
  /** `signBytes` hashed with keccak256, which is what secp256k1 signs. */
  signHashedBytes: Buffer;
  bodyBytes: Buffer;
  authInfoBytes: Buffer;
  signer: SignerDetails;
}
