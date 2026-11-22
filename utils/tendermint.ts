import { GetLatestBlockResponse } from "../gen/cosmos/base/tendermint/v1beta1/query";
import { Block as CosmosBlock } from "../gen/cometbft/types/v1/block";
import { Block as TendermintBlock } from "../gen/cosmos/base/tendermint/v1beta1/types";
import { Block, BlockId, BlockResponse } from "../types/chain/tendermint";

type AnyBlock = CosmosBlock | TendermintBlock;

function encode(bytes: Uint8Array | undefined): string {
  return Buffer.from(bytes ?? []).toString("base64");
}

function sanitizeBlockId(
  blockId:
    | { hash: Uint8Array; partSetHeader?: { total: number; hash: Uint8Array } }
    | undefined,
): BlockId | undefined {
  if (!blockId) return undefined;
  return {
    hash: encode(blockId.hash),
    partSetHeader: {
      total: blockId.partSetHeader?.total ?? 0,
      hash: encode(blockId.partSetHeader?.hash),
    },
  };
}

export function sanitizeBlock(block: AnyBlock): Block {
  const header = block.header!;
  return {
    header: {
      version: header.version,
      chainId: header.chainId,
      height: Number(header.height),
      time: header.time!.toISOString(),
      lastBlockId: sanitizeBlockId(header.lastBlockId),
      lastCommitHash: encode(header.lastCommitHash),
      dataHash: encode(header.dataHash),
      validatorsHash: encode(header.validatorsHash),
      nextValidatorsHash: encode(header.nextValidatorsHash),
      consensusHash: encode(header.consensusHash),
      appHash: encode(header.appHash),
      lastResultsHash: encode(header.lastResultsHash),
      evidenceHash: encode(header.evidenceHash),
      proposerAddress: String(header.proposerAddress),
    },
    data: { txs: (block.data?.txs ?? []).map(encode) },
    evidence: block.evidence,
    lastCommit: block.lastCommit
      ? {
          height: Number(block.lastCommit.height),
          round: block.lastCommit.round,
          blockId: sanitizeBlockId(block.lastCommit.blockId),
          signatures: (block.lastCommit.signatures ?? []).map((sig) => ({
            blockIdFlag: sig.blockIdFlag,
            validatorAddress: encode(sig.validatorAddress),
            timestamp: sig.timestamp!.toISOString(),
            signature: encode(sig.signature),
          })),
        }
      : undefined,
  };
}

export function sanitizeLatestBlock(
  response: GetLatestBlockResponse,
): BlockResponse {
  return {
    blockId: sanitizeBlockId(response.blockId)!,
    block: sanitizeBlock((response.sdkBlock ?? response.block)!),
  };
}
