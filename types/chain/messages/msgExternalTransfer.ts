import type { Coin } from "../../../gen/cosmos/base/v1beta1/coin";

export interface MsgExternalTransferParams {
  injectiveAddress: string;
  srcSubaccountId: string;
  /**
   * The destination subaccount ID: 0x plus 64 hex characters, the recipient's
   * 20-byte address in the first 20 bytes and a nonce after it. The chain sends
   * to an account derived from that address, so it belongs to another account,
   * not to `injectiveAddress`. A bare 20-byte address fails validation.
   */
  dstSubaccountId: string;
  /** Base units of each denom, not scaled. */
  amount: Coin;
}
