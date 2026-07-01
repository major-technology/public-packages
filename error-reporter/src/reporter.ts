import type { ErrorReporterConfig, ErrorEvent } from "./types";
import { clientFingerprint } from "./fingerprint";

const DEFAULT_MAX_ERRORS_PER_MINUTE = 10;
const DEFAULT_BATCH_INTERVAL_MS = 5000;
const DEFAULT_MAX_BATCH_SIZE = 10;
const DEDUP_WINDOW_MS = 60_000;

export class ErrorReporter {
  private config: Required<ErrorReporterConfig>;
  private buffer: ErrorEvent[] = [];
  private dedupMap = new Map<string, number>();
  private minuteCounter = 0;
  private minuteResetTimer: ReturnType<typeof setInterval> | null = null;
  private flushTimer: ReturnType<typeof setInterval> | null = null;
  private applicationId: string | null = null;

  constructor(config: ErrorReporterConfig) {
    this.config = {
      endpoint: config.endpoint,
      jwtToken: config.jwtToken,
      applicationId: config.applicationId ?? "",
      maxErrorsPerMinute: config.maxErrorsPerMinute ?? DEFAULT_MAX_ERRORS_PER_MINUTE,
      batchIntervalMs: config.batchIntervalMs ?? DEFAULT_BATCH_INTERVAL_MS,
      maxBatchSize: config.maxBatchSize ?? DEFAULT_MAX_BATCH_SIZE,
      enabled: config.enabled ?? true,
    };

    if (!this.config.enabled || !this.config.endpoint || !this.config.jwtToken) {
      return;
    }

    this.applicationId = this.resolveApplicationId(config);

    if (!this.applicationId) {
      // Never fail silently: without an applicationId every flush no-ops, which
      // is exactly how the post-cutover breakage went unnoticed. Warn once.
      console.warn(
        "[major-error-reporter] Could not resolve an applicationId (checked config.applicationId, " +
          "APPLICATION_ID / MAJOR_APPLICATION_ID env vars, and the JWT payload). Errors will NOT be sent.",
      );
    }

    this.flushTimer = setInterval(() => {
      this.flush();
    }, this.config.batchIntervalMs);

    this.minuteResetTimer = setInterval(() => {
      this.minuteCounter = 0;
    }, 60_000);
  }

  captureError(error: Error | string, context?: Record<string, unknown>): void {
    if (!this.config.enabled || !this.config.endpoint || !this.config.jwtToken) {
      return;
    }

    const message = typeof error === "string" ? error : error.message;
    const stack = typeof error === "string" ? undefined : error.stack;

    // Client-side dedup
    const fp = clientFingerprint(message, stack);
    const now = Date.now();
    const lastSeen = this.dedupMap.get(fp);

    if (lastSeen && now - lastSeen < DEDUP_WINDOW_MS) {
      return;
    }

    this.dedupMap.set(fp, now);

    // Rate limiting
    if (this.minuteCounter >= this.config.maxErrorsPerMinute) {
      return;
    }

    this.minuteCounter++;

    const event: ErrorEvent = {
      message,
      stack,
      source: typeof window !== "undefined" ? "client" : "server",
      url: typeof window !== "undefined" ? window.location.href : undefined,
      userAgent: typeof navigator !== "undefined" ? navigator.userAgent : undefined,
      timestamp: new Date().toISOString(),
      context,
    };

    this.buffer.push(event);

    if (this.buffer.length >= this.config.maxBatchSize) {
      this.flush();
    }
  }

  flush(): void {
    if (this.buffer.length === 0 || !this.applicationId) {
      return;
    }

    const errors = this.buffer.splice(0);
    const url = `${this.config.endpoint}/internal/apps/v1/${this.applicationId}/errors`;

    try {
      fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-major-jwt": this.config.jwtToken,
        },
        body: JSON.stringify({ errors }),
        keepalive: true,
      }).catch(() => {
        // Silently ignore — error reporter must never itself cause errors
      });
    } catch {
      // Silently ignore
    }
  }

  async flushAsync(): Promise<void> {
    if (this.buffer.length === 0 || !this.applicationId) {
      return;
    }

    const errors = this.buffer.splice(0);
    const url = `${this.config.endpoint}/internal/apps/v1/${this.applicationId}/errors`;

    try {
      await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-major-jwt": this.config.jwtToken,
        },
        body: JSON.stringify({ errors }),
      });
    } catch {
      // Silently ignore — error reporter must never itself cause errors
    }
  }

  destroy(): void {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
      this.flushTimer = null;
    }

    if (this.minuteResetTimer) {
      clearInterval(this.minuteResetTimer);
      this.minuteResetTimer = null;
    }

    this.flush();
  }

  /**
   * Resolve the applicationId in priority order:
   *   1. explicit config.applicationId (preferred — caller passes it directly)
   *   2. APPLICATION_ID / MAJOR_APPLICATION_ID env vars (server runtimes)
   *   3. legacy: decode it from a KMS-signed JWT (pre-2026-05-14 deployments)
   *
   * Client bundles can't read non-public env vars, so the browser path relies on
   * config.applicationId (ErrorReporterProvider defaults it from
   * NEXT_PUBLIC_MAJOR_APPLICATION_ID).
   */
  private resolveApplicationId(config: ErrorReporterConfig): string | null {
    if (config.applicationId) {
      return config.applicationId;
    }

    if (typeof process !== "undefined" && process.env) {
      const fromEnv = process.env.APPLICATION_ID || process.env.MAJOR_APPLICATION_ID;
      if (fromEnv) {
        return fromEnv;
      }
    }

    return this.extractApplicationId(config.jwtToken);
  }

  /**
   * Decode the JWT payload (without verification) to extract applicationId.
   * Legacy fallback: only pre-2026-05-14 deployments still carry a KMS-signed JWT
   * with an applicationId claim in MAJOR_JWT_TOKEN. Newer opaque deployment-identity
   * tokens have no claims, so this returns null for them (env var is used instead).
   */
  private extractApplicationId(jwt: string): string | null {
    try {
      const parts = jwt.split(".");
      if (parts.length !== 3) {
        return null;
      }

      // Base64url decode the payload
      const payload = parts[1]!;
      const padded = payload.replace(/-/g, "+").replace(/_/g, "/");
      let decoded: string;

      if (typeof atob === "function") {
        decoded = atob(padded);
      } else {
        decoded = Buffer.from(padded, "base64").toString("utf-8");
      }

      const parsed = JSON.parse(decoded) as { applicationId?: string };
      return parsed.applicationId ?? null;
    } catch {
      return null;
    }
  }
}
