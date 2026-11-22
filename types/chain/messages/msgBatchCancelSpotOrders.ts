import type { OrderMask } from "../../../gen/injective/exchange/v1beta1/exchange";

export interface OrderDataParams {
  marketId: string;
  subaccountId: string;
  orderHash?: string;
  orderMask?: OrderMask;
  cid?: string;
}

export interface MsgBatchCancelSpotOrdersParams {
  injectiveAddress: string;
  orders: OrderDataParams[];
}
