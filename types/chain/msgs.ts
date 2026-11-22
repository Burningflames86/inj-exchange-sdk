import type { Coin } from "../../gen/cosmos/base/v1beta1/coin";
import type {
  OrderMask,
  OrderType,
} from "../../gen/injective/exchange/v1beta1/exchange";
import type { MsgSend } from "../../msgs/bank/MsgSend";
import type { MsgBatchCancelSpotOrders } from "../../msgs/exchange/MsgBatchCancelSpotOrders";
import type { MsgCancelSpotOrder } from "../../msgs/exchange/MsgCancelSpotOrder";
import type { MsgCreateSpotLimitOrder } from "../../msgs/exchange/MsgCreateSpotLimitOrder";
import type { MsgCreateSpotMarketOrder } from "../../msgs/exchange/MsgCreateSpotMarketOrder";
import type { MsgDeposit } from "../../msgs/exchange/MsgDeposit";

/**
 * The values a message takes. Each message's params live here rather than in
 * its own module, so an app can type the order it builds without importing the
 * message class, and so one file answers what every message takes.
 */

export interface MsgSendParams {
  srcInjectiveAddress: string;
  dstInjectiveAddress: string;
  /** Base units of each denom, not scaled. */
  amount: Coin | Coin[];
}

export interface MsgDepositParams {
  injectiveAddress: string;
  subaccountId: string;
  /** Base units of the denom, not scaled. */
  amount: Coin;
}

export interface SpotOrderParams {
  injectiveAddress: string;
  marketId: string;
  subaccountId: string;
  feeRecipient: string;
  /** Human value, scaled to chain format when the message is built. */
  price: string;
  /** Human value, scaled to chain format when the message is built. */
  quantity: string;
  orderType: OrderType;
  triggerPrice?: string;
  cid?: string;
}

/** The amino form keeps the human values the caller passed in. */
export interface SpotOrderAmino {
  market_id: string;
  order_info: {
    subaccount_id: string;
    fee_recipient: string;
    price: string;
    quantity: string;
    cid: string;
  };
  order_type: OrderType;
  trigger_price: string;
}

/** The EIP-712 form signs decimals as Cosmos SDK decimal strings. */
export interface SpotOrderEip712V2 {
  market_id: string;
  order_info: {
    subaccount_id: string;
    fee_recipient: string;
    price: string;
    quantity: string;
    cid: string;
  };
  order_type: string;
  trigger_price: string;
}

export interface MsgCancelSpotOrderParams {
  injectiveAddress: string;
  marketId: string;
  subaccountId: string;
  orderHash?: string;
  cid?: string;
}

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

/** Every message a transaction can carry. */
export type Msg =
  | MsgSend
  | MsgDeposit
  | MsgCreateSpotLimitOrder
  | MsgCreateSpotMarketOrder
  | MsgCancelSpotOrder
  | MsgBatchCancelSpotOrders;
