/**
 * Allowed types for MySQL query parameters (positional ? placeholders)
 */
export type DbMysqlParamPrimitive = string | number | boolean | null;

/**
 * Payload for invoking a MySQL database resource
 */
export interface DbMysqlPayload {
  type: "database";
  subtype: "mysql";
  /** SQL query to execute */
  sql: string;
  /** Optional positional parameters for the query (? placeholders) */
  params?: DbMysqlParamPrimitive[];
  /** Optional timeout in milliseconds */
  timeoutMs?: number;
}
