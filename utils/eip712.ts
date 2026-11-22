import { Msg } from "../types/chain/msgs";
import { Eip712TypedData } from "../types/chain/eip712";
import { StdFee } from "../types/chain/tx";

/**
 * The typed data an EIP-712 signer signs for a transaction. The message is two
 * JSON strings rather than nested objects, which is what the chain's verifier
 * rebuilds and compares against.
 */
export function getEip712TypedDataV2({
  msgs,
  tx,
  fee,
  evmChainId,
}: {
  msgs: Msg | Msg[];
  tx: {
    accountNumber: number;
    sequence: number;
    chainId: string;
    memo?: string;
    timeoutHeight?: number;
  };
  fee: StdFee;
  evmChainId: number;
}): Eip712TypedData {
  const eip712Msgs = (Array.isArray(msgs) ? msgs : [msgs]).map((msg) =>
    msg.toEip712V2(),
  );

  return {
    types: {
      EIP712Domain: [
        { name: "name", type: "string" },
        { name: "version", type: "string" },
        { name: "chainId", type: "uint256" },
        { name: "verifyingContract", type: "address" },
        { name: "salt", type: "string" },
      ],
      Tx: [
        { name: "context", type: "string" },
        { name: "msgs", type: "string" },
      ],
    },
    primaryType: "Tx",
    domain: {
      name: "Injective Web3",
      version: "1.0.0",
      chainId: `0x${evmChainId.toString(16)}`,
      verifyingContract: "0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC",
      salt: "0",
    },
    message: {
      context: safeBigIntStringify(getEipTxContext({ ...tx, fee })),
      msgs: safeBigIntStringify(eip712Msgs),
    },
  };
}

function getEipTxContext({
  accountNumber,
  sequence,
  fee,
  timeoutHeight,
  chainId,
  memo,
}: {
  accountNumber: number;
  sequence: number;
  chainId: string;
  memo?: string;
  timeoutHeight?: number;
  fee: StdFee;
}) {
  return {
    account_number: Number(accountNumber),
    chain_id: chainId,
    ...getEip712Fee(fee),
    memo: memo || "",
    sequence: Number(sequence),
    timeout_height: Number(timeoutHeight),
  };
}

function getEip712Fee({ amount, gas, payer, granter }: StdFee) {
  return {
    fee: {
      amount: amount.map((coin) => ({
        denom: coin.denom,
        amount: coin.amount,
      })),
      gas: Number(gas),
      ...(payer && { payer }),
      ...(granter && { granter }),
    },
  };
}

function safeBigIntStringify(value: unknown): string {
  return JSON.stringify(value, (_key, item) =>
    typeof item === "bigint" ? item.toString() : item,
  );
}
