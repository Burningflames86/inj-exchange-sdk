import { Coin } from "../../gen/cosmos/base/v1beta1/coin";
import { MsgSubaccountTransfer as ProtoMsgSubaccountTransfer } from "../../gen/injective/exchange/v1beta1/tx";
import type { MsgSubaccountTransferParams } from "../../types/chain/messages/msgSubaccountTransfer";
import { MsgBase } from "../MsgBase";

export class MsgSubaccountTransfer extends MsgBase<
  MsgSubaccountTransferParams,
  ProtoMsgSubaccountTransfer
> {
  toProto(): ProtoMsgSubaccountTransfer {
    const { params } = this;

    return ProtoMsgSubaccountTransfer.create({
      sender: params.injectiveAddress,
      sourceSubaccountId: params.srcSubaccountId,
      destinationSubaccountId: params.dstSubaccountId,
      amount: Coin.create({
        denom: params.amount.denom,
        amount: params.amount.amount,
      }),
    });
  }

  toDirectSign(): {
    type: "/injective.exchange.v1beta1.MsgSubaccountTransfer";
    message: ProtoMsgSubaccountTransfer;
  } {
    return {
      type: "/injective.exchange.v1beta1.MsgSubaccountTransfer",
      message: this.toProto(),
    };
  }

  toBinary(): Buffer {
    return Buffer.from(
      ProtoMsgSubaccountTransfer.encode(this.toProto()).finish(),
    );
  }

  toAmino(): {
    type: "exchange/MsgSubaccountTransfer";
    value: {
      sender: string;
      source_subaccount_id: string;
      destination_subaccount_id: string;
      amount: { denom: string; amount: string };
    };
  } {
    const proto = this.toProto();

    return {
      type: "exchange/MsgSubaccountTransfer",
      value: {
        sender: proto.sender,
        source_subaccount_id: proto.sourceSubaccountId,
        destination_subaccount_id: proto.destinationSubaccountId,
        amount: {
          denom: proto.amount!.denom,
          amount: proto.amount!.amount,
        },
      },
    };
  }
}
