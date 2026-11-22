import { bech32 } from "@scure/base";
import { bytesToHex, hexToBytes } from "./encoding.ts";

export function getEthereumAddress(injectiveAddress: string): string {
  if (injectiveAddress.startsWith("0x")) return injectiveAddress;
  const bytes = bech32.fromWords(bech32.decode(injectiveAddress).words);
  return `0x${bytesToHex(bytes)}`;
}

export function getInjectiveAddress(ethAddress: string): string {
  const bytes = hexToBytes(ethAddress);
  if (bytes.length !== 20) {
    throw new Error(`Invalid Ethereum address: ${ethAddress}`);
  }
  return bech32.encode("inj", bech32.toWords(bytes));
}
