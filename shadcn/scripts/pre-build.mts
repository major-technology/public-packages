/**
 * Pre-build script that generates registry.json before `shadcn build` runs.
 *
 * 1. Scans registry/default/data-table/ for all source files
 * 2. Reads DATA_TABLE_VERSION from constants.ts
 * 3. Resolves each npm dependency to the range pinned in package.json
 * 4. Writes a complete registry.json with files list and meta.version
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const DATA_TABLE_DIR = path.join(ROOT, "registry/default/data-table");
const OUTPUT_DIR = path.join(ROOT, "registry/output");
const REGISTRY_PATH = path.join(OUTPUT_DIR, "registry.json");
const PACKAGE_JSON_PATH = path.join(ROOT, "package.json");

// npm packages the data-table imports directly. Versions are NOT written here — they are
// resolved from package.json below, so the range customers install is the same one this repo
// type-checks against. Emitting a bare name makes `shadcn add` install @latest: that is how
// @tanstack/react-table v9 reached apps built against the v8 API.
const NPM_DEPENDENCIES = [
	// Not imported by data-table itself, but by the `button` registryDependency, whose upstream
	// registry item declares only ["cn","radix-ui"] — so a consumer without cva gets a broken
	// install unless we declare it here.
	"class-variance-authority",
	"@tanstack/react-table",
	"@tanstack/react-virtual",
	"@radix-ui/react-dropdown-menu",
	"lucide-react",
];

/** Resolve each dependency to "<name>@<range>" using this package's own pinned ranges. */
function resolveDependencies(names: string[]): string[] {
	const pkg = JSON.parse(fs.readFileSync(PACKAGE_JSON_PATH, "utf-8"));
	const declared: Record<string, string> = { ...pkg.dependencies, ...pkg.devDependencies };

	return names.map((name) => {
		const range = declared[name];

		if (!range) {
			throw new Error(
				`Registry dependency "${name}" is not declared in package.json. Add it there so the ` +
					`published registry pins the same range this repo builds against.`,
			);
		}

		// An open-ended range ships the very bug this function exists to prevent: `shadcn add`
		// resolves ">=0.400" to the latest release, and worse, writes that loose range over
		// whatever the consuming app had already pinned.
		if (!/^[\^~]?\d/.test(range)) {
			throw new Error(
				`Registry dependency "${name}" has the open-ended range "${range}" in package.json. ` +
					`Use a caret or tilde range so \`shadcn add\` installs a bounded version.`,
			);
		}

		return `${name}@${range}`;
	});
}

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
			dependencies: resolveDependencies(NPM_DEPENDENCIES),
			registryDependencies: ["button", "input", "checkbox", "select"],
			meta: { version },
			files: allFiles,
		},
	],
};

fs.mkdirSync(OUTPUT_DIR, { recursive: true });
fs.writeFileSync(REGISTRY_PATH, JSON.stringify(registry, null, "\t") + "\n");
console.log(`Generated registry.json (version ${version}, ${allFiles.length} files)`);
