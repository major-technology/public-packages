import assert from "node:assert/strict";
import { test } from "node:test";
import vm from "node:vm";
import { fileURLToPath } from "node:url";
import { build } from "esbuild";
import { ErrorReporter } from "../dist/index.js";
import { submitClientErrors } from "../dist/next-server.js";

// Exercise the provider and real reporter with React effects and the Next.js
// action boundary replaced by synchronous test doubles. Real Next integration
// is still required to verify RSC serialization and action registration.
const bundle = await build({
  stdin: {
    contents: 'export * from "./src/next.tsx"; export { getClientReporter } from "./src/client.ts";',
    resolveDir: fileURLToPath(new URL("..", import.meta.url)),
  },
  bundle: true,
  write: false,
  format: "cjs",
  jsx: "automatic",
  plugins: [{
    name: "next-boundaries",
    setup(build) {
      build.onResolve({ filter: /^(react(?:\/jsx-runtime)?|\.\/next-server\.js)$/ }, ({ path }) => ({ path, namespace: "mock" }));
      build.onLoad({ filter: /.*/, namespace: "mock" }, ({ path }) => {
        switch (path) {
          case "react":
            return { contents: "export class Component {} export function useEffect(fn) { cleanups.push(fn()); }" };
          case "react/jsx-runtime":
            return { contents: "export const Fragment = Symbol(); export function jsx() { return null; }" };
          default:
            return { contents: "export async function submitClientErrors(errors) { batches.push(errors); }" };
        }
      });
    },
  }],
});

function mount(props) {
  const handlers = new Map();
  const context = {
    module: { exports: {} },
    cleanups: [],
    batches: [],
    setInterval: () => 1,
    clearInterval: () => {},
    fetch: () => { throw new Error("Unexpected direct browser request"); },
    window: {
      location: { href: "https://app.example/" },
      addEventListener: (name, fn) => handlers.set(name, fn),
      removeEventListener: (name) => handlers.delete(name),
    },
  };
  vm.runInNewContext(bundle.outputFiles[0].text, context);
  const api = context.module.exports;
  api.ErrorReporterProvider({ children: null, ...props });
  return { api, context, handlers };
}

for (const [name, props] of Object.entries({
  "without credential props": {},
  "with deprecated credential props": {
    endpoint: "https://must-not-contact.example",
    jwtToken: "synthetic-browser-token",
    applicationId: "untrusted-app",
  },
})) {
  test(`Next provider reports through the action ${name}`, async () => {
    const { api, context, handlers } = mount(props);
    handlers.get("error")({ message: "browser error" });
    handlers.get("error")({ message: "browser error" });
    handlers.get("unhandledrejection")({ reason: "rejection" });
    api.useReportError(new Error("boundary error"));
    await api.getClientReporter().flushAsync();
    assert.equal(context.batches.length, 1);
    assert.deepEqual(Array.from(context.batches[0], (error) => error.message), [
      "browser error", "rejection", "boundary error",
    ]);
    context.cleanups[0]();
    assert.equal(handlers.size, 0);
    assert.equal(api.getClientReporter(), null);
    api.useReportError(new Error("global error without provider"));
    assert.equal(context.batches[1][0].message, "global error without provider");
  });
}

test("server action uses runtime credentials and validates browser input", async (t) => {
  const config = {
    MAJOR_API_BASE_URL: "https://ingestion.example",
    MAJOR_JWT_TOKEN: "synthetic-server-token",
    APPLICATION_ID: "server-app",
  };
  const previous = Object.fromEntries(Object.keys(config).map((key) => [key, process.env[key]]));
  Object.assign(process.env, config);
  t.after(() => {
    for (const [key, value] of Object.entries(previous)) {
      if (value === undefined) {
        delete process.env[key];
      } else {
        process.env[key] = value;
      }
    }
  });
  const requests = [];
  t.mock.method(globalThis, "fetch", async (url, options) => {
    requests.push({ url, options });
    return { ok: true };
  });
  await submitClientErrors([null, {}, { message: "" }]);
  assert.equal(requests.length, 0);
  await submitClientErrors(Array.from({ length: 12 }, () => ({
    message: "x".repeat(3_000), source: "server", timestamp: "untrusted",
    applicationId: "untrusted-app", jwtToken: "untrusted-token", endpoint: "https://untrusted.example",
  })));
  assert.equal(requests[0].url, "https://ingestion.example/internal/apps/v1/server-app/errors");
  assert.equal(requests[0].options.headers["x-major-jwt"], config.MAJOR_JWT_TOKEN);
  const { errors } = JSON.parse(requests[0].options.body);
  assert.equal(errors.length, 10);
  assert.equal(errors[0].message.length, 2_000);
  assert.equal(errors[0].source, "client");
  assert.notEqual(errors[0].timestamp, "untrusted");
  assert.equal(errors[0].jwtToken, undefined);
  t.mock.method(globalThis, "fetch", async () => ({ ok: false, status: 503 }));
  await assert.rejects(submitClientErrors([{ message: "error" }]), { message: "Major error ingestion returned 503" });
  delete process.env.MAJOR_JWT_TOKEN;
  await assert.rejects(submitClientErrors([{ message: "error" }]), { message: "Major error reporting is not configured" });
});

test("generic reporter retains server-side direct delivery", async (t) => {
  const requests = [];
  t.mock.method(globalThis, "fetch", async (url, options) => {
    requests.push({ url, options });
    return { ok: true };
  });
  const reporter = new ErrorReporter({
    endpoint: "https://ingestion.example", jwtToken: "synthetic-server-token", applicationId: "server-app",
  });
  t.after(() => reporter.destroy());
  reporter.captureError("server error");
  await reporter.flushAsync();
  assert.equal(requests.length, 1);
  assert.equal(requests[0].options.headers["x-major-jwt"], "synthetic-server-token");
});
