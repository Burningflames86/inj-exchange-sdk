import type { OrderMask } from "../enums";

export interface MsgCancelDerivativeOrderParams {
  injectiveAddress: string;
  marketId: string;
  subaccountId: string;
  orderHash?: string;
  orderMask?: OrderMask;
  cid?: string;
}
