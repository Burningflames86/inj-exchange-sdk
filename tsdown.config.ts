import { defineConfig } from "tsdown";

/**
 * Six doors, the way injective-ts ships itself: a package root and one per
 * layer. `gen/` is never an entry — it reaches consumers through the types
 * our own modules re-export, so the proto package stays an implementation
 * detail rather than an API surface.
 */
export default defineConfig({
  entry: {
    index: "./index.ts",
    "clients/chain": "./clients/chain/index.ts",
    "clients/indexer": "./clients/indexer/index.ts",
    msgs: "./msgs/index.ts",
    types: "./types/index.ts",
    utils: "./utils/index.ts",
  },
  format: ["esm", "cjs"],
  dts: { tsconfig: "./tsconfig.build.json" },
  treeshake: true,
  clean: true,
  target: "es2022",
  platform: "neutral",
  outDir: "dist",
  external: [
    "@bufbuild/protobuf",
    "@grpc/grpc-js",
    "@scure/base",
    "eventemitter3",
    "viem",
  ],
});
