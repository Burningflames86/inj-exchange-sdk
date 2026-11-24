import { MsgIncreasePositionMargin as ProtoMsgIncreasePositionMargin } from "../../gen/injective/exchange/v2/tx";
import type { MsgIncreasePositionMarginParams } from "../../types/chain/messages/msgIncreasePositionMargin";
import { toChainFormat, toCosmosSdkDecString } from "../../utils/decimal";
import { MsgBase } from "../MsgBase";

export class MsgIncreasePositionMargin extends MsgBase<
  MsgIncreasePositionMarginParams,
  ProtoMsgIncreasePositionMargin
> {
  toProto(): ProtoMsgIncreasePositionMargin {
    const { params } = this;

    return ProtoMsgIncreasePositionMargin.create({
      sender: params.injectiveAddress,
      sourceSubaccountId: params.srcSubaccountId,
      destinationSubaccountId: params.dstSubaccountId,
      marketId: params.marketId,
      amount: toChainFormat(params.amount),
    });
  }

  toDirectSign(): {
    type: "/injective.exchange.v2.MsgIncreasePositionMargin";
    message: ProtoMsgIncreasePositionMargin;
  } {
    return {
      type: "/injective.exchange.v2.MsgIncreasePositionMargin",
      message: this.toProto(),
    };
  }

  toBinary(): Buffer {
    return Buffer.from(
      ProtoMsgIncreasePositionMargin.encode(this.toProto()).finish(),
    );
  }

  toAmino(): {
    type: "exchange/MsgIncreasePositionMargin";
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
      type: "exchange/MsgIncreasePositionMargin",
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
