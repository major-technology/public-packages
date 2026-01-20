import type {
  DbMssqlParamValue,
  DbMssqlPayload,
} from "../schemas";
import type { DatabaseInvokeResponse } from "../schemas/response";
import { BaseResourceClient } from "../base";

export class MssqlResourceClient extends BaseResourceClient {
  /**
   * Execute a SQL query against Microsoft SQL Server
   * @param sql The SQL query to execute
   * @param params Optional named parameters (e.g., { id: 123 } for @id)
   * @param invocationKey Unique key for tracking this invocation
   * @param timeoutMs Optional timeout in milliseconds
   * @returns Response with nested result: response.result.database.rows
   *
   * @example
   * ```ts
   * const response = await client.invoke(
   *   "SELECT id, name, email FROM users WHERE id = @id",
   *   { id: 123 },
   *   "get-user-123"
   * );
   *
   * if (response.ok) {
   *   const rows = response.result.database.rows;
   * }
   * ```
   */
  async invoke(
    sql: string,
    params: Record<string, DbMssqlParamValue> | undefined,
    invocationKey: string,
    timeoutMs?: number
  ): Promise<DatabaseInvokeResponse> {
    const payload: DbMssqlPayload = {
      type: "database",
      subtype: "mssql",
      mssql: {
        sql,
        params,
        timeoutMs,
      },
    };

    return this.invokeRaw(payload, invocationKey) as Promise<DatabaseInvokeResponse>;
  }
}
