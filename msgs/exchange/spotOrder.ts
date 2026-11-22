import { OrderType } from "../../gen/injective/exchange/v1beta1/exchange";
import { toCosmosSdkDecString } from "../../utils/decimal";

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

/** The amino form keeps the human values the caller passed in. */
export function toSpotOrderAmino(params: SpotOrderParams): SpotOrderAmino {
  return {
    market_id: params.marketId,
    order_info: {
      subaccount_id: params.subaccountId,
      fee_recipient: params.feeRecipient,
      price: params.price,
      quantity: params.quantity,
      cid: params.cid ?? "",
    },
    order_type: params.orderType,
    trigger_price: params.triggerPrice ?? "0",
  };
}

/**
 * The EIP-712 payload signs decimals as Cosmos SDK decimal strings and the
 * order type as its enum name, so it cannot reuse the amino form.
 */
export function toSpotOrderEip712V2(
  params: SpotOrderParams,
): SpotOrderEip712V2 {
  return {
    market_id: params.marketId,
    order_info: {
      subaccount_id: params.subaccountId,
      fee_recipient: params.feeRecipient,
      price: toCosmosSdkDecString(params.price),
      quantity: toCosmosSdkDecString(params.quantity),
      cid: params.cid ?? "",
    },
    order_type: OrderType[params.orderType],
    trigger_price: toCosmosSdkDecString(params.triggerPrice ?? "0"),
  };
}
