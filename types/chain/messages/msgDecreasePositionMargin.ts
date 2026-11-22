export interface MsgDecreasePositionMarginParams {
  injectiveAddress: string;
  marketId: string;
  srcSubaccountId: string;
  dstSubaccountId: string;
  /** Human value, scaled to chain format when the message is built. */
  amount: string;
}
