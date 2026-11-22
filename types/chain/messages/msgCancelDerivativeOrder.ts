import type { OrderMask } from "../../../gen/injective/exchange/v1beta1/exchange";

export interface MsgCancelDerivativeOrderParams {
  injectiveAddress: string;
  marketId: string;
  subaccountId: string;
  orderHash?: string;
  orderMask?: OrderMask;
  cid?: string;
}
