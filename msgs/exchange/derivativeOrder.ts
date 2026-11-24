import { OrderType } from "../../gen/injective/exchange/v2/order";
import type {
  DerivativeOrderAmino,
  DerivativeOrderEip712V2,
  DerivativeOrderParams,
} from "../../types/chain/messages/derivativeOrder";
import { toCosmosSdkDecString } from "../../utils/decimal";

export function toDerivativeOrderAmino(
  params: DerivativeOrderParams,
): DerivativeOrderAmino {
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
    margin: params.margin,
    trigger_price: params.triggerPrice ?? "0",
    expiration_block: String(params.expirationBlock ?? 0),
  };
}

export function toDerivativeOrderEip712V2(
  params: DerivativeOrderParams,
): DerivativeOrderEip712V2 {
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
    margin: toCosmosSdkDecString(params.margin),
    trigger_price: toCosmosSdkDecString(params.triggerPrice ?? "0"),
    expiration_block: String(params.expirationBlock ?? 0),
  };
}
