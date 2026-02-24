import path from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { mockApiPlugin } from "./server/api";

export default defineConfig({
	plugins: [react(), tailwindcss(), mockApiPlugin()],
	resolve: {
		alias: {
			"@data-table": path.resolve(__dirname, "../registry/default/data-table"),
			"@/registry": path.resolve(__dirname, "../registry"),
		},
	},
});
