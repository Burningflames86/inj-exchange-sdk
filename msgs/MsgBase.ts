/**
 * Base for the messages a transaction can carry. A subclass names the type URL
 * it is registered under on chain and knows how to encode itself, so nothing
 * else in the SDK has to work out which codec a message belongs to.
 */
export abstract class MsgBase<Params, ProtoMsg> {
  public readonly params: Params;

  constructor(params: Params) {
    this.params = params;
  }

  static fromJSON<T extends MsgBase<any, any>>(
    this: new (params: any) => T,
    params: any,
  ): T {
    return new this(params);
  }

  abstract toProto(): ProtoMsg;
  abstract toDirectSign(): { type: string; message: ProtoMsg };
  abstract toBinary(): Buffer;
  abstract toAmino(): { type: string; value: Record<string, unknown> };

  toWeb3Gw(): { "@type": string } & Record<string, unknown> {
    return { "@type": this.toDirectSign().type, ...this.toAmino().value };
  }

  toEip712V2(): { "@type": string } & Record<string, unknown> {
    return this.toWeb3Gw();
  }
}
