"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { ErrorReporter } from "./reporter";
import { installClientHandlers, uninstallClientHandlers } from "./client";

interface ErrorReporterProviderProps {
  endpoint: string;
  jwtToken: string;
  children: ReactNode;
}

export function ErrorReporterProvider({
  endpoint,
  jwtToken,
  children,
}: ErrorReporterProviderProps) {
  const reporterRef = useRef<ErrorReporter | null>(null);

  useEffect(() => {
    if (!endpoint || !jwtToken) {
      return;
    }

    const reporter = new ErrorReporter({ endpoint, jwtToken });
    reporterRef.current = reporter;
    installClientHandlers(reporter);

    return () => {
      uninstallClientHandlers();
      reporter.destroy();
      reporterRef.current = null;
    };
  }, [endpoint, jwtToken]);

  return <>{children}</>;
}
