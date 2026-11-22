import type { OrderDataParams } from "./orderData";

export interface MsgBatchCancelSpotOrdersParams {
  injectiveAddress: string;
  orders: OrderDataParams[];
}
