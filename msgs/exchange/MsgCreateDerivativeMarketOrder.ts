import {
  DerivativeOrder,
  OrderInfo,
  OrderType as ChainOrderType,
} from "../../gen/injective/exchange/v2/order";
import { MsgCreateDerivativeMarketOrder as ProtoMsgCreateDerivativeMarketOrder } from "../../gen/injective/exchange/v2/tx";
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

export class MsgCreateDerivativeMarketOrder extends MsgBase<
  DerivativeOrderParams,
  ProtoMsgCreateDerivativeMarketOrder
> {
  toProto(): ProtoMsgCreateDerivativeMarketOrder {
    const { params } = this;

    return ProtoMsgCreateDerivativeMarketOrder.create({
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
        // The v2 proto types the enum its own way; the values are the same.
        orderType: params.orderType as unknown as ChainOrderType,
        margin: toChainFormat(params.margin),
        triggerPrice: toChainFormat(params.triggerPrice ?? "0"),
        expirationBlock: 0,
      }),
    });
  }

  toDirectSign(): {
    type: "/injective.exchange.v2.MsgCreateDerivativeMarketOrder";
    message: ProtoMsgCreateDerivativeMarketOrder;
  } {
    return {
      type: "/injective.exchange.v2.MsgCreateDerivativeMarketOrder",
      message: this.toProto(),
    };
  }

  toBinary(): Buffer {
    return Buffer.from(
      ProtoMsgCreateDerivativeMarketOrder.encode(this.toProto()).finish(),
    );
  }

  toAmino(): {
    type: "exchange/MsgCreateDerivativeMarketOrder";
    value: { sender: string; order: DerivativeOrderAmino };
  } {
    return {
      type: "exchange/MsgCreateDerivativeMarketOrder",
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
