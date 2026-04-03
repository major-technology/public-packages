import { build } from "esbuild";

// ── Main entry (server-safe, no "use client") ──────────────────────────

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

// ── Next.js client entry ("use client" banner) ─────────────────────────

await build({
  entryPoints: ["src/next.tsx"],
  banner: { js: '"use client";' },
  bundle: true,
  format: "esm",
  outfile: "dist/next.js",
  platform: "neutral",
  target: "es2022",
  packages: "external",
  sourcemap: true,
  jsx: "automatic",
});

await build({
  entryPoints: ["src/next.tsx"],
  banner: { js: '"use client";' },
  bundle: true,
  format: "cjs",
  outfile: "dist/next.cjs",
  platform: "neutral",
  target: "es2022",
  packages: "external",
  sourcemap: true,
  jsx: "automatic",
});

console.log("✅ Built ESM + CJS bundles (main + next)");
