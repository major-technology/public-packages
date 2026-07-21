"use client";

import {
  Component,
  useEffect,
  type ErrorInfo,
  type ReactNode,
} from "react";
import { ErrorReporter } from "./reporter";
import {
  getClientReporter,
  installClientHandlers,
  setClientReporter,
  uninstallClientHandlers,
} from "./client";
import { clientFingerprint } from "./fingerprint";
import { submitClientErrors } from "./next-server.js";
import type { ErrorEvent } from "./types";

const DEDUP_WINDOW_MS = 60_000;
const standaloneDedupMap = new Map<string, number>();

function reportWithoutProvider(
  error: Error | string,
  context?: Record<string, unknown>,
): void {
  const message = typeof error === "string" ? error : error.message;
  const stack = typeof error === "string" ? undefined : error.stack;
  const fingerprint = clientFingerprint(message, stack);
  const now = Date.now();
  const lastSeen = standaloneDedupMap.get(fingerprint);

  if (lastSeen && now - lastSeen < DEDUP_WINDOW_MS) {
    return;
  }
  standaloneDedupMap.set(fingerprint, now);

  const event: ErrorEvent = {
    message,
    stack,
    source: "client",
    url: typeof window !== "undefined" ? window.location.href : undefined,
    userAgent:
      typeof navigator !== "undefined" ? navigator.userAgent : undefined,
    timestamp: new Date().toISOString(),
    context,
  };

  void submitClientErrors([event]).catch(() => {
    // A global error fallback must never fail because reporting failed.
  });
}

function captureError(
  error: Error | string,
  context?: Record<string, unknown>,
): void {
  const reporter = getClientReporter();
  if (reporter) {
    reporter.captureError(error, context);
    return;
  }
  reportWithoutProvider(error, context);
}

// ── ErrorReporterProvider ──────────────────────────────────────────────

interface ErrorReporterProviderProps {
  endpoint: string;
  jwtToken: string;
  /**
   * Application id for direct browser delivery. The server-action fallback
   * resolves trusted runtime configuration when this or jwtToken is unavailable.
   */
  applicationId?: string;
  children: ReactNode;
}

export function ErrorReporterProvider({
  endpoint,
  jwtToken,
  applicationId,
  children,
}: ErrorReporterProviderProps) {
  useEffect(() => {
    const reporter = new ErrorReporter({
      endpoint,
      jwtToken,
      applicationId:
        applicationId ?? process.env.NEXT_PUBLIC_MAJOR_APPLICATION_ID,
      sendErrors: submitClientErrors,
    });
    setClientReporter(reporter);
    installClientHandlers(reporter);

    return () => {
      uninstallClientHandlers();
      reporter.destroy();
      setClientReporter(null);
    };
  }, [endpoint, jwtToken, applicationId]);

  return <>{children}</>;
}

// ── useReportError ─────────────────────────────────────────────────────

/** Report errors from Next.js error.tsx and global-error.tsx boundaries. */
export function useReportError(error: Error & { digest?: string }): void {
  useEffect(() => {
    const context = {
      type: "error-boundary",
      digest: error.digest,
    };
    captureError(error, context);
  }, [error]);
}

// ── ErrorBoundary ──────────────────────────────────────────────────────

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?:
    | ReactNode
    | ((props: { error: Error; reset: () => void }) => ReactNode);
}

interface ErrorBoundaryState {
  error: Error | null;
}

/** React error boundary that automatically reports caught errors. */
export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    const context = {
      type: "react-error-boundary",
      componentStack: errorInfo.componentStack ?? undefined,
    };
    captureError(error, context);
  }

  private handleReset = (): void => {
    this.setState({ error: null });
  };

  render(): ReactNode {
    if (this.state.error) {
      const { fallback } = this.props;
      if (typeof fallback === "function") {
        return fallback({ error: this.state.error, reset: this.handleReset });
      }
      return fallback ?? null;
    }
    return this.props.children;
  }
}
