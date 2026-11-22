import {
  OrderInfo,
  SpotOrder,
} from "../../gen/injective/exchange/v1beta1/exchange";
import { MsgCreateSpotMarketOrder as ProtoMsgCreateSpotMarketOrder } from "../../gen/injective/exchange/v1beta1/tx";
import { toChainFormat } from "../../utils/decimal";
import { MsgBase } from "../MsgBase";
import {
  SpotOrderAmino,
  SpotOrderEip712V2,
  SpotOrderParams,
  toSpotOrderAmino,
  toSpotOrderEip712V2,
} from "./spotOrder";

export class MsgCreateSpotMarketOrder extends MsgBase<
  SpotOrderParams,
  ProtoMsgCreateSpotMarketOrder
> {
  toProto(): ProtoMsgCreateSpotMarketOrder {
    const { params } = this;

    return ProtoMsgCreateSpotMarketOrder.create({
      sender: params.injectiveAddress,
      order: SpotOrder.create({
        marketId: params.marketId,
        orderInfo: OrderInfo.create({
          subaccountId: params.subaccountId,
          feeRecipient: params.feeRecipient,
          price: toChainFormat(params.price),
          quantity: toChainFormat(params.quantity),
          cid: params.cid ?? "",
        }),
        orderType: params.orderType,
        triggerPrice: toChainFormat(params.triggerPrice ?? "0"),
      }),
    });
  }

  toDirectSign(): {
    type: "/injective.exchange.v1beta1.MsgCreateSpotMarketOrder";
    message: ProtoMsgCreateSpotMarketOrder;
  } {
    return {
      type: "/injective.exchange.v1beta1.MsgCreateSpotMarketOrder",
      message: this.toProto(),
    };
  }

  toBinary(): Buffer {
    return Buffer.from(
      ProtoMsgCreateSpotMarketOrder.encode(this.toProto()).finish(),
    );
  }

  toAmino(): {
    type: "exchange/MsgCreateSpotMarketOrder";
    value: { sender: string; order: SpotOrderAmino };
  } {
    return {
      type: "exchange/MsgCreateSpotMarketOrder",
      value: {
        sender: this.params.injectiveAddress,
        order: toSpotOrderAmino(this.params),
      },
    };
  }

  override toEip712V2(): {
    "@type": string;
    sender: string;
    order: SpotOrderEip712V2;
  } {
    return {
      "@type": this.toDirectSign().type,
      sender: this.params.injectiveAddress,
      order: toSpotOrderEip712V2(this.params),
    };
  }
}
