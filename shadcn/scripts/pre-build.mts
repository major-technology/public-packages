/**
 * Pre-build script that generates registry.json before `shadcn build` runs.
 *
 * 1. Scans registry/default/data-table/ for all source files
 * 2. Reads DATA_TABLE_VERSION from constants.ts
 * 3. Writes a complete registry.json with files list and meta.version
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const DATA_TABLE_DIR = path.join(ROOT, "registry/default/data-table");
const OUTPUT_DIR = path.join(ROOT, "registry/output");
const REGISTRY_PATH = path.join(OUTPUT_DIR, "registry.json");

function collectFiles(dir: string): string[] {
	const results: string[] = [];

	for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
		const fullPath = path.join(dir, entry.name);

		if (entry.isDirectory()) {
			results.push(...collectFiles(fullPath));
		} else if (entry.name.endsWith(".ts") || entry.name.endsWith(".tsx")) {
			results.push(fullPath);
		}
	}

	return results;
}

// Read version from constants.ts
const constantsContent = fs.readFileSync(path.join(DATA_TABLE_DIR, "constants.ts"), "utf-8");
const versionMatch = constantsContent.match(/DATA_TABLE_VERSION\s*=\s*"([^"]+)"/);

if (!versionMatch) {
	throw new Error("Could not find DATA_TABLE_VERSION in constants.ts");
}

const version = versionMatch[1];

// Collect all data-table source files
const allFiles = collectFiles(DATA_TABLE_DIR)
	.map((absPath) => {
		const relPath = path.relative(ROOT, absPath).replace(/\\/g, "/");
		const targetPath = path.relative(DATA_TABLE_DIR, absPath).replace(/\\/g, "/");
		const isHook = targetPath.startsWith("hooks/");

		return {
			path: relPath,
			type: isHook ? "registry:hook" : "registry:component",
			target: `components/data-table/${targetPath}`,
		};
	})
	.sort((a, b) => a.path.localeCompare(b.path));

// Build registry.json
const registry = {
	$schema: "https://ui.shadcn.com/schema/registry.json",
	name: "major",
	homepage: "https://major.build",
	items: [
		{
			name: "data-table",
			type: "registry:component",
			title: "Data Table",
			description:
				"Full-featured data table with sorting, filtering, pagination, infinite scroll, virtualization, row selection, expandable rows, and data export. Built on TanStack Table v8.",
			dependencies: [
				"@tanstack/react-table",
				"@tanstack/react-virtual",
				"@radix-ui/react-dropdown-menu",
				"lucide-react",
			],
			registryDependencies: ["button", "input", "checkbox", "select"],
			meta: { version },
			files: allFiles,
		},
	],
};

fs.mkdirSync(OUTPUT_DIR, { recursive: true });
fs.writeFileSync(REGISTRY_PATH, JSON.stringify(registry, null, "\t") + "\n");
console.log(`Generated registry.json (version ${version}, ${allFiles.length} files)`);
