import { base64 } from "@scure/base";

const HEX_PATTERN = /^[0-9a-fA-F]*$/;

export function hexToBytes(hex: string): Uint8Array {
  const actualHex = hex.replace(/^0x/i, "");
  if (!HEX_PATTERN.test(actualHex) || actualHex.length % 2 !== 0) {
    throw new Error(`Invalid hex string: ${hex}`);
  }
  const pairs = actualHex.match(/.{1,2}/g) ?? [];
  return Uint8Array.from(pairs.map((byte) => Number.parseInt(byte, 16)));
}

export function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join(
    "",
  );
}

export function hexToBase64(hex: string): string {
  const actualHex = hex.startsWith("0x") ? hex.slice(2) : hex;
  if (actualHex.trim() === "") {
    throw new Error("Hex string cannot be empty");
  }
  return base64.encode(hexToBytes(actualHex));
}
