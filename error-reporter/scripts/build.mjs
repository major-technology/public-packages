import { build } from "esbuild";

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
