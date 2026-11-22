import { Coin } from "../../gen/cosmos/base/v1beta1/coin";
import { MsgSend as ProtoMsgSend } from "../../gen/cosmos/bank/v1beta1/tx";
import type { MsgSendParams } from "../../types/chain/msgs";
import { MsgBase } from "../MsgBase";

export class MsgSend extends MsgBase<MsgSendParams, ProtoMsgSend> {
  toProto(): ProtoMsgSend {
    const { params } = this;
    const amounts = Array.isArray(params.amount)
      ? params.amount
      : [params.amount];

    return ProtoMsgSend.create({
      fromAddress: params.srcInjectiveAddress,
      toAddress: params.dstInjectiveAddress,
      amount: amounts.map((coin) =>
        Coin.create({ denom: coin.denom, amount: coin.amount }),
      ),
    });
  }

  toDirectSign(): {
    type: "/cosmos.bank.v1beta1.MsgSend";
    message: ProtoMsgSend;
  } {
    return { type: "/cosmos.bank.v1beta1.MsgSend", message: this.toProto() };
  }

  toBinary(): Buffer {
    return Buffer.from(ProtoMsgSend.encode(this.toProto()).finish());
  }

  toAmino(): {
    type: "cosmos-sdk/MsgSend";
    value: {
      from_address: string;
      to_address: string;
      amount: ProtoMsgSend["amount"];
    };
  } {
    const proto = this.toProto();

    return {
      type: "cosmos-sdk/MsgSend",
      value: {
        from_address: proto.fromAddress,
        to_address: proto.toAddress,
        amount: proto.amount,
      },
    };
  }
}
