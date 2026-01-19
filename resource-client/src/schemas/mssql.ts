/**
 * Allowed types for MSSQL query parameters (named parameters)
 */
export type DbMssqlParamValue = string | number | boolean | null;

/**
 * Payload for invoking a Microsoft SQL Server database resource
 */
export interface DbMssqlPayload {
  type: "database";
  subtype: "mssql";
  /** SQL query to execute */
  sql: string;
  /** Optional named parameters for the query (e.g., { id: 123 } for @id) */
  params?: Record<string, DbMssqlParamValue>;
  /** Optional timeout in milliseconds */
  timeoutMs?: number;
}
