import { MsgCancelSpotOrder as ProtoMsgCancelSpotOrder } from "../../gen/injective/exchange/v1beta1/tx";
import type { MsgCancelSpotOrderParams } from "../../types/chain/messages/msgCancelSpotOrder";
import { MsgBase } from "../MsgBase";

export class MsgCancelSpotOrder extends MsgBase<
  MsgCancelSpotOrderParams,
  ProtoMsgCancelSpotOrder
> {
  toProto(): ProtoMsgCancelSpotOrder {
    const { params } = this;

    return ProtoMsgCancelSpotOrder.create({
      sender: params.injectiveAddress,
      marketId: params.marketId,
      subaccountId: params.subaccountId,
      orderHash: params.orderHash ?? "",
      cid: params.cid ?? "",
    });
  }

  toDirectSign(): {
    type: "/injective.exchange.v1beta1.MsgCancelSpotOrder";
    message: ProtoMsgCancelSpotOrder;
  } {
    return {
      type: "/injective.exchange.v1beta1.MsgCancelSpotOrder",
      message: this.toProto(),
    };
  }

  toBinary(): Buffer {
    return Buffer.from(ProtoMsgCancelSpotOrder.encode(this.toProto()).finish());
  }

  toAmino(): {
    type: "exchange/MsgCancelSpotOrder";
    value: {
      sender: string;
      market_id: string;
      subaccount_id: string;
      order_hash: string;
      cid: string;
    };
  } {
    const proto = this.toProto();

    return {
      type: "exchange/MsgCancelSpotOrder",
      value: {
        sender: proto.sender,
        market_id: proto.marketId,
        subaccount_id: proto.subaccountId,
        order_hash: proto.orderHash,
        cid: proto.cid,
      },
    };
  }
}
