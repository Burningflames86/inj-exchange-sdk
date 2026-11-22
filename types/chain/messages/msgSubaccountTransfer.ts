import type { Coin } from "../../../gen/cosmos/base/v1beta1/coin";

export interface MsgSubaccountTransferParams {
  injectiveAddress: string;
  srcSubaccountId: string;
  dstSubaccountId: string;
  /** Base units of each denom, not scaled. */
  amount: Coin;
}
