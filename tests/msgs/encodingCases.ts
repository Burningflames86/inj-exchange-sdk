/**
 * One message per class, with the arguments the mainnet runs used. Shared by the
 * encoding test and the recorder that freezes the bytes, so the two can never
 * drift apart.
 */
import { MsgSend } from "../../msgs/bank/MsgSend";
import { MsgBatchCancelDerivativeOrders } from "../../msgs/exchange/MsgBatchCancelDerivativeOrders";
import { MsgBatchCancelSpotOrders } from "../../msgs/exchange/MsgBatchCancelSpotOrders";
import { MsgCancelDerivativeOrder } from "../../msgs/exchange/MsgCancelDerivativeOrder";
import { MsgCancelSpotOrder } from "../../msgs/exchange/MsgCancelSpotOrder";
import { MsgCreateDerivativeLimitOrder } from "../../msgs/exchange/MsgCreateDerivativeLimitOrder";
import { MsgCreateDerivativeMarketOrder } from "../../msgs/exchange/MsgCreateDerivativeMarketOrder";
import { MsgCreateSpotLimitOrder } from "../../msgs/exchange/MsgCreateSpotLimitOrder";
import { MsgCreateSpotMarketOrder } from "../../msgs/exchange/MsgCreateSpotMarketOrder";
import { MsgDeposit } from "../../msgs/exchange/MsgDeposit";
import { MsgExternalTransfer } from "../../msgs/exchange/MsgExternalTransfer";
import { MsgIncreasePositionMargin } from "../../msgs/exchange/MsgIncreasePositionMargin";
import { MsgSubaccountTransfer } from "../../msgs/exchange/MsgSubaccountTransfer";
import { MsgWithdraw } from "../../msgs/exchange/MsgWithdraw";
import { OrderType } from "../../types/chain/enums";

const WALLET = "inj1t856crh0yjz75xzze48ruyg86kj5wj82ez36r5";
const SUB_ONE =
  "0x59e9ac0eef2485ea1842cd4e3e1107d5a54748ea000000000000000000000001";
const SUB_TWO =
  "0x59e9ac0eef2485ea1842cd4e3e1107d5a54748ea000000000000000000000002";
const USDC = "erc20:0xa00C59fF5a080D2b954d0c75e46E22a0c371235a";
const INJ_PERP =
  "0x790aee464fbbd02cf4476444554c71d1225f7edfe15e6dc7f874c455fd883d31";
const INJ_USDC_SPOT =
  "0xa8c14f892f7f7d2516442220a05b652d5afee3f57a5495981dfad7c99ef78e84";
const HASH_A = `0x${"ab".repeat(32)}`;
const HASH_C = `0x${"cd".repeat(32)}`;

export const encodingCases = [
  {
    name: "MsgSend",
    message: new MsgSend({
      srcInjectiveAddress: WALLET,
      dstInjectiveAddress: SUB_ONE,
      amount: [{ denom: "inj", amount: "1000000000000000" }],
    }),
  },
  {
    name: "MsgDeposit",
    message: new MsgDeposit({
      injectiveAddress: WALLET,
      subaccountId: SUB_TWO,
      amount: { denom: USDC, amount: "3000" },
    }),
  },
  {
    name: "MsgWithdraw",
    message: new MsgWithdraw({
      injectiveAddress: WALLET,
      subaccountId: SUB_TWO,
      amount: { denom: USDC, amount: "3000" },
    }),
  },
  {
    name: "MsgSubaccountTransfer",
    message: new MsgSubaccountTransfer({
      injectiveAddress: WALLET,
      srcSubaccountId: SUB_ONE,
      dstSubaccountId: SUB_TWO,
      amount: { denom: USDC, amount: "10000" },
    }),
  },
  {
    name: "MsgExternalTransfer",
    message: new MsgExternalTransfer({
      injectiveAddress: WALLET,
      srcSubaccountId: SUB_TWO,
      dstSubaccountId: SUB_ONE,
      amount: { denom: USDC, amount: "10000" },
    }),
  },
  {
    name: "MsgCreateSpotLimitOrder",
    message: new MsgCreateSpotLimitOrder({
      injectiveAddress: WALLET,
      marketId: INJ_USDC_SPOT,
      subaccountId: SUB_ONE,
      feeRecipient: WALLET,
      price: "1",
      quantity: "2",
      orderType: OrderType.BUY,
    }),
  },
  {
    name: "MsgCreateSpotMarketOrder",
    message: new MsgCreateSpotMarketOrder({
      injectiveAddress: WALLET,
      marketId: INJ_USDC_SPOT,
      subaccountId: SUB_ONE,
      feeRecipient: WALLET,
      price: "6.4",
      quantity: "0.2",
      orderType: OrderType.SELL,
    }),
  },
  {
    name: "MsgCancelSpotOrder",
    message: new MsgCancelSpotOrder({
      injectiveAddress: WALLET,
      marketId: INJ_USDC_SPOT,
      subaccountId: SUB_ONE,
      orderHash: HASH_A,
    }),
  },
  {
    name: "MsgBatchCancelSpotOrders",
    message: new MsgBatchCancelSpotOrders({
      injectiveAddress: WALLET,
      orders: [
        { marketId: INJ_USDC_SPOT, subaccountId: SUB_ONE, orderHash: HASH_A },
      ],
    }),
  },
  {
    name: "MsgCreateDerivativeLimitOrder",
    message: new MsgCreateDerivativeLimitOrder({
      injectiveAddress: WALLET,
      marketId: INJ_PERP,
      subaccountId: SUB_ONE,
      feeRecipient: WALLET,
      price: "1",
      quantity: "1.2",
      margin: "0.1",
      orderType: OrderType.BUY,
    }),
  },
  {
    name: "MsgCreateDerivativeMarketOrder",
    message: new MsgCreateDerivativeMarketOrder({
      injectiveAddress: WALLET,
      marketId: INJ_PERP,
      subaccountId: SUB_ONE,
      feeRecipient: WALLET,
      price: "6.5",
      quantity: "0.18",
      margin: "0.3",
      orderType: OrderType.BUY,
    }),
  },
  {
    name: "MsgCancelDerivativeOrder",
    message: new MsgCancelDerivativeOrder({
      injectiveAddress: WALLET,
      marketId: INJ_PERP,
      subaccountId: SUB_ONE,
      orderHash: HASH_C,
    }),
  },
  {
    name: "MsgBatchCancelDerivativeOrders",
    message: new MsgBatchCancelDerivativeOrders({
      injectiveAddress: WALLET,
      orders: [
        { marketId: INJ_PERP, subaccountId: SUB_ONE, orderHash: HASH_C },
      ],
    }),
  },
  {
    name: "MsgIncreasePositionMargin",
    message: new MsgIncreasePositionMargin({
      injectiveAddress: WALLET,
      marketId: INJ_PERP,
      srcSubaccountId: SUB_ONE,
      dstSubaccountId: SUB_ONE,
      amount: "0.05",
    }),
  },
];

export type EncodingCase = (typeof encodingCases)[number];
