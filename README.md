# inj-exchange-sdk

Native gRPC clients and exchange messages for the Injective backend, with the
EIP-712 transaction assembly that goes with them. It holds no key: you sign, and
the SDK hands you the bytes.

## Why this exists

`@injectivelabs/sdk-ts` reaches the chain and the indexer over **gRPC-web**. That is
the right choice in a browser and a detour in a backend: every call crosses an
Envoy hop in front of the node, and the client carries a wallet-and-cosmos platform
this service never touches — 68 packages, 181 MB installed, 705 ms to import.

This SDK speaks native gRPC over `@grpc/grpc-js` to the same endpoints, so nothing
sits between the backend and the node. It installs 35 packages, 105 MB, and imports
in 67 ms.

The hop is not the bottleneck. Measured against the public endpoints, p50 is within
5% and throughput at 64 calls in flight is within 3%, because a call spends its time
inside the endpoint rather than in the proxy. What native gRPC does buy is the tail:
on an orderbook read gRPC-web reached 871 ms at p95 where native stayed at 259 ms.
It also lets the client point at a node's own port 9090 with no proxy to stand up,
which is the lever that matters.

## Scope

This is **not** a complete copy of `injective-sdk`, and it is not trying to be. It
is written for **Falq**, which is in development, and it implements the parts Falq
needs: the trading messages, the queries around accounts, markets, orders and
positions, and the transaction assembly to submit them.

Everything else is absent on purpose — governance and admin messages, market
launch, fee delegation, bridge and Mito services, the gRPC-web transports, and
wallet handling of any kind. If Falq grows a need, the class gets added; until
then the surface stays small enough to read.

Every exchange message class here has been carried in a mainnet transaction, and
`MsgSend` has moved real INJ. The account was left flat afterwards: no positions,
no resting orders.

There is no message for decreasing a position's margin. Mainnet answers
`code 92: The current feature has been disabled` for it, so the class is not
shipped rather than shipped and guaranteed to fail.

## What is in the box

Six entry points, each a layer:

| Import | What it gives you |
| --- | --- |
| `@burningflames/inj-exchange-sdk` | everything below, in one import |
| `@burningflames/inj-exchange-sdk/clients/chain` | native gRPC clients for the chain: account, bank, exchange, tx, tendermint, authz |
| `@burningflames/inj-exchange-sdk/clients/indexer` | native gRPC clients for the indexer: markets, orders, positions, trades, balances, and the stream clients |
| `@burningflames/inj-exchange-sdk/msgs` | 14 message classes: the 13 exchange actions plus bank `MsgSend` |
| `@burningflames/inj-exchange-sdk/types` | orders, pagination, fees, EIP-712 shape, enums, `ApiError`, stream state |
| `@burningflames/inj-exchange-sdk/utils` | `getEip712TypedDataV2`, the transaction builders, decimal scaling, address conversion |

TypeScript sources are compiled to `dist/` in both ESM and CommonJS, with
declarations for each.

## Install

```sh
bun add @burningflames/inj-exchange-sdk
# or: npm i @burningflames/inj-exchange-sdk
# or: pnpm add / yarn add @burningflames/inj-exchange-sdk
```

Everything it needs installs with it — `@grpc/grpc-js`, `@bufbuild/protobuf`,
`@scure/base`, `eventemitter3` and `viem` — and there are no peer dependencies to
add yourself. Type declarations ship in the package, so nothing extra is needed
for TypeScript.

It loads as ESM or as CommonJS, from the package root or any of the six entry
points:

```ts
import { MsgDeposit } from "@burningflames/inj-exchange-sdk/msgs";
import { getEip712TypedDataV2 } from "@burningflames/inj-exchange-sdk/utils";
```

```js
const { MsgDeposit } = require("@burningflames/inj-exchange-sdk/msgs");
const { getEip712TypedDataV2 } = require("@burningflames/inj-exchange-sdk/utils");
```

`gen/` is not importable: the proto layer reaches you only through these entry
points, so `@burningflames/inj-exchange-sdk/gen/...` fails with
`ERR_PACKAGE_PATH_NOT_EXPORTED` by design.

From a checkout instead: `bun pm pack` builds and packs the tarball — `dist/`,
`package.json`, `README.md`, `LICENSE` and `NOTICE` — which installs with
`bun add ./burningflames-inj-exchange-sdk-0.1.0.tgz`.

Bun blocks one postinstall from a dependency, `protobufjs` arriving through
`@grpc/grpc-js`. It only prints a version-pinning warning when the consumer pins
`protobufjs` itself, and nothing is built or fetched, so it is safe to leave
blocked or to allow with `bun pm trust protobufjs`.

## Sending a transaction

The SDK builds and encodes. You sign, because the key is yours — Turnkey, Privy,
or an exported key. Six calls:

```ts
import { hashTypedData } from "viem";
import {
  ChainAuthApiClient,
  ChainTendermintApiClient,
  ChainTxApiClient,
} from "@burningflames/inj-exchange-sdk/clients/chain";
import { MsgDeposit } from "@burningflames/inj-exchange-sdk/msgs";
import { ChainId, EvmChainId, SignMode, type StdFee } from "@burningflames/inj-exchange-sdk/types";
import {
  createTransaction,
  createTxBytes,
  createTxRawEIP712,
  createWeb3Extension,
  getEip712TypedDataV2,
} from "@burningflames/inj-exchange-sdk/utils";

const endpoint = "sentry.chain.grpc.injective.network:443";
const auth = new ChainAuthApiClient(endpoint);
const tendermint = new ChainTendermintApiClient(endpoint);
const txClient = new ChainTxApiClient(endpoint);

const sender = "inj1...";
const message = new MsgDeposit({
  injectiveAddress: sender,
  subaccountId: "0x<address>00000000000000000000000000000000000000000000000000000000000001",
  amount: { denom: "erc20:0xa00C59fF5a080D2b954d0c75e46E22a0c371235a", amount: "3000" },
});

// 1. what the chain knows about the account, and how long this may take
const { baseAccount } = await auth.fetchAccount(sender);
const { block } = await tendermint.fetchLatestBlock();
const fee: StdFee = { amount: [{ denom: "inj", amount: "112000000000000" }], gas: "400000" };

// 2. the typed data the chain verifies against
const typedData = getEip712TypedDataV2({
  msgs: message,
  tx: {
    accountNumber: baseAccount.accountNumber,
    sequence: baseAccount.sequence,
    chainId: ChainId.Mainnet,
    timeoutHeight: block.header.height + 60,
  },
  fee,
  evmChainId: EvmChainId.Mainnet,
});

// 3. sign it. Turnkey signs the hash; Privy signs the typed data itself.
const signature = await signer.signTypedData(typedData); // or signer.sign(hashTypedData(typedData))

// 4. assemble, 5. attach the web3 extension, 6. broadcast
const { txRaw } = createTransaction({
  message,
  signMode: SignMode.SIGN_MODE_EIP712_V2,
  fee,
  pubKey: baseAccount.pubKey?.key ?? "",
  accountNumber: baseAccount.accountNumber,
  sequence: baseAccount.sequence,
  timeoutHeight: block.header.height + 60,
  chainId: ChainId.Mainnet,
});
const withExtension = createTxRawEIP712({
  txRaw,
  extension: createWeb3Extension({ evmChainId: EvmChainId.Mainnet }),
});
withExtension.signatures = [Buffer.from(signature.replace("0x", ""), "hex")];

await txClient.broadcast(withExtension);
```

A fresh account has no public key on chain yet; `auth.fetchAccount` returns
`baseAccount.pubKey.key` once it has sent something, and until then you supply
the key yourself.

## What the chain enforces

**Order values are the human number × 1e18.** Price, quantity and margin alike.
`toChainFormat` does that conversion and every message class calls it — do not
scale anything yourself.

**`expiration_block` is part of the signature, and its position matters.** The
chain rebuilds the EIP-712 payload from its own field order and compares; the
order has to be `market_id, order_info, order_type, [margin,] trigger_price,
expiration_block`. Anywhere else and signature verification fails with
`unauthorized`. `getEip712TypedDataV2` emits that order, and `tests/msgs/eip712.test.ts`
asserts it.

**Prices sit on the market's tick grid.** A slippage bound computed as
`lastPrice × 1.05` will land at `6.5932` and be rejected: `must be a multiple of
the minimum price tick size 0.001`. Round to the tick.

**Orders have a minimum notional of 1 USDC.** `price × quantity` has to clear it,
so a 0.6 INJ bid at 1.0 is rejected with `invalid notional`.

**A market order's price bound is a real price.** It fills at the book and only
fails if the book is past the bound, so a couple of percent is enough — and the
initial-margin check uses the bound, not the fill, so a generous bound costs you
margin headroom.

**`countTotal` is refused by public endpoints.** Counting the full set walks all of
it; over gRPC the call hangs until the upstream times out. Paginate with the
cursor.

**Order types.** Spot orders accept `BUY`, `SELL` and the post-only variants;
`TAKE_BUY` is rejected. Derivative `TAKE_BUY`/`TAKE_SELL` are conditional orders
and need a trigger price.

**Deposits cannot target the default subaccount.** Use nonce ≥ 1.

## Markets used for the proofs

- INJ/USDC PERP `0x790aee464fbbd02cf4476444554c71d1225f7edfe15e6dc7f874c455fd883d31` — quote USDC `erc20:0xa00C59fF5a080D2b954d0c75e46E22a0c371235a`, initial margin ratio 0.0333 (30x), minimum quantity 0.01 INJ
- INJ/USDC spot `0xa8c14f892f7f7d2516442220a05b652d5afee3f57a5495981dfad7c99ef78e84` — base `inj`, quote the same USDC, minimum notional 1 USDC

## Development

```sh
bun run check     # oxlint, oxfmt --check, tsc --noEmit, bun test
bun test          # 59 tests: encodings, EIP-712 payload, decimal scaling, pagination
bun run build     # tsdown → dist/, ESM and CJS with declarations
bun run check:pack # the file list a publish would carry; refuses an unexpected one
bun pm pack       # the publishable tarball
```

`tests/msgs/encoding.fixtures.json` freezes the bytes of every message class — the bytes
mainnet transactions carried. If a change alters them, `bun run record:fixtures`
re-records them, and the diff is the review.

## License

Apache-2.0, see [LICENSE](LICENSE). The generated sources under `gen/` come from
Injective's protocol definitions and keep their attribution, as [NOTICE](NOTICE)
records.
