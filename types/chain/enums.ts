export { BroadcastMode } from "../../gen/cosmos/tx/v1beta1/service";
export { SignMode } from "../../gen/cosmos/tx/signing/v1beta1/signing";
export { ExecutionType } from "../../gen/injective/exchange/v2/exchange";
export { OrderMask, OrderType } from "../../gen/injective/exchange/v2/order";
export { MarketStatus } from "../../gen/injective/exchange/v2/market";
export { OrderSide } from "../../gen/injective/exchange/v2/query";

export const ChainId = {
  Mainnet: "injective-1",
  Testnet: "injective-888",
  Devnet: "injective-777",
} as const;
export type ChainId = (typeof ChainId)[keyof typeof ChainId];

export const EvmChainId = {
  Mainnet: 1,
  Ropsten: 3,
  Rinkeby: 4,
  Goerli: 5,
  Kovan: 42,
  Injective: 888,
  Sepolia: 11155111,
  Ganache: 1337,
  HardHat: 31337,
  MainnetEvm: 1776,
  DevnetEvm: 1337,
  TestnetEvm: 1439,
} as const;
export type EvmChainId = (typeof EvmChainId)[keyof typeof EvmChainId];
