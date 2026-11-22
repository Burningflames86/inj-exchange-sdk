import type { OrderMask } from "../enums";

/** One order to cancel, shared by the spot and derivative batch cancels. */
export interface OrderDataParams {
  marketId: string;
  subaccountId: string;
  orderHash?: string;
  orderMask?: OrderMask;
  cid?: string;
}
