export interface MsgCancelSpotOrderParams {
  injectiveAddress: string;
  marketId: string;
  subaccountId: string;
  orderHash?: string;
  cid?: string;
}
