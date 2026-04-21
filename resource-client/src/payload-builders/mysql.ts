import type { DbMysqlPayload, DbMysqlParamPrimitive } from "../schemas";

/**
 * Build a MySQL invoke payload
 * @param sql The SQL query to execute
 * @param params Optional positional parameters (? placeholders)
 * @param timeoutMs Optional timeout in milliseconds
 */
export function buildMysqlInvokePayload(
  sql: string,
  params?: DbMysqlParamPrimitive[],
  timeoutMs?: number
): DbMysqlPayload {
  return {
    type: "database",
    subtype: "mysql",
    sql,
    params,
    timeoutMs,
  };
}
