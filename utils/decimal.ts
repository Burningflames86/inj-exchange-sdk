/**
 * Chain format is the fixed-point string the chain stores: the human value
 * shifted by 18 decimals, as a plain integer. "1.5" becomes
 * "1500000000000000000".
 */
export function toChainFormat(value: string | number, decimals = 18): string {
  const text = typeof value === "number" ? value.toString() : value;
  const negative = text.startsWith("-");
  const [integer = "0", fraction = ""] = text.replace("-", "").split(".");
  const padded = fraction.padEnd(decimals, "0").slice(0, decimals);
  const digits = `${integer}${padded}`.replace(/^0+(?=\d)/, "");

  return `${negative ? "-" : ""}${digits}`;
}

/**
 * The Cosmos SDK decimal string the EIP-712 payload signs: the same value as
 * toChainFormat, but with the decimal point restored. "1.5" becomes
 * "1.500000000000000000".
 */
export function toCosmosSdkDecString(
  value: string | number,
  decimals = 18,
): string {
  const chain = toChainFormat(value, decimals);
  const negative = chain.startsWith("-");
  const digits = chain.replace("-", "").padStart(decimals + 1, "0");
  const integer = digits.slice(0, -decimals);
  const fraction = digits.slice(-decimals);

  return `${negative ? "-" : ""}${integer}.${fraction}`;
}
