import type { ErrorReporterConfig } from "./types";
import { ErrorReporter } from "./reporter";

let instance: ErrorReporter | null = null;

/**
 * Initialize the error reporter for server-side use.
 * Call this once at application startup (e.g., in instrumentation.ts).
 */
export function initErrorReporter(config: ErrorReporterConfig): ErrorReporter {
  if (instance) {
    return instance;
  }

  instance = new ErrorReporter(config);

  if (typeof process !== "undefined" && process.on) {
    process.on("unhandledRejection", (reason: unknown) => {
      if (reason instanceof Error) {
        instance?.captureError(reason, { type: "unhandledRejection" });
      } else {
        instance?.captureError(String(reason), { type: "unhandledRejection" });
      }
    });
  }

  return instance;
}

/**
 * Get the singleton error reporter instance.
 * Returns null if initErrorReporter has not been called.
 */
export function getErrorReporter(): ErrorReporter | null {
  return instance;
}

/**
 * Convenience function to report an error using the singleton instance.
 */
export function reportError(error: Error | string, context?: Record<string, unknown>): void {
  instance?.captureError(error, context);
}
