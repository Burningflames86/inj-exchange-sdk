import { MsgSend } from "../../msgs/bank/MsgSend";
import { MsgBatchCancelSpotOrders } from "../../msgs/exchange/MsgBatchCancelSpotOrders";
import { MsgCancelSpotOrder } from "../../msgs/exchange/MsgCancelSpotOrder";
import { MsgCreateSpotLimitOrder } from "../../msgs/exchange/MsgCreateSpotLimitOrder";
import { MsgCreateSpotMarketOrder } from "../../msgs/exchange/MsgCreateSpotMarketOrder";
import { MsgDeposit } from "../../msgs/exchange/MsgDeposit";

export type Msg =
  | MsgSend
  | MsgDeposit
  | MsgCreateSpotLimitOrder
  | MsgCreateSpotMarketOrder
  | MsgCancelSpotOrder
  | MsgBatchCancelSpotOrders;
