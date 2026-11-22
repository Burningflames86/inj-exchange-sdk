import type { OrderDataParams } from "./orderData";

export interface MsgBatchCancelDerivativeOrdersParams {
  injectiveAddress: string;
  orders: OrderDataParams[];
}
