/**
 * Allowed types for ClickHouse query parameters (positional ? placeholders)
 */
export type DbClickhouseParamPrimitive = string | number | boolean | null;

/** ClickHouse also accepts nested values for Array and Tuple parameters. */
export type DbClickhouseParam = DbClickhouseParamPrimitive | DbClickhouseParam[];

/**
 * Payload for invoking a ClickHouse database resource
 */
export interface DbClickhousePayload {
  type: "database";
  subtype: "clickhouse";
  /** SQL query to execute */
  sql: string;
  /** Optional positional parameters for the query (? placeholders) */
  params?: DbClickhouseParam[];
  /** Optional timeout in milliseconds */
  timeoutMs?: number;
}
