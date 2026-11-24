import { OrderMask } from "../../gen/injective/exchange/v2/order";
import {
  MsgBatchCancelDerivativeOrders as ProtoMsgBatchCancelDerivativeOrders,
  OrderData,
} from "../../gen/injective/exchange/v2/tx";
import type { MsgBatchCancelDerivativeOrdersParams } from "../../types/chain/messages/msgBatchCancelDerivativeOrders";
import { MsgBase } from "../MsgBase";

export class MsgBatchCancelDerivativeOrders extends MsgBase<
  MsgBatchCancelDerivativeOrdersParams,
  ProtoMsgBatchCancelDerivativeOrders
> {
  toProto(): ProtoMsgBatchCancelDerivativeOrders {
    const { params } = this;

    return ProtoMsgBatchCancelDerivativeOrders.create({
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
    type: "/injective.exchange.v2.MsgBatchCancelDerivativeOrders";
    message: ProtoMsgBatchCancelDerivativeOrders;
  } {
    return {
      type: "/injective.exchange.v2.MsgBatchCancelDerivativeOrders",
      message: this.toProto(),
    };
  }

  toBinary(): Buffer {
    return Buffer.from(
      ProtoMsgBatchCancelDerivativeOrders.encode(this.toProto()).finish(),
    );
  }

  toAmino(): {
    type: "exchange/MsgBatchCancelDerivativeOrders";
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
      type: "exchange/MsgBatchCancelDerivativeOrders",
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
