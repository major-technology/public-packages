import { build } from "esbuild";

// Bundle from TypeScript source directly. esbuild resolves all internal imports
// (including directory imports like "./schemas") at build time, producing
// Node.js-compatible ESM and CJS outputs.

await build({
  entryPoints: ["src/index.ts"],
  bundle: true,
  format: "esm",
  outfile: "dist/index.js",
  platform: "neutral",
  target: "es2022",
  packages: "external",
  sourcemap: true,
});

await build({
  entryPoints: ["src/index.ts"],
  bundle: true,
  format: "cjs",
  outfile: "dist/index.cjs",
  platform: "neutral",
  target: "es2022",
  packages: "external",
  sourcemap: true,
});

console.log("✅ Built ESM + CJS bundles");
