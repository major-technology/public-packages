/**
 * Allowed types for ClickHouse query parameters (positional ? placeholders)
 */
export type DbClickhouseParamPrimitive = string | number | boolean | null;

/**
 * Payload for invoking a ClickHouse database resource
 */
export interface DbClickhousePayload {
  type: "database";
  subtype: "clickhouse";
  /** SQL query to execute */
  sql: string;
  /** Optional positional parameters for the query (? placeholders) */
  params?: DbClickhouseParamPrimitive[];
  /** Optional timeout in milliseconds */
  timeoutMs?: number;
}
