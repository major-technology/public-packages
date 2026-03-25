import type { ErrorReporter } from "./reporter";

type ErrorHandler = OnErrorEventHandler;
type RejectionHandler = (event: PromiseRejectionEvent) => void;
type BeforeUnloadHandler = () => void;

let installedErrorHandler: ErrorHandler | null = null;
let installedRejectionHandler: RejectionHandler | null = null;
let installedBeforeUnloadHandler: BeforeUnloadHandler | null = null;

export function installClientHandlers(reporter: ErrorReporter): void {
  if (typeof window === "undefined") {
    return;
  }

  installedErrorHandler = (
    _event: Event | string,
    source?: string,
    lineno?: number,
    colno?: number,
    error?: Error,
  ) => {
    if (error) {
      reporter.captureError(error, { source, lineno, colno });
    } else if (typeof _event === "string") {
      reporter.captureError(_event, { source, lineno, colno });
    }
  };

  installedRejectionHandler = (event: PromiseRejectionEvent) => {
    const reason = event.reason;

    if (reason instanceof Error) {
      reporter.captureError(reason, { type: "unhandledrejection" });
    } else {
      reporter.captureError(String(reason), { type: "unhandledrejection" });
    }
  };

  installedBeforeUnloadHandler = () => {
    reporter.flush();
  };

  window.onerror = installedErrorHandler;
  window.addEventListener("unhandledrejection", installedRejectionHandler);
  window.addEventListener("beforeunload", installedBeforeUnloadHandler);
}

export function uninstallClientHandlers(): void {
  if (typeof window === "undefined") {
    return;
  }

  if (installedErrorHandler) {
    window.onerror = null;
    installedErrorHandler = null;
  }

  if (installedRejectionHandler) {
    window.removeEventListener("unhandledrejection", installedRejectionHandler);
    installedRejectionHandler = null;
  }

  if (installedBeforeUnloadHandler) {
    window.removeEventListener("beforeunload", installedBeforeUnloadHandler);
    installedBeforeUnloadHandler = null;
  }
}
