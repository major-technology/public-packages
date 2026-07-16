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

// ── Next.js server action ──────────────────────────────────────────────

await build({
  entryPoints: ["src/next-server.ts"],
  banner: { js: '"use server";' },
  bundle: true,
  format: "esm",
  outfile: "dist/next-server.js",
  platform: "node",
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
  external: ["./next-server.js"],
  sourcemap: true,
  jsx: "automatic",
});

console.log("✅ Built ESM + CJS main and ESM Next bundles");
