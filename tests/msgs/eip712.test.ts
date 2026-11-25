import { describe, expect, it } from "bun:test";
import { MsgCreateDerivativeMarketOrder } from "../../msgs/exchange/MsgCreateDerivativeMarketOrder";
import { MsgCreateSpotLimitOrder } from "../../msgs/exchange/MsgCreateSpotLimitOrder";
import { OrderType } from "../../types/chain/enums";
import { getEip712TypedDataV2 } from "../../utils/eip712";

const WALLET = "inj1t856crh0yjz75xzze48ruyg86kj5wj82ez36r5";
const SUB_ONE =
  "0x59e9ac0eef2485ea1842cd4e3e1107d5a54748ea000000000000000000000001";
const INJ_PERP =
  "0x790aee464fbbd02cf4476444554c71d1225f7edfe15e6dc7f874c455fd883d31";
const INJ_USDC_SPOT =
  "0xa8c14f892f7f7d2516442220a05b652d5afee3f57a5495981dfad7c99ef78e84";

const tx = {
  accountNumber: 2528069,
  sequence: 83,
  chainId: "injective-1" as never,
  timeoutHeight: 193142000,
};
const fee = {
  amount: [{ denom: "inj", amount: "112000000000000" }],
  gas: "700000",
};

const typedFor = (msgs: Parameters<typeof getEip712TypedDataV2>[0]["msgs"]) =>
  getEip712TypedDataV2({ msgs, tx, fee, evmChainId: 1 as never });

const parsedMessage = (typed: ReturnType<typeof typedFor>) =>
  JSON.parse((typed.message as { msgs: string }).msgs) as {
    "@type": string;
    sender: string;
    order: Record<string, unknown>;
  }[];

/**
 * The chain does not accept a payload that merely contains the right values: it
 * rebuilds the typed data from its own field order and compares. `expiration_block`
 * signed before `trigger_price` is a failed signature with `unauthorized`, which
 * is what made these tests worth writing field by field rather than value by value.
 */
describe("the EIP-712 payload", () => {
  it("orders a spot order's keys the way the chain rebuilds them", () => {
    const typed = typedFor(
      new MsgCreateSpotLimitOrder({
        injectiveAddress: WALLET,
        marketId: INJ_USDC_SPOT,
        subaccountId: SUB_ONE,
        feeRecipient: WALLET,
        price: "1",
        quantity: "2",
        orderType: OrderType.BUY,
      }),
    );

    expect(Object.keys(parsedMessage(typed)[0]!.order)).toEqual([
      "market_id",
      "order_info",
      "order_type",
      "trigger_price",
      "expiration_block",
    ]);
  });

  it("orders a derivative order's keys the way the chain rebuilds them", () => {
    const typed = typedFor(
      new MsgCreateDerivativeMarketOrder({
        injectiveAddress: WALLET,
        marketId: INJ_PERP,
        subaccountId: SUB_ONE,
        feeRecipient: WALLET,
        price: "6.5",
        quantity: "0.18",
        margin: "0.3",
        orderType: OrderType.BUY,
      }),
    );

    expect(Object.keys(parsedMessage(typed)[0]!.order)).toEqual([
      "market_id",
      "order_info",
      "order_type",
      "margin",
      "trigger_price",
      "expiration_block",
    ]);
  });

  it("orders the context the way the chain rebuilds it", () => {
    const typed = typedFor(
      new MsgCreateSpotLimitOrder({
        injectiveAddress: WALLET,
        marketId: INJ_USDC_SPOT,
        subaccountId: SUB_ONE,
        feeRecipient: WALLET,
        price: "1",
        quantity: "2",
        orderType: OrderType.BUY,
      }),
    );

    expect(
      Object.keys(JSON.parse((typed.message as { context: string }).context)),
    ).toEqual([
      "account_number",
      "chain_id",
      "fee",
      "memo",
      "sequence",
      "timeout_height",
    ]);
  });

  it("signs the human values as 18-decimal strings", () => {
    const typed = typedFor(
      new MsgCreateDerivativeMarketOrder({
        injectiveAddress: WALLET,
        marketId: INJ_PERP,
        subaccountId: SUB_ONE,
        feeRecipient: WALLET,
        price: "6.5",
        quantity: "0.18",
        margin: "0.3",
        orderType: OrderType.BUY,
      }),
    );

    const order = parsedMessage(typed)[0]!.order as {
      order_info: { price: string; quantity: string };
      margin: string;
    };
    expect(order.order_info.price).toBe("6.500000000000000000");
    expect(order.order_info.quantity).toBe("0.180000000000000000");
    expect(order.margin).toBe("0.300000000000000000");
  });

  it("carries expiration_block as a string of the block number", () => {
    const typed = typedFor(
      new MsgCreateSpotLimitOrder({
        injectiveAddress: WALLET,
        marketId: INJ_USDC_SPOT,
        subaccountId: SUB_ONE,
        feeRecipient: WALLET,
        price: "1",
        quantity: "2",
        orderType: OrderType.BUY,
        expirationBlock: 193150000,
      }),
    );

    expect(
      (parsedMessage(typed)[0]!.order as { expiration_block: string })
        .expiration_block,
    ).toBe("193150000");
  });

  it("defaults expiration_block to zero, which means no expiry", () => {
    const typed = typedFor(
      new MsgCreateSpotLimitOrder({
        injectiveAddress: WALLET,
        marketId: INJ_USDC_SPOT,
        subaccountId: SUB_ONE,
        feeRecipient: WALLET,
        price: "1",
        quantity: "2",
        orderType: OrderType.BUY,
      }),
    );

    expect(
      (parsedMessage(typed)[0]!.order as { expiration_block: string })
        .expiration_block,
    ).toBe("0");
  });

  it("declares the domain and the two message fields the chain expects", () => {
    const typed = typedFor(
      new MsgCreateSpotLimitOrder({
        injectiveAddress: WALLET,
        marketId: INJ_USDC_SPOT,
        subaccountId: SUB_ONE,
        feeRecipient: WALLET,
        price: "1",
        quantity: "2",
        orderType: OrderType.BUY,
      }),
    );

    expect(typed.primaryType).toBe("Tx");
    expect(typed.types.Tx).toEqual([
      { name: "context", type: "string" },
      { name: "msgs", type: "string" },
    ]);
    expect(typed.types.EIP712Domain?.map((field) => field.name)).toEqual([
      "name",
      "version",
      "chainId",
      "verifyingContract",
      "salt",
    ]);
    expect(typed.domain).toMatchObject({
      name: "Injective Web3",
      version: "1.0.0",
      chainId: "0x1",
      verifyingContract: "0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC",
      salt: "0",
    });
  });
});
