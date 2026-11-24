import { Coin } from "../../gen/cosmos/base/v1beta1/coin";
import { MsgDeposit as ProtoMsgDeposit } from "../../gen/injective/exchange/v2/tx";
import type { MsgDepositParams } from "../../types/chain/messages/msgDeposit";
import { MsgBase } from "../MsgBase";

export class MsgDeposit extends MsgBase<MsgDepositParams, ProtoMsgDeposit> {
  toProto(): ProtoMsgDeposit {
    const { params } = this;

    return ProtoMsgDeposit.create({
      sender: params.injectiveAddress,
      subaccountId: params.subaccountId,
      amount: Coin.create({
        denom: params.amount.denom,
        amount: params.amount.amount,
      }),
    });
  }

  toDirectSign(): {
    type: "/injective.exchange.v2.MsgDeposit";
    message: ProtoMsgDeposit;
  } {
    return {
      type: "/injective.exchange.v2.MsgDeposit",
      message: this.toProto(),
    };
  }

  toBinary(): Buffer {
    return Buffer.from(ProtoMsgDeposit.encode(this.toProto()).finish());
  }

  toAmino(): {
    type: "exchange/MsgDeposit";
    value: { sender: string; subaccount_id: string; amount: Coin };
  } {
    const proto = this.toProto();

    return {
      type: "exchange/MsgDeposit",
      value: {
        sender: proto.sender,
        subaccount_id: proto.subaccountId,
        amount: proto.amount as Coin,
      },
    };
  }
}
