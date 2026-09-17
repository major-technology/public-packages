import path from "node:path";
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

// Tests live in tests/, deliberately NOT under registry/default/data-table: pre-build.mts ships
// every .ts/.tsx it finds there, so a test file placed alongside the source would be published
// to customers.
export default defineConfig({
	plugins: [react()],
	resolve: {
		alias: {
			"@/registry": path.resolve(import.meta.dirname, "registry"),
		},
	},
	test: {
		environment: "jsdom",
		globals: true,
		setupFiles: ["tests/setup.ts"],
		include: ["tests/**/*.test.{ts,tsx}"],
	},
});
