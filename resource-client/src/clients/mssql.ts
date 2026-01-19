import type {
  DbMssqlParamValue,
  DbMssqlPayload,
  DatabaseInvokeResponse,
} from "../schemas";
import { BaseResourceClient } from "../base";

export class MssqlResourceClient extends BaseResourceClient {
  /**
   * Execute a SQL query against MSSQL
   * @param sql The SQL query to execute
   * @param params Optional named parameters (e.g., { id: 123 } for @id in the query)
   * @param invocationKey Unique key for tracking this invocation
   * @param timeoutMs Optional timeout in milliseconds
   * @returns Typed response with rows of type T
   *
   * @example
   * ```ts
   * interface User { id: number; name: string; email: string }
   *
   * const response = await client.invoke<User>(
   *   "SELECT id, name, email FROM users WHERE id = @id",
   *   { id: 123 },
   *   "get-user-123"
   * );
   *
   * if (response.ok) {
   *   const users: User[] = response.result.rows;
   * }
   * ```
   */
  async invoke<T = Record<string, unknown>>(
    sql: string,
    params: Record<string, DbMssqlParamValue> | undefined,
    invocationKey: string,
    timeoutMs?: number
  ): Promise<DatabaseInvokeResponse<T>> {
    const payload: DbMssqlPayload = {
      type: "database",
      subtype: "mssql",
      sql,
      params,
      timeoutMs,
    };

    return this.invokeRaw(payload, invocationKey) as Promise<DatabaseInvokeResponse<T>>;
  }
}
