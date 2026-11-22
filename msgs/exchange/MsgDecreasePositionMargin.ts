import { MsgDecreasePositionMargin as ProtoMsgDecreasePositionMargin } from "../../gen/injective/exchange/v1beta1/tx";
import type { MsgDecreasePositionMarginParams } from "../../types/chain/messages/msgDecreasePositionMargin";
import { toChainFormat, toCosmosSdkDecString } from "../../utils/decimal";
import { MsgBase } from "../MsgBase";

export class MsgDecreasePositionMargin extends MsgBase<
  MsgDecreasePositionMarginParams,
  ProtoMsgDecreasePositionMargin
> {
  toProto(): ProtoMsgDecreasePositionMargin {
    const { params } = this;

    return ProtoMsgDecreasePositionMargin.create({
      sender: params.injectiveAddress,
      sourceSubaccountId: params.srcSubaccountId,
      destinationSubaccountId: params.dstSubaccountId,
      marketId: params.marketId,
      amount: toChainFormat(params.amount),
    });
  }

  toDirectSign(): {
    type: "/injective.exchange.v1beta1.MsgDecreasePositionMargin";
    message: ProtoMsgDecreasePositionMargin;
  } {
    return {
      type: "/injective.exchange.v1beta1.MsgDecreasePositionMargin",
      message: this.toProto(),
    };
  }

  toBinary(): Buffer {
    return Buffer.from(
      ProtoMsgDecreasePositionMargin.encode(this.toProto()).finish(),
    );
  }

  toAmino(): {
    type: "exchange/MsgDecreasePositionMargin";
    value: {
      sender: string;
      source_subaccount_id: string;
      destination_subaccount_id: string;
      market_id: string;
      amount: string;
    };
  } {
    const proto = this.toProto();

    return {
      type: "exchange/MsgDecreasePositionMargin",
      value: {
        sender: proto.sender,
        source_subaccount_id: proto.sourceSubaccountId,
        destination_subaccount_id: proto.destinationSubaccountId,
        market_id: proto.marketId,
        amount: this.params.amount,
      },
    };
  }

  override toEip712V2(): {
    "@type": string;
    sender: string;
    source_subaccount_id: string;
    destination_subaccount_id: string;
    market_id: string;
    amount: string;
  } {
    const proto = this.toProto();

    return {
      "@type": this.toDirectSign().type,
      sender: proto.sender,
      source_subaccount_id: proto.sourceSubaccountId,
      destination_subaccount_id: proto.destinationSubaccountId,
      market_id: proto.marketId,
      amount: toCosmosSdkDecString(this.params.amount),
    };
  }
}
