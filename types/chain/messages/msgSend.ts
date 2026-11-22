import type { Coin } from "../../../gen/cosmos/base/v1beta1/coin";

export interface MsgSendParams {
  srcInjectiveAddress: string;
  dstInjectiveAddress: string;
  /** Base units of each denom, not scaled. */
  amount: Coin | Coin[];
}
