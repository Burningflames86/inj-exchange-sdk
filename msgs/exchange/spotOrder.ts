import { OrderType } from "../../gen/injective/exchange/v2/order";
import type {
  SpotOrderAmino,
  SpotOrderEip712V2,
  SpotOrderParams,
} from "../../types/chain/messages/spotOrder";
import { toCosmosSdkDecString } from "../../utils/decimal";

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
    expiration_block: String(params.expirationBlock ?? 0),
  };
}

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
    expiration_block: String(params.expirationBlock ?? 0),
  };
}
