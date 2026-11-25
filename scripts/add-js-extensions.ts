/**
 * `tsc` keeps relative specifiers the way they were written, and ours carry no
 * extension because the repo is developed under Bun. Node's ESM resolver needs
 * one, so the emitted files get `.js` added to every relative import that has a
 * sibling in the output. `gen/` is generated and stays untouched; this rewrites
 * only what the build produced.
 */
import { readdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

const OUT = join(import.meta.dir, "..", "dist");

async function files(dir: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map((entry) =>
      entry.isDirectory()
        ? files(join(dir, entry.name))
        : Promise.resolve(
            entry.name.endsWith(".js") || entry.name.endsWith(".d.ts")
              ? [join(dir, entry.name)]
              : [],
          ),
    ),
  );
  return nested.flat();
}

/** `from "./foo"` and `import "./side-effect"` in one path, plus dynamic import. */
const SPECIFIER =
  /(from\s+|import\s*\(\s*|import\s+)(["'])(\.{1,2}\/[^"']*)\2/g;

function withExtension(specifier: string): string {
  if (/\.(js|json|d\.ts)$/.test(specifier)) return specifier;
  return `${specifier}.js`;
}

let rewritten = 0;
let touched = 0;

for (const file of await files(OUT)) {
  const source = await readFile(file, "utf8");
  const next = source.replace(
    SPECIFIER,
    (_match, lead: string, quote: string, specifier: string) => {
      const updated = withExtension(specifier);
      if (updated !== specifier) rewritten += 1;
      return `${lead}${quote}${updated}${quote}`;
    },
  );
  if (next !== source) {
    await writeFile(file, next);
    touched += 1;
  }
}

console.log(
  `dist: ${rewritten} specifiers given an extension across ${touched} files`,
);
