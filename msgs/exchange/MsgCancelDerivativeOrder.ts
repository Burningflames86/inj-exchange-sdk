import { OrderMask } from "../../gen/injective/exchange/v1beta1/exchange";
import { MsgCancelDerivativeOrder as ProtoMsgCancelDerivativeOrder } from "../../gen/injective/exchange/v1beta1/tx";
import type { MsgCancelDerivativeOrderParams } from "../../types/chain/messages/msgCancelDerivativeOrder";
import { MsgBase } from "../MsgBase";

export class MsgCancelDerivativeOrder extends MsgBase<
  MsgCancelDerivativeOrderParams,
  ProtoMsgCancelDerivativeOrder
> {
  toProto(): ProtoMsgCancelDerivativeOrder {
    const { params } = this;

    return ProtoMsgCancelDerivativeOrder.create({
      sender: params.injectiveAddress,
      marketId: params.marketId,
      subaccountId: params.subaccountId,
      orderHash: params.orderHash ?? "",
      orderMask: params.orderMask ?? OrderMask.ANY,
      cid: params.cid ?? "",
    });
  }

  toDirectSign(): {
    type: "/injective.exchange.v1beta1.MsgCancelDerivativeOrder";
    message: ProtoMsgCancelDerivativeOrder;
  } {
    return {
      type: "/injective.exchange.v1beta1.MsgCancelDerivativeOrder",
      message: this.toProto(),
    };
  }

  toBinary(): Buffer {
    return Buffer.from(
      ProtoMsgCancelDerivativeOrder.encode(this.toProto()).finish(),
    );
  }

  toAmino(): {
    type: "exchange/MsgCancelDerivativeOrder";
    value: {
      sender: string;
      market_id: string;
      subaccount_id: string;
      order_hash: string;
      order_mask: number;
      cid: string;
    };
  } {
    const proto = this.toProto();

    return {
      type: "exchange/MsgCancelDerivativeOrder",
      value: {
        sender: proto.sender,
        market_id: proto.marketId,
        subaccount_id: proto.subaccountId,
        order_hash: proto.orderHash,
        order_mask: proto.orderMask,
        cid: proto.cid,
      },
    };
  }
}
