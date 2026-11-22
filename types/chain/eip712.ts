export interface Eip712TypedDataField {
  name: string;
  type: string;
}

export interface Eip712TypedData {
  types: Record<string, Eip712TypedDataField[]>;
  primaryType: "Tx";
  domain: {
    name: string;
    version: string;
    chainId: string;
    verifyingContract: string;
    salt: string;
  };
  /** The transaction context, JSON encoded. */
  message: {
    context: string;
    msgs: string;
  };
}
