import type { OrderType } from "../../../gen/injective/exchange/v1beta1/exchange";

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
