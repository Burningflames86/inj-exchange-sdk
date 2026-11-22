import type { MsgSend } from "../../msgs/bank/MsgSend";
import type { MsgBatchCancelSpotOrders } from "../../msgs/exchange/MsgBatchCancelSpotOrders";
import type { MsgCancelSpotOrder } from "../../msgs/exchange/MsgCancelSpotOrder";
import type { MsgCreateSpotLimitOrder } from "../../msgs/exchange/MsgCreateSpotLimitOrder";
import type { MsgCreateSpotMarketOrder } from "../../msgs/exchange/MsgCreateSpotMarketOrder";
import type { MsgDeposit } from "../../msgs/exchange/MsgDeposit";

/** Every message a transaction can carry. */
export type Msg =
  | MsgSend
  | MsgDeposit
  | MsgCreateSpotLimitOrder
  | MsgCreateSpotMarketOrder
  | MsgCancelSpotOrder
  | MsgBatchCancelSpotOrders;
