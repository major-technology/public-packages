/**
 * Slot → id resolution for Major apps.
 *
 * An app references resources/agents by stable, author-owned SLOT name —
 * `getResourceId("DB")`, `getAgentId("JOKER")` — never a baked id. The concrete ids live in a
 * machine-generated `bindings.json` at the app root (a committed projection of the app's
 * bindings), which the generated `clients/bindings.ts` imports and registers here.
 *
 * ORDERING (this is what the `_register` shape got wrong): registration must have happened
 * before any reader runs, because generated clients call `getResourceId(...)` at module scope.
 * The old generator expressed that with a side-effect-only `import './_register'` — an import
 * contributing no bindings, which a bundler is free to drop, hoist, or split into a later chunk,
 * so the reader could execute against an unset manifest. The generator now instead has each
 * client import the READERS THEMSELVES from `clients/bindings.ts`, a real value dependency the
 * bundler cannot discard without breaking a referenced symbol — so the registering module is
 * guaranteed to have evaluated first.
 *
 * Readers still fail loud rather than silently: an unregistered manifest throws an actionable
 * error naming the fix, and an unknown slot throws naming the slot.
 *
 * `getApplicationId()` is deliberately NOT in `bindings.json` — it's the app's own identity,
 * injected as an env var alongside the app JWT (`APPLICATION_ID`).
 */

// Narrow ambient declaration so this stays node-types-free + browser-safe (`process` may
// be absent in the browser); no runtime effect.
declare const process: { env: Record<string, string | undefined> } | undefined;

/** Runtime manifest: every bound slot with its concrete id. */
export interface BindingsManifest {
  slots: {
    resources: Record<string, { type: string; id: string }>;
    agents: Record<string, { id: string }>;
  };
}

/** Contract form (what a template ships): slots + types, ids stripped. */
export interface BindingsContract {
  slots: {
    resources: Record<string, { type: string }>;
    agents: Record<string, Record<string, never>>;
  };
}

let registered: BindingsManifest | undefined;

/** Register the app's `bindings.json`. Called by the generated `clients/bindings.ts`, which every
 * generated client imports its readers from — so this has always run by the time a reader does.
 * Idempotent and last-write-wins; re-registering the same manifest is a no-op in practice. */
export function registerBindings(manifest: BindingsManifest): void {
  registered = manifest;
}

/** True once `bindings.json` has been registered. Exposed so an app can assert its wiring in a
 * health check rather than discovering the problem at the first slot read. */
export function checkIfBindingsRegistered(): boolean {
  return registered !== undefined;
}

function requireManifest(reader: string, slot: string): BindingsManifest {
  if (!registered) {
    throw new Error(
      `${reader}("${slot}"): the app's bindings.json has not been registered. Import this reader from ` +
        `your generated './clients' (which registers it) rather than from '@major-tech/resource-client' ` +
        `directly, and re-run \`major-client generate\` if clients/bindings.ts is missing.`,
    );
  }

  return registered;
}

/** Resolve a resource slot to its bound id. Throws when bindings were never registered, and when the
 * slot has no binding — `get*` returns a value or throws, never undefined. */
export function getResourceId(slot: string): string {
  const entry = requireManifest("getResourceId", slot).slots.resources[slot];

  if (!entry) {
    throw new Error(`getResourceId("${slot}"): no binding for that resource slot`);
  }

  return entry.id;
}

/** Resolve an agent slot to its bound id. Throws if unregistered or if the slot is unknown. */
export function getAgentId(slot: string): string {
  const entry = requireManifest("getAgentId", slot).slots.agents[slot];

  if (!entry) {
    throw new Error(`getAgentId("${slot}"): no binding for that agent slot`);
  }

  return entry.id;
}

/** The app's own application id, read from `APPLICATION_ID` — injected everywhere the app runs
 * (the build job, the app runtime pods, and the AI-coder pods), never from `bindings.json`. Because
 * it's present at build time too, a client instantiated at module load (e.g. a route's singleton)
 * doesn't throw during `next build` static collection. */
export function getApplicationId(): string {
  const env = typeof process !== "undefined" && process ? process.env : undefined;
  const id = env?.APPLICATION_ID;

  if (!id) {
    throw new Error("getApplicationId(): APPLICATION_ID is not set.");
  }

  return id;
}

/** One slot's binding for `generateBindings`. */
export interface BindingEntry {
  kind: "resource" | "agent";
  slot: string;
  /** Resource subtype; omitted for agents. */
  type?: string;
  id: string;
}

/** Deterministically serialize a set of bindings to the `bindings.json` body. Sorted by
 * kind then slot, fixed 2-space formatting + trailing newline, so re-running on unchanged
 * bindings is a byte-identical no-op (clean git diffs). */
export function generateBindings(entries: BindingEntry[]): string {
  const manifest: BindingsManifest = { slots: { resources: {}, agents: {} } };

  for (const entry of [...entries].sort((a, b) => a.kind.localeCompare(b.kind) || a.slot.localeCompare(b.slot))) {
    if (entry.kind === "resource") {
      manifest.slots.resources[entry.slot] = { type: entry.type ?? "", id: entry.id };
    } else {
      manifest.slots.agents[entry.slot] = { id: entry.id };
    }
  }

  return `${JSON.stringify(manifest, null, 2)}\n`;
}

/** Strip the org-specific ids out of a manifest, leaving the slot/type contract a template
 * ships. The slots (and resource types) survive — that's how an adopter knows what to bind. */
export function stripBindingsIds(manifest: BindingsManifest): BindingsContract {
  const contract: BindingsContract = { slots: { resources: {}, agents: {} } };

  for (const [slot, entry] of Object.entries(manifest.slots.resources)) {
    contract.slots.resources[slot] = { type: entry.type };
  }

  for (const slot of Object.keys(manifest.slots.agents)) {
    contract.slots.agents[slot] = {};
  }

  return contract;
}
