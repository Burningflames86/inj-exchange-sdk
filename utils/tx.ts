import { base64 } from "@scure/base";
import { keccak256 } from "viem";
import { PubKey as Secp256k1PubKey } from "../gen/cosmos/crypto/secp256k1/keys";
import { SignMode } from "../gen/cosmos/tx/signing/v1beta1/signing";
import {
  AuthInfo,
  Fee,
  ModeInfo,
  ModeInfo_Single,
  SignDoc,
  SignerInfo,
  TxBody,
  TxRaw as ProtoTxRaw,
} from "../gen/cosmos/tx/v1beta1/tx";
import { Any } from "../gen/google/protobuf/any";
import { PubKey as EthSecp256k1PubKey } from "../gen/injective/crypto/v1beta1/ethsecp256k1/keys";
import { ExtensionOptionsWeb3Tx } from "../gen/injective/types/v1beta1/tx_ext";
import type { EvmChainId } from "../types/chain/enums";
import { Msg } from "../types/chain/msgs";
import {
  CreateTransactionParams,
  CreateTransactionResult,
  SignerDetails,
  StdFee,
  TxRaw,
} from "../types/chain/tx";

export function createTxBytes(txRaw: TxRaw): Buffer {
  return Buffer.from(ProtoTxRaw.encode(ProtoTxRaw.create(txRaw)).finish());
}

/**
 * The extension a web3 transaction carries: the EVM chain id it was signed
 * for and, when the fee is delegated, the paying account and its signature.
 */
export function createWeb3Extension({
  evmChainId,
  feePayer,
  feePayerSig,
}: {
  evmChainId: EvmChainId;
  feePayer?: string;
  feePayerSig?: Buffer;
}): ExtensionOptionsWeb3Tx {
  return ExtensionOptionsWeb3Tx.create({
    typedDataChainID: evmChainId,
    feePayer,
    feePayerSig,
  });
}

/**
 * Appends the web3 extension to a transaction body, which is what makes the
 * transaction readable by an EIP-712 signer.
 */
export function createTxRawEIP712({
  txRaw,
  extension,
  nonCriticalExtension,
}: {
  txRaw: TxRaw;
  extension: ExtensionOptionsWeb3Tx;
  nonCriticalExtension?: Any | Any[];
}): TxRaw {
  const body = TxBody.decode(txRaw.bodyBytes);
  body.extensionOptions = [
    {
      typeUrl: "/injective.types.v1beta1.ExtensionOptionsWeb3Tx",
      value: Buffer.from(ExtensionOptionsWeb3Tx.encode(extension).finish()),
    },
  ];
  if (nonCriticalExtension) {
    body.nonCriticalExtensionOptions = Array.isArray(nonCriticalExtension)
      ? nonCriticalExtension
      : [nonCriticalExtension];
  }

  return { ...txRaw, bodyBytes: Buffer.from(TxBody.encode(body).finish()) };
}

/**
 * Builds a transaction body and auth info for one signer and returns everything
 * a DIRECT signer needs, without signing anything.
 */
export function createTransaction(
  params: CreateTransactionParams,
): CreateTransactionResult {
  const signer: SignerDetails = {
    pubKey: params.pubKey,
    accountNumber: params.accountNumber,
    sequence: params.sequence,
  };
  const message = Array.isArray(params.message)
    ? params.message
    : [params.message];

  const bodyBytes = Buffer.from(
    TxBody.encode(
      createBody({
        message,
        memo: params.memo || "",
        timeoutHeight: params.timeoutHeight,
      }),
    ).finish(),
  );
  const authInfoBytes = Buffer.from(
    AuthInfo.encode(
      createAuthInfo({
        signerInfo: [
          createSignerInfo({
            chainId: params.chainId,
            publicKey: signer.pubKey,
            sequence: signer.sequence,
            mode: params.signMode ?? SignMode.SIGN_MODE_DIRECT,
          }),
        ],
        fee: createFee(params.fee),
      }),
    ).finish(),
  );
  const signDoc = SignDoc.create({
    bodyBytes,
    authInfoBytes,
    chainId: params.chainId,
    accountNumber: signer.accountNumber,
  });
  const signBytes = Buffer.from(SignDoc.encode(signDoc).finish());

  return {
    txRaw: { bodyBytes, authInfoBytes, signatures: [] },
    signDoc,
    signBytes,
    signHashedBytes: Buffer.from(keccak256(signBytes, "bytes")),
    bodyBytes,
    authInfoBytes,
    signer,
  };
}

function createBody({
  message,
  memo,
  timeoutHeight,
}: {
  message: Msg[];
  memo: string;
  timeoutHeight?: number;
}): TxBody {
  return TxBody.create({
    messages: message.map(createAnyMessage),
    memo,
    timeoutHeight: timeoutHeight || 0,
  });
}

function createAnyMessage(msg: Msg): Any {
  return {
    typeUrl: msg.toDirectSign().type,
    value: msg.toBinary(),
  };
}

function createFee({ amount, gas, payer, granter }: StdFee): Fee {
  if (!amount.length) {
    throw new Error("fee.amount needs at least one coin to pay the fee with");
  }

  return Fee.create({
    amount: amount.map((coin) => ({ denom: coin.denom, amount: coin.amount })),
    gasLimit: Number(gas),
    payer: payer || "",
    granter: granter || "",
  });
}

function createSignerInfo({
  chainId,
  publicKey,
  sequence,
  mode,
}: {
  chainId: string;
  publicKey: string;
  sequence: number;
  mode: SignMode;
}): SignerInfo {
  return SignerInfo.create({
    publicKey: createPublicKey({ chainId, key: publicKey }),
    sequence,
    modeInfo: ModeInfo.create({
      single: ModeInfo_Single.create({ mode }),
    }),
  });
}

function createPublicKey({
  chainId,
  key,
}: {
  chainId: string;
  key: string;
}): Any {
  const bytes = Buffer.from(base64.decode(key));

  if (chainId.startsWith("injective")) {
    return {
      typeUrl: "/injective.crypto.v1beta1.ethsecp256k1.PubKey",
      value: Buffer.from(
        EthSecp256k1PubKey.encode(
          EthSecp256k1PubKey.create({ key: bytes }),
        ).finish(),
      ),
    };
  }

  return {
    typeUrl: chainId.startsWith("evmos")
      ? "/ethermint.crypto.v1.ethsecp256k1.PubKey"
      : "/cosmos.crypto.secp256k1.PubKey",
    value: Buffer.from(
      Secp256k1PubKey.encode(Secp256k1PubKey.create({ key: bytes })).finish(),
    ),
  };
}

function createAuthInfo({
  signerInfo,
  fee,
}: {
  signerInfo: SignerInfo[];
  fee: Fee;
}): AuthInfo {
  return AuthInfo.create({ signerInfos: signerInfo, fee });
}
