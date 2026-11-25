import { describe, expect, it } from "bun:test";
import * as msgs from "../../msgs";
import fixtures from "./encoding.fixtures.json";
import { encodingCases } from "./encodingCases";

type Fixture = { type: string; hex: string };

const recorded = fixtures as Record<string, Fixture | undefined>;

/**
 * The bytes below are the ones that ran: every encoding here was signed into a
 * transaction the chain accepted, so a diff means the wire moved under a proven
 * message. `bun run record:fixtures` re-records them on purpose.
 */
describe("message encoding", () => {
  for (const testCase of encodingCases) {
    const fixture = recorded[testCase.name];

    it(`${testCase.name} keeps its proven type`, () => {
      if (!fixture)
        throw new Error(`no recorded encoding for ${testCase.name}`);

      const message = testCase.message as unknown as {
        toDirectSign(): { type: string };
      };
      expect(message.toDirectSign().type).toBe(fixture.type);
    });

    it(`${testCase.name} keeps its proven bytes`, () => {
      if (!fixture)
        throw new Error(`no recorded encoding for ${testCase.name}`);

      const message = testCase.message as unknown as { toBinary(): Buffer };
      expect(Buffer.from(message.toBinary()).toString("hex")).toBe(fixture.hex);
    });
  }

  it("covers every message class the SDK exports", () => {
    // Derived from the barrel, not a count: adding a class without a case here
    // fails this test instead of shipping an encoding nothing pins.
    const exported = Object.entries(msgs)
      .filter(
        ([name, value]) =>
          name.startsWith("Msg") && typeof value === "function",
      )
      .map(([name]) => name)
      .sort();

    expect(encodingCases.map((testCase) => testCase.name).sort()).toEqual(
      exported,
    );

    const exchangeTypes = encodingCases
      .filter((testCase) => testCase.name !== "MsgSend")
      .map(
        (testCase) =>
          (
            testCase.message as unknown as { toDirectSign(): { type: string } }
          ).toDirectSign().type,
      );
    expect(
      exchangeTypes.every((type) => type.startsWith("/injective.exchange.v2.")),
    ).toBe(true);
  });
});
