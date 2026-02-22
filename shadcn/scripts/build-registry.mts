/**
 * Build script that generates a shadcn registry item JSON for the data-table component.
 *
 * Reads all source files from src/data-table/ plus the custom table primitive,
 * rewrites external imports to use consumer-side paths, and outputs
 * registry/data-table.json conforming to the shadcn registry-item schema.
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const SRC_DIR = path.join(ROOT, "src");
const DATA_TABLE_DIR = path.join(SRC_DIR, "data-table");
const OUTPUT_FILE = path.join(ROOT, "registry", "data-table.json");

// ---------------------------------------------------------------------------
// Standard shadcn primitives — consumers already have these.
// Any import referencing these gets rewritten to the consumer's ui alias.
// ---------------------------------------------------------------------------
const SHADCN_PRIMITIVE_MAP: Record<string, string> = {
	"primitives/button": "@/components/ui/button",
	"primitives/input": "@/components/ui/input",
	"primitives/checkbox": "@/components/ui/checkbox",
	"primitives/select": "@/components/ui/select",
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Recursively collect all files under `dir`, returning absolute paths. */
function collectFiles(dir: string): string[] {
	const results: string[] = [];

	for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
		const fullPath = path.join(dir, entry.name);

		if (entry.isDirectory()) {
			results.push(...collectFiles(fullPath));
		} else {
			results.push(fullPath);
		}
	}

	return results;
}

/**
 * Rewrite imports that reference paths outside the data-table directory.
 *
 * @param content   - File source code
 * @param relPath   - File path relative to the data-table/ root
 *                    (e.g. "components/header.tsx", "index.ts")
 */
function rewriteImports(content: string, relPath: string): string {
	const fileDir = path.dirname(relPath); // "." for root-level files

	// 1. Rewrite lib/utils → consumer's cn() utility
	content = content.replace(
		/(from\s+["'])(\.\.\/)+lib\/utils(["'])/g,
		'$1@/lib/utils$3',
	);

	// 2. Rewrite standard shadcn primitives → consumer's ui components
	for (const [primitive, replacement] of Object.entries(SHADCN_PRIMITIVE_MAP)) {
		const escaped = primitive.replace("/", "\\/");
		const regex = new RegExp(
			`(from\\s+["'])(\\.\\.\\/)+${escaped}(["'])`,
			"g",
		);
		content = content.replace(regex, `$1${replacement}$3`);
	}

	// 3. Rewrite table primitive → relative path to bundled copy
	//    The custom table lives at data-table/primitives/table.tsx after install.
	const relToRoot =
		fileDir === "." ? "." : path.relative(fileDir, ".").replace(/\\/g, "/");
	const tableImportPath =
		relToRoot === "."
			? "./primitives/table"
			: `${relToRoot}/primitives/table`;

	content = content.replace(
		/(from\s+["'])(\.\.\/)+primitives\/table(["'])/g,
		`$1${tableImportPath}$3`,
	);

	return content;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

// 0. Read version from constants.ts (single source of truth)
const constantsPath = path.join(DATA_TABLE_DIR, "constants.ts");
const constantsContent = fs.readFileSync(constantsPath, "utf-8");
const versionMatch = constantsContent.match(/DATA_TABLE_VERSION\s*=\s*"([^"]+)"/);

if (!versionMatch) {
	throw new Error("Could not find DATA_TABLE_VERSION in constants.ts");
}

const version = versionMatch[1];

// 1. Collect data-table source files
const dataTableFiles = collectFiles(DATA_TABLE_DIR).map((absPath) => ({
	absPath,
	// Path relative to data-table/ root (e.g. "components/header.tsx")
	relPath: path.relative(DATA_TABLE_DIR, absPath).replace(/\\/g, "/"),
	// Target path in the registry (installed under data-table/)
	registryPath: path
		.relative(DATA_TABLE_DIR, absPath)
		.replace(/\\/g, "/"),
}));

// 2. Add custom primitives (bundled within data-table/primitives/)
const bundledPrimitives = ["table.tsx", "dropdown-menu.tsx"];

for (const filename of bundledPrimitives) {
	const primitivePath = path.join(SRC_DIR, "primitives", filename);
	dataTableFiles.push({
		absPath: primitivePath,
		relPath: `primitives/${filename}`,
		registryPath: `primitives/${filename}`,
	});
}

// 3. Build registry files array
//    Each file gets an explicit `target` so the shadcn CLI preserves the
//    directory structure under components/data-table/ instead of flattening.
const registryFiles = dataTableFiles.map(({ absPath, relPath, registryPath }) => {
	let content = fs.readFileSync(absPath, "utf-8");
	content = rewriteImports(content, relPath);

	return {
		path: `data-table/${registryPath}`,
		type: "registry:component" as const,
		target: `components/data-table/${registryPath}`,
		content,
	};
});

// 4. Build the registry item
const registryItem = {
	$schema: "https://ui.shadcn.com/schema/registry-item.json",
	name: "data-table",
	version,
	type: "registry:component",
	title: "Data Table",
	description:
		"Full-featured data table with sorting, filtering, pagination, infinite scroll, virtualization, row selection, expandable rows, and data export. Built on TanStack Table v8.",
	dependencies: [
		"@tanstack/react-table",
		"@tanstack/react-virtual",
		"lucide-react",
	],
	registryDependencies: ["button", "input", "checkbox", "select"],
	files: registryFiles,
};

// 5. Write output
fs.mkdirSync(path.dirname(OUTPUT_FILE), { recursive: true });
fs.writeFileSync(OUTPUT_FILE, JSON.stringify(registryItem, null, 2) + "\n");

console.log(`Registry item written to ${path.relative(ROOT, OUTPUT_FILE)}`);
console.log(`  Version: ${version}`);
console.log(`  Files: ${registryFiles.length}`);
console.log(
	`  Paths:\n${registryFiles.map((f) => `    ${f.path}`).join("\n")}`,
);
