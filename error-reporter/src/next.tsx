"use client";

import {
  Component,
  useEffect,
  useRef,
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

// ── ErrorReporterProvider ──────────────────────────────────────────────

interface ErrorReporterProviderProps {
  endpoint: string;
  jwtToken: string;
  /**
   * The application id errors are reported under. Optional — defaults to the
   * NEXT_PUBLIC_MAJOR_APPLICATION_ID build-time env var. The browser can't read
   * server-only env vars, so this (or that public var) is how the client learns
   * its applicationId now that MAJOR_JWT_TOKEN is opaque.
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
  const reporterRef = useRef<ErrorReporter | null>(null);

  useEffect(() => {
    if (!endpoint || !jwtToken) {
      return;
    }

    const reporter = new ErrorReporter({
      endpoint,
      jwtToken,
      applicationId: applicationId ?? process.env.NEXT_PUBLIC_MAJOR_APPLICATION_ID,
    });
    reporterRef.current = reporter;
    setClientReporter(reporter);
    installClientHandlers(reporter);

    return () => {
      uninstallClientHandlers();
      reporter.destroy();
      reporterRef.current = null;
      setClientReporter(null);
    };
  }, [endpoint, jwtToken, applicationId]);

  return <>{children}</>;
}

// ── useReportError ─────────────────────────────────────────────────────

/**
 * Hook for reporting errors from Next.js error boundaries (error.tsx / global-error.tsx).
 * Reports the error once when the component mounts or the error changes.
 */
export function useReportError(error: Error & { digest?: string }): void {
  useEffect(() => {
    const reporter = getClientReporter();
    if (reporter) {
      reporter.captureError(error, {
        type: "error-boundary",
        digest: error.digest,
      });
    }
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

/**
 * React error boundary that automatically reports caught errors.
 * Use in addition to Next.js error.tsx for finer-grained error boundaries.
 */
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
    const reporter = getClientReporter();
    reporter?.captureError(error, {
      type: "react-error-boundary",
      componentStack: errorInfo.componentStack ?? undefined,
    });
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
