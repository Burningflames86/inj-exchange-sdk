import { MsgSend as ProtoMsgSend } from "../../gen/cosmos/bank/v1beta1/tx";
import { MsgBase } from "../MsgBase";

export class MsgSend extends MsgBase<ProtoMsgSend, ProtoMsgSend> {
  toProto(): ProtoMsgSend {
    return ProtoMsgSend.create(this.params);
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
