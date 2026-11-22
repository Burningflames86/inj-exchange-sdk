import { Consensus } from "../../gen/cometbft/version/v1/types";

export interface BlockId {
  hash: string;
  partSetHeader: { total: number; hash: string };
}

export interface CommitSignature {
  blockIdFlag: number;
  validatorAddress: string;
  timestamp: string;
  signature: string;
}

export interface Commit {
  height: number;
  round: number;
  blockId: BlockId | undefined;
  signatures: CommitSignature[];
}

export interface BlockHeader {
  version: Consensus | undefined;
  chainId: string;
  height: number;
  time: string;
  lastBlockId: BlockId | undefined;
  lastCommitHash: string;
  dataHash: string;
  validatorsHash: string;
  nextValidatorsHash: string;
  consensusHash: string;
  appHash: string;
  lastResultsHash: string;
  evidenceHash: string;
  proposerAddress: string;
}

export interface Block {
  header: BlockHeader;
  data: { txs: string[] };
  evidence: unknown;
  lastCommit: Commit | undefined;
}

export interface BlockResponse {
  blockId: BlockId;
  block: Block;
}
