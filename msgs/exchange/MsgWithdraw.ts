import { Coin } from "../../gen/cosmos/base/v1beta1/coin";
import { MsgWithdraw as ProtoMsgWithdraw } from "../../gen/injective/exchange/v2/tx";
import type { MsgWithdrawParams } from "../../types/chain/messages/msgWithdraw";
import { MsgBase } from "../MsgBase";

export class MsgWithdraw extends MsgBase<MsgWithdrawParams, ProtoMsgWithdraw> {
  toProto(): ProtoMsgWithdraw {
    const { params } = this;

    return ProtoMsgWithdraw.create({
      sender: params.injectiveAddress,
      subaccountId: params.subaccountId,
      amount: Coin.create({
        denom: params.amount.denom,
        amount: params.amount.amount,
      }),
    });
  }

  toDirectSign(): {
    type: "/injective.exchange.v2.MsgWithdraw";
    message: ProtoMsgWithdraw;
  } {
    return {
      type: "/injective.exchange.v2.MsgWithdraw",
      message: this.toProto(),
    };
  }

  toBinary(): Buffer {
    return Buffer.from(ProtoMsgWithdraw.encode(this.toProto()).finish());
  }

  toAmino(): {
    type: "exchange/MsgWithdraw";
    value: {
      sender: string;
      subaccount_id: string;
      amount: { denom: string; amount: string };
    };
  } {
    const proto = this.toProto();

    return {
      type: "exchange/MsgWithdraw",
      value: {
        sender: proto.sender,
        subaccount_id: proto.subaccountId,
        amount: {
          denom: proto.amount!.denom,
          amount: proto.amount!.amount,
        },
      },
    };
  }
}
