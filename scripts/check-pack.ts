/**
 * Fails when the tarball would carry something the package should not ship.
 *
 * `files` in package.json is the allowlist, but npm adds files of its own
 * (README, LICENSE, package.json) and a stray root-level file or a widened
 * `files` entry can slip tests or the proto inputs into a publish without
 * anything else noticing. This asserts the packed set instead of trusting the
 * manifest, and checks that all six entry points built in both formats.
 */
import { execFileSync } from "node:child_process";

const ALLOWED = /^(package\.json|README\.md|LICEN[CS]E|NOTICE|dist\/)/;

const ENTRY_POINTS = [
  "index",
  "clients/chain",
  "clients/indexer",
  "msgs",
  "types",
  "utils",
];

const raw = execFileSync("npm", ["pack", "--dry-run", "--json"], {
  encoding: "utf8",
  stdio: ["ignore", "pipe", "ignore"],
});
// The build logs land on the same stream and carry bracketed tags like
// "[CJS]", so the report is the last JSON array in the output, not the first
// bracket on the line.
const start = raw.lastIndexOf("[\n  {");
const report = JSON.parse(raw.slice(start === -1 ? raw.lastIndexOf("[") : start))[0] as {
  files: { path: string; size: number }[];
  size: number;
  unpackedSize: number;
};

const paths = report.files.map((file) => file.path);
const rejected = paths.filter((path) => !ALLOWED.test(path));

const missing = ENTRY_POINTS.flatMap((entry) =>
  [".js", ".cjs", ".d.ts", ".d.cts"].map((extension) => {
    const path = `dist/${entry}${extension}`;
    return paths.includes(path) ? [] : [path];
  }),
).flat();

const problems = [
  ...rejected.map((path) => `unexpected file: ${path}`),
  ...missing.map((path) => `missing build output: ${path}`),
];

if (problems.length > 0) {
  console.error(`refusing to publish ${paths.length} files:`);
  for (const problem of problems) console.error(`  ${problem}`);
  process.exit(1);
}

const kb = (bytes: number) => `${Math.round(bytes / 1024)} KB`;
console.log(
  `tarball is ${paths.length} files, ${kb(report.size)} packed from ${kb(report.unpackedSize)}`,
);
