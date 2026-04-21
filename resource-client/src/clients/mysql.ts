import type {
  DbMysqlParamPrimitive,
  DatabaseInvokeResponse,
} from "../schemas";
import { BaseResourceClient } from "../base";
import { buildMysqlInvokePayload } from "../payload-builders/mysql";

export class MysqlResourceClient extends BaseResourceClient {
  /**
   * Execute a SQL query against MySQL
   * @param sql The SQL query to execute
   * @param params Optional positional parameters (? placeholders)
   * @param invocationKey Unique key for tracking this invocation
   * @param timeoutMs Optional timeout in milliseconds
   * @returns Typed response with rows of type T
   *
   * @example
   * ```ts
   * interface User { id: number; name: string; email: string }
   *
   * const response = await client.invoke<User>(
   *   "SELECT id, name, email FROM users WHERE id = ?",
   *   [123],
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
    params: DbMysqlParamPrimitive[] | undefined,
    invocationKey: string,
    timeoutMs?: number
  ): Promise<DatabaseInvokeResponse<T>> {
    const payload = buildMysqlInvokePayload(sql, params, timeoutMs);
    return this.invokeRaw(payload, invocationKey) as Promise<DatabaseInvokeResponse<T>>;
  }
}
