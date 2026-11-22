import type { Coin } from "../../../gen/cosmos/base/v1beta1/coin";

export interface MsgDepositParams {
  injectiveAddress: string;
  subaccountId: string;
  /** Base units of the denom, not scaled. */
  amount: Coin;
}
