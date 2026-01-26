import type { DbPostgresPayload, DbParamPrimitive } from "../schemas";

/**
 * Build a PostgreSQL invoke payload
 * @param sql The SQL query to execute
 * @param params Optional positional parameters ($1, $2, etc.)
 * @param timeoutMs Optional timeout in milliseconds
 */
export function buildPostgresInvokePayload(
  sql: string,
  params?: DbParamPrimitive[],
  timeoutMs?: number
): DbPostgresPayload {
  return {
    type: "database",
    subtype: "postgresql",
    sql,
    params,
    timeoutMs,
  };
}
