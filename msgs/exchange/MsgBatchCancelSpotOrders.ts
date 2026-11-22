import { OrderMask } from "../../gen/injective/exchange/v1beta1/exchange";
import {
  MsgBatchCancelSpotOrders as ProtoMsgBatchCancelSpotOrders,
  OrderData,
} from "../../gen/injective/exchange/v1beta1/tx";
import type { MsgBatchCancelSpotOrdersParams } from "../../types/chain/msgs";
import { MsgBase } from "../MsgBase";

export class MsgBatchCancelSpotOrders extends MsgBase<
  MsgBatchCancelSpotOrdersParams,
  ProtoMsgBatchCancelSpotOrders
> {
  toProto(): ProtoMsgBatchCancelSpotOrders {
    const { params } = this;

    return ProtoMsgBatchCancelSpotOrders.create({
      sender: params.injectiveAddress,
      data: params.orders.map((order) =>
        OrderData.create({
          marketId: order.marketId,
          subaccountId: order.subaccountId,
          orderHash: order.orderHash ?? "",
          orderMask: order.orderMask ?? OrderMask.ANY,
          cid: order.cid ?? "",
        }),
      ),
    });
  }

  toDirectSign(): {
    type: "/injective.exchange.v1beta1.MsgBatchCancelSpotOrders";
    message: ProtoMsgBatchCancelSpotOrders;
  } {
    return {
      type: "/injective.exchange.v1beta1.MsgBatchCancelSpotOrders",
      message: this.toProto(),
    };
  }

  toBinary(): Buffer {
    return Buffer.from(
      ProtoMsgBatchCancelSpotOrders.encode(this.toProto()).finish(),
    );
  }

  toAmino(): {
    type: "exchange/MsgBatchCancelSpotOrders";
    value: {
      sender: string;
      data: {
        market_id: string;
        subaccount_id: string;
        order_hash: string;
        order_mask: number;
        cid: string;
      }[];
    };
  } {
    const proto = this.toProto();

    return {
      type: "exchange/MsgBatchCancelSpotOrders",
      value: {
        sender: proto.sender,
        data: proto.data.map((orderData) => ({
          market_id: orderData.marketId,
          subaccount_id: orderData.subaccountId,
          order_hash: orderData.orderHash,
          order_mask: orderData.orderMask,
          cid: orderData.cid,
        })),
      },
    };
  }
}
