export interface ErrorReporterConfig {
  /** Base URL of the Major API (e.g., MAJOR_API_BASE_URL) */
  endpoint: string;
  /** JWT token for authentication (MAJOR_JWT_TOKEN) */
  jwtToken: string;
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
