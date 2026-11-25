import type { MsgSend } from "../../msgs/bank/MsgSend";
import type { MsgBatchCancelSpotOrders } from "../../msgs/exchange/MsgBatchCancelSpotOrders";
import type { MsgCancelSpotOrder } from "../../msgs/exchange/MsgCancelSpotOrder";
import type { MsgCreateSpotLimitOrder } from "../../msgs/exchange/MsgCreateSpotLimitOrder";
import type { MsgCreateSpotMarketOrder } from "../../msgs/exchange/MsgCreateSpotMarketOrder";
import type { MsgDeposit } from "../../msgs/exchange/MsgDeposit";
import type { MsgSubaccountTransfer } from "../../msgs/exchange/MsgSubaccountTransfer";
import type { MsgExternalTransfer } from "../../msgs/exchange/MsgExternalTransfer";
import type { MsgWithdraw } from "../../msgs/exchange/MsgWithdraw";
import type { MsgCreateDerivativeLimitOrder } from "../../msgs/exchange/MsgCreateDerivativeLimitOrder";
import type { MsgCreateDerivativeMarketOrder } from "../../msgs/exchange/MsgCreateDerivativeMarketOrder";
import type { MsgCancelDerivativeOrder } from "../../msgs/exchange/MsgCancelDerivativeOrder";
import type { MsgBatchCancelDerivativeOrders } from "../../msgs/exchange/MsgBatchCancelDerivativeOrders";
import type { MsgIncreasePositionMargin } from "../../msgs/exchange/MsgIncreasePositionMargin";

/** Every message a transaction can carry. */
export type Msg =
  | MsgSend
  | MsgDeposit
  | MsgCreateSpotLimitOrder
  | MsgCreateSpotMarketOrder
  | MsgCancelSpotOrder
  | MsgBatchCancelSpotOrders
  | MsgCreateDerivativeLimitOrder
  | MsgCreateDerivativeMarketOrder
  | MsgCancelDerivativeOrder
  | MsgBatchCancelDerivativeOrders
  | MsgIncreasePositionMargin
  | MsgSubaccountTransfer
  | MsgExternalTransfer
  | MsgWithdraw;
