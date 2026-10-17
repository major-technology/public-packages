import { existsSync } from "node:fs";
import path from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { mockApiPlugin } from "./server/api";

// "source" (default) resolves @data-table to registry/default/data-table — fast to iterate on.
// "installed" resolves it to examples/consumer, populated by `pnpm consumer:install` via
// `shadcn add` against the built registry, so the demos exercise the rewritten import paths,
// the pinned npm versions and the upstream ui components a real consumer receives.
const source = process.env.DATA_TABLE_SOURCE === "installed" ? "installed" : "source";
const CONSUMER_DIR = path.resolve(__dirname, "consumer");

if (source === "installed" && !existsSync(path.join(CONSUMER_DIR, "components/data-table/index.ts"))) {
	throw new Error("examples/consumer is missing or incomplete. Run `pnpm consumer:install` first.");
}

const aliases: Record<string, string> =
	source === "installed"
		? {
				"@data-table": path.join(CONSUMER_DIR, "components/data-table"),
				// The installed sources import @/lib/utils and @/components/ui/* — the aliases
				// shadcn rewrote them to — so those must point into the consumer, not the registry.
				"@/components": path.join(CONSUMER_DIR, "components"),
				"@/lib": path.join(CONSUMER_DIR, "lib"),
			}
		: {
				"@data-table": path.resolve(__dirname, "../registry/default/data-table"),
				"@/registry": path.resolve(__dirname, "../registry"),
			};

export default defineConfig({
	plugins: [react(), tailwindcss(), mockApiPlugin()],
	define: {
		"import.meta.env.VITE_DATA_TABLE_SOURCE": JSON.stringify(source),
	},
	resolve: {
		alias: aliases,
		// consumer/ has its own node_modules. Vite currently resolves react from the examples
		// root anyway, but that is incidental — pin it so a hoisting change cannot silently
		// load two Reacts and break every hook in the installed data-table.
		dedupe: ["react", "react-dom"],
	},
});
