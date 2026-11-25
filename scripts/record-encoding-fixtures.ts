/**
 * Freezes the encodings the tests compare against. Run it only when an encoding
 * is meant to change, and say in the commit why the chain would be looking at
 * different bytes than the ones it accepted.
 */
import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { encodingCases } from "../tests/msgs/encodingCases";

const fixtures = Object.fromEntries(
  encodingCases.map((testCase) => {
    const message = testCase.message as unknown as {
      toBinary(): Buffer;
      toDirectSign(): { type: string };
    };
    return [testCase.name, {
      type: message.toDirectSign().type,
      hex: Buffer.from(message.toBinary()).toString("hex"),
    }];
  }),
);

const path = join(import.meta.dir, "..", "tests", "msgs", "encoding.fixtures.json");
writeFileSync(path, `${JSON.stringify(fixtures, null, 2)}\n`);
console.log(`recorded ${Object.keys(fixtures).length} encodings to ${path}`);
