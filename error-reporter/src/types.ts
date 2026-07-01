export interface ErrorReporterConfig {
  /** Base URL of the Major API (e.g., MAJOR_API_BASE_URL) */
  endpoint: string;
  /** JWT token for authentication (MAJOR_JWT_TOKEN) */
  jwtToken: string;
  /**
   * The application id errors are reported under. Prefer passing this explicitly.
   * When omitted, it is resolved from APPLICATION_ID / MAJOR_APPLICATION_ID env
   * vars (server), then as a last resort decoded from a legacy KMS-signed JWT.
   *
   * Post-2026-05-14 MAJOR_JWT_TOKEN is an opaque deployment-identity token with
   * no applicationId claim, so the env var is the source of truth.
   */
  applicationId?: string;
  /** Max errors to accept per minute before dropping. Default: 10 */
  maxErrorsPerMinute?: number;
  /** How often to flush buffered errors (ms). Default: 5000 */
  batchIntervalMs?: number;
  /** Max errors per batch before auto-flushing. Default: 10 */
  maxBatchSize?: number;
  /** Enable/disable the reporter. Default: true */
  enabled?: boolean;
}

export interface ErrorEvent {
  message: string;
  stack?: string;
  source: "client" | "server";
  url?: string;
  userAgent?: string;
  timestamp: string;
  context?: Record<string, unknown>;
  tags?: Record<string, string>;
}
