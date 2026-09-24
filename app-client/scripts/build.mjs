import { build } from "esbuild";

// Bundle from TypeScript source directly. esbuild resolves all internal imports
// at build time, producing Node.js-compatible ESM and CJS outputs. Declarations
// are emitted separately by `tsc` (emitDeclarationOnly).

const entries = [
  { in: "src/index.ts", outBase: "dist/index" },
  { in: "src/next/index.ts", outBase: "dist/next/index" },
];

for (const { in: entry, outBase } of entries) {
  await build({
    entryPoints: [entry],
    bundle: true,
    format: "esm",
    outfile: `${outBase}.js`,
    platform: "neutral",
    target: "es2022",
    packages: "external",
    sourcemap: true,
  });

  await build({
    entryPoints: [entry],
    bundle: true,
    format: "cjs",
    outfile: `${outBase}.cjs`,
    platform: "neutral",
    target: "es2022",
    packages: "external",
    sourcemap: true,
  });
}

console.log("✅ Built ESM + CJS bundles");
