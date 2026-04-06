import type { ErrorReporter } from "./reporter";

type ErrorHandler = (event: ErrorEvent) => void;
type RejectionHandler = (event: PromiseRejectionEvent) => void;
type BeforeUnloadHandler = () => void;

let installedErrorHandler: ErrorHandler | null = null;
let installedRejectionHandler: RejectionHandler | null = null;
let installedBeforeUnloadHandler: BeforeUnloadHandler | null = null;
let clientReporter: ErrorReporter | null = null;

export function setClientReporter(reporter: ErrorReporter | null): void {
  clientReporter = reporter;
}

export function getClientReporter(): ErrorReporter | null {
  return clientReporter;
}

export function installClientHandlers(reporter: ErrorReporter): void {
  if (typeof window === "undefined") {
    return;
  }

  installedErrorHandler = (event: ErrorEvent) => {
    if (event.error) {
      reporter.captureError(event.error, {
        source: event.filename,
        lineno: event.lineno,
        colno: event.colno,
      });
    } else if (event.message) {
      reporter.captureError(event.message, {
        source: event.filename,
        lineno: event.lineno,
        colno: event.colno,
      });
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

  window.addEventListener("error", installedErrorHandler);
  window.addEventListener("unhandledrejection", installedRejectionHandler);
  window.addEventListener("beforeunload", installedBeforeUnloadHandler);
}

export function uninstallClientHandlers(): void {
  if (typeof window === "undefined") {
    return;
  }

  if (installedErrorHandler) {
    window.removeEventListener("error", installedErrorHandler);
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
