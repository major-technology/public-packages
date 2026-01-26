import type { DbMssqlPayload, DbMssqlParamValue } from "../schemas";

/**
 * Build a MSSQL invoke payload
 * @param sql The SQL query to execute
 * @param params Optional named parameters (e.g., { id: 123 } for @id in the query)
 * @param timeoutMs Optional timeout in milliseconds
 */
export function buildMssqlInvokePayload(
  sql: string,
  params?: Record<string, DbMssqlParamValue>,
  timeoutMs?: number
): DbMssqlPayload {
  return {
    type: "database",
    subtype: "mssql",
    sql,
    params,
    timeoutMs,
  };
}
