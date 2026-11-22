import {
  DerivativeOrder,
  OrderInfo,
} from "../../gen/injective/exchange/v1beta1/exchange";
import { MsgCreateDerivativeLimitOrder as ProtoMsgCreateDerivativeLimitOrder } from "../../gen/injective/exchange/v1beta1/tx";
import type {
  DerivativeOrderAmino,
  DerivativeOrderEip712V2,
  DerivativeOrderParams,
} from "../../types/chain/messages/derivativeOrder";
import { toChainFormat } from "../../utils/decimal";
import { MsgBase } from "../MsgBase";
import {
  toDerivativeOrderAmino,
  toDerivativeOrderEip712V2,
} from "./derivativeOrder";

export class MsgCreateDerivativeLimitOrder extends MsgBase<
  DerivativeOrderParams,
  ProtoMsgCreateDerivativeLimitOrder
> {
  toProto(): ProtoMsgCreateDerivativeLimitOrder {
    const { params } = this;

    return ProtoMsgCreateDerivativeLimitOrder.create({
      sender: params.injectiveAddress,
      order: DerivativeOrder.create({
        marketId: params.marketId,
        orderInfo: OrderInfo.create({
          subaccountId: params.subaccountId,
          feeRecipient: params.feeRecipient,
          price: toChainFormat(params.price),
          quantity: toChainFormat(params.quantity),
          cid: params.cid ?? "",
        }),
        orderType: params.orderType,
        margin: toChainFormat(params.margin),
        triggerPrice: toChainFormat(params.triggerPrice ?? "0"),
      }),
    });
  }

  toDirectSign(): {
    type: "/injective.exchange.v1beta1.MsgCreateDerivativeLimitOrder";
    message: ProtoMsgCreateDerivativeLimitOrder;
  } {
    return {
      type: "/injective.exchange.v1beta1.MsgCreateDerivativeLimitOrder",
      message: this.toProto(),
    };
  }

  toBinary(): Buffer {
    return Buffer.from(
      ProtoMsgCreateDerivativeLimitOrder.encode(this.toProto()).finish(),
    );
  }

  toAmino(): {
    type: "exchange/MsgCreateDerivativeLimitOrder";
    value: { sender: string; order: DerivativeOrderAmino };
  } {
    return {
      type: "exchange/MsgCreateDerivativeLimitOrder",
      value: {
        sender: this.params.injectiveAddress,
        order: toDerivativeOrderAmino(this.params),
      },
    };
  }

  override toEip712V2(): {
    "@type": string;
    sender: string;
    order: DerivativeOrderEip712V2;
  } {
    return {
      "@type": this.toDirectSign().type,
      sender: this.params.injectiveAddress,
      order: toDerivativeOrderEip712V2(this.params),
    };
  }
}
