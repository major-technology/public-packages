/**
 * Installs the data-table into examples/consumer/ the way a real consumer gets it:
 * `shadcn add` against the locally built registry/output/data-table.json.
 *
 * The examples app normally imports @data-table straight from registry/default/data-table —
 * the source, with the repo's own dependency versions and its own import aliases. That never
 * exercises what customers actually receive: rewritten import paths, the npm versions the
 * registry pins, and the button/input/checkbox/select that `registryDependencies` pulls from
 * ui.shadcn.com. Running the examples against this directory does.
 *
 * Usage:
 *   pnpm dev:installed                 reinstall, then run the examples against the copy
 *   pnpm build:installed               reinstall, then build against it
 *   pnpm consumer:install              build the registry, then install from it
 *   pnpm consumer:install --skip-build reuse the existing registry/output
 *
 * dev:installed and build:installed always reinstall first: a stale consumer/ shows old code
 * while the badge in the sidebar claims it is the installed copy. That costs a full registry
 * build plus a network fetch of the shadcn CLI and the upstream ui components on every start.
 * For a faster inner loop, run `pnpm consumer:install --skip-build` once and then start vite
 * directly with DATA_TABLE_SOURCE=installed.
 */
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const EXAMPLES_DIR = path.resolve(import.meta.dirname, "..");
const ROOT = path.resolve(EXAMPLES_DIR, "..");
const CONSUMER_DIR = path.join(EXAMPLES_DIR, "consumer");
const REGISTRY_ITEM = path.join(ROOT, "registry/output/data-table.json");

// Consumers run the published CLI, and its behaviour moves (v4 switched the ui components to the
// unified `radix-ui` package and the `cn` npm package). Pin it here only to debug a CLI change.
const SHADCN_CLI = process.env.SHADCN_CLI ?? "shadcn@latest";

const skipBuild = process.argv.includes("--skip-build");

// execFileSync cannot launch a Windows .cmd shim directly, and using shell:true instead would
// mis-split any path containing a space.
const bin = (name: string) => (process.platform === "win32" ? `${name}.cmd` : name);

function run(cmd: string, args: string[], cwd: string) {
	execFileSync(bin(cmd), args, { cwd, stdio: "inherit" });
}

/**
 * The scaffold a consumer app is expected to already have. `shadcn add` writes components into
 * it but does not create it — note lib/utils.ts in particular: the data-table sources import
 * `@/lib/utils`, yet nothing in the registry provides it, so every consuming app must already
 * have `cn` at that alias. (The Major template does.)
 */
function scaffoldConsumer() {
	fs.rmSync(CONSUMER_DIR, { recursive: true, force: true });
	fs.mkdirSync(path.join(CONSUMER_DIR, "lib"), { recursive: true });

	// Deliberately no src/ directory: shadcn prefixes the registry item's own targets with src/
	// when it finds one, but not the upstream registryDependencies, which splits the two halves
	// of the install across components/ and src/components/.
	fs.writeFileSync(
		path.join(CONSUMER_DIR, "package.json"),
		JSON.stringify(
			{
				name: "data-table-consumer",
				private: true,
				type: "module",
				// Only what a consuming app is assumed to already have: React, plus the two
				// packages lib/utils.ts needs for `cn`. Everything else in this file after the
				// install is something `shadcn add` chose, so it doubles as a record of what a
				// consumer actually ends up with.
				dependencies: {
					clsx: "^2",
					react: "^19",
					"react-dom": "^19",
					"tailwind-merge": "^3",
				},
			},
			null,
			2,
		) + "\n",
	);

	fs.writeFileSync(
		path.join(CONSUMER_DIR, "components.json"),
		JSON.stringify(
			{
				$schema: "https://ui.shadcn.com/schema.json",
				style: "new-york",
				rsc: false,
				tsx: true,
				tailwind: { config: "", css: "styles.css", baseColor: "neutral", cssVariables: true },
				iconLibrary: "lucide",
				aliases: {
					components: "@/components",
					utils: "@/lib/utils",
					ui: "@/components/ui",
					lib: "@/lib",
					hooks: "@/hooks",
				},
			},
			null,
			2,
		) + "\n",
	);

	fs.writeFileSync(
		path.join(CONSUMER_DIR, "tsconfig.json"),
		JSON.stringify(
			{
				compilerOptions: {
					target: "ES2022",
					module: "ESNext",
					moduleResolution: "bundler",
					jsx: "react-jsx",
					strict: true,
					esModuleInterop: true,
					skipLibCheck: true,
					noEmit: true,
					baseUrl: ".",
					paths: { "@/*": ["./*"] },
				},
				include: ["components", "lib"],
			},
			null,
			2,
		) + "\n",
	);

	// `shadcn add` runs its own `pnpm add` with no --ignore-workspace. Without this file pnpm
	// walks up to shadcn/pnpm-workspace.yaml, joins the workspace, and appends an
	// `examples/consumer:` importer to the TRACKED shadcn/pnpm-lock.yaml on every run.
	fs.writeFileSync(path.join(CONSUMER_DIR, "pnpm-workspace.yaml"), "packages: []\n");

	fs.writeFileSync(path.join(CONSUMER_DIR, "styles.css"), '@import "tailwindcss";\n');

	fs.writeFileSync(
		path.join(CONSUMER_DIR, "lib/utils.ts"),
		`import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}
`,
	);
}

/** Every non-relative, non-aliased package specifier imported under `dir`, deduped. */
function collectBareImports(dir: string): string[] {
	const found = new Set<string>();

	const record = (specifier: string) => {
		if (specifier.startsWith(".") || specifier.startsWith("@/")) {
			return;
		}
		// "@scope/pkg/sub" -> "@scope/pkg", "pkg/sub" -> "pkg"
		const parts = specifier.split("/");
		found.add(specifier.startsWith("@") ? parts.slice(0, 2).join("/") : parts[0]);
	};

	for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
		const full = path.join(dir, entry.name);

		if (entry.isDirectory()) {
			for (const bare of collectBareImports(full)) {
				found.add(bare);
			}
			continue;
		}

		if (!/\.tsx?$/.test(entry.name)) {
			continue;
		}

		// Walked line by line rather than matched with one regex: an import statement can span
		// several lines, and a lazy cross-line pattern happily reads the `from "jumping"` inside
		// a prose comment as a dependency.
		let inStatement = false;

		for (const raw of fs.readFileSync(full, "utf-8").split("\n")) {
			const line = raw.trim();

			if (line.startsWith("//") || line.startsWith("*") || line.startsWith("/*")) {
				continue;
			}

			if (/^(?:import|export)\b/.test(line)) {
				inStatement = true;

				// Side-effect import: `import "server-only";`
				const sideEffect = line.match(/^import\s+["']([^"']+)["']/);

				if (sideEffect) {
					record(sideEffect[1]);
					inStatement = false;
					continue;
				}
			}

			if (!inStatement) {
				continue;
			}

			const from = line.match(/from\s+["']([^"']+)["']/);

			if (from) {
				record(from[1]);
				inStatement = false;
			} else if (line.endsWith(";")) {
				inStatement = false;
			}
		}
	}

	return [...found].sort();
}

/** Fail loudly on the things that silently produce a half-installed, unrunnable consumer. */
function verify() {
	const problems: string[] = [];

	const expectedFiles = [
		"components/data-table/index.ts",
		"components/ui/button.tsx",
		"components/ui/input.tsx",
		"components/ui/checkbox.tsx",
		"components/ui/select.tsx",
		"lib/utils.ts",
	];

	for (const file of expectedFiles) {
		if (!fs.existsSync(path.join(CONSUMER_DIR, file))) {
			problems.push(`missing ${file}`);
		}
	}

	const deps: Record<string, string> =
		JSON.parse(fs.readFileSync(path.join(CONSUMER_DIR, "package.json"), "utf-8")).dependencies ?? {};

	for (const bare of collectBareImports(path.join(CONSUMER_DIR, "components"))) {
		if (!(bare in deps)) {
			problems.push(`${bare} is imported by the installed components but declared by nothing — the registry is missing it`);
		}
	}

	// The regression this whole setup exists to catch: the registry used to emit bare package
	// names, so `shadcn add` installed @tanstack/react-table@latest — v9, whose API the
	// data-table is not written against.
	const table = deps["@tanstack/react-table"];

	// The range shadcn writes varies with lockfile state — "^8" verbatim from the registry, or a
	// resolved "^8.21.3" — so compare the major, not the literal string.
	const tableMajor = table?.match(/\d+/)?.[0];

	if (!table) {
		problems.push("@tanstack/react-table was not installed");
	} else if (tableMajor !== "8") {
		problems.push(`@tanstack/react-table resolved to ${table}, expected 8.x — is the registry pinning versions?`);
	}

	console.log("\nInstalled dependencies:");
	for (const [name, range] of Object.entries(deps).sort(([a], [b]) => a.localeCompare(b))) {
		console.log(`  ${name}@${range}`);
	}

	if (problems.length > 0) {
		console.error(`\n✖ Consumer install looks wrong:\n${problems.map((p) => `  - ${p}`).join("\n")}`);
		process.exit(1);
	}

	console.log(`\n✔ Installed into ${path.relative(EXAMPLES_DIR, CONSUMER_DIR)}. Run \`pnpm dev:installed\`.`);
}

if (!skipBuild) {
	run("pnpm", ["build"], ROOT);
}

if (!fs.existsSync(REGISTRY_ITEM)) {
	throw new Error(`${REGISTRY_ITEM} not found. Run \`pnpm build\` in ${ROOT} first.`);
}

scaffoldConsumer();
run("pnpm", ["install", "--ignore-workspace"], CONSUMER_DIR);
run("npx", ["--yes", SHADCN_CLI, "add", REGISTRY_ITEM, "--yes"], CONSUMER_DIR);
verify();
