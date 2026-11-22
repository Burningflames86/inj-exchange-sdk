import type { OrderMask } from "../../../gen/injective/exchange/v1beta1/exchange";

/** One order to cancel, shared by the spot and derivative batch cancels. */
export interface OrderDataParams {
  marketId: string;
  subaccountId: string;
  orderHash?: string;
  orderMask?: OrderMask;
  cid?: string;
}
