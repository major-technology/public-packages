import type { DbClickhousePayload, DbClickhouseParam } from "../schemas";

/**
 * Build a ClickHouse invoke payload
 * @param sql The SQL query to execute
 * @param params Optional positional parameters (? placeholders)
 * @param timeoutMs Optional timeout in milliseconds
 */
export function buildClickhouseInvokePayload(
  sql: string,
  params?: DbClickhouseParam[],
  timeoutMs?: number
): DbClickhousePayload {
  return {
    type: "database",
    subtype: "clickhouse",
    sql,
    params,
    timeoutMs,
  };
}
