import { describe, expect, it } from "bun:test";
import { toChainFormat, toCosmosSdkDecString } from "../../utils/decimal";

describe("toChainFormat", () => {
  const cases: [string | number, string][] = [
    ["1.5", "1500000000000000000"],
    ["6.35", "6350000000000000000"],
    ["0.18", "180000000000000000"],
    ["2", "2000000000000000000"],
    ["0", "0"],
    [".5", "500000000000000000"],
    ["-.5", "-500000000000000000"],
    [1.5, "1500000000000000000"],
    ["0.000000000000000001", "1"],
  ];

  for (const [input, expected] of cases) {
    it(`${input} becomes ${expected}`, () => {
      expect(toChainFormat(input)).toBe(expected);
    });
  }

  it("drops precision past 18 decimals rather than rounding up", () => {
    expect(toChainFormat("0.0000000000000000009")).toBe("0");
  });
});

describe("toCosmosSdkDecString", () => {
  const cases: [string | number, string][] = [
    ["1.5", "1.500000000000000000"],
    ["6.35", "6.350000000000000000"],
    ["0.18", "0.180000000000000000"],
    ["0", "0.000000000000000000"],
    ["-2.5", "-2.500000000000000000"],
  ];

  for (const [input, expected] of cases) {
    it(`${input} signs as ${expected}`, () => {
      expect(toCosmosSdkDecString(input)).toBe(expected);
    });
  }

  it("keeps the value that toChainFormat produced", () => {
    for (const value of ["6.5", "0.18", "0.3", "1234.5678"]) {
      const chain = toChainFormat(value);
      const signed = toCosmosSdkDecString(value);
      expect(signed.replace(".", "").replace(/^0+(?=\d)/, "")).toBe(chain);
    }
  });
});
