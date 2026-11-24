import { Coin } from "../../gen/cosmos/base/v1beta1/coin";
import { MsgExternalTransfer as ProtoMsgExternalTransfer } from "../../gen/injective/exchange/v2/tx";
import type { MsgExternalTransferParams } from "../../types/chain/messages/msgExternalTransfer";
import { MsgBase } from "../MsgBase";

export class MsgExternalTransfer extends MsgBase<
  MsgExternalTransferParams,
  ProtoMsgExternalTransfer
> {
  toProto(): ProtoMsgExternalTransfer {
    const { params } = this;

    return ProtoMsgExternalTransfer.create({
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
    type: "/injective.exchange.v2.MsgExternalTransfer";
    message: ProtoMsgExternalTransfer;
  } {
    return {
      type: "/injective.exchange.v2.MsgExternalTransfer",
      message: this.toProto(),
    };
  }

  toBinary(): Buffer {
    return Buffer.from(
      ProtoMsgExternalTransfer.encode(this.toProto()).finish(),
    );
  }

  toAmino(): {
    type: "exchange/MsgExternalTransfer";
    value: {
      sender: string;
      source_subaccount_id: string;
      destination_subaccount_id: string;
      amount: { denom: string; amount: string };
    };
  } {
    const proto = this.toProto();

    return {
      type: "exchange/MsgExternalTransfer",
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
