import type {
  DbClickhouseParamPrimitive,
  DatabaseInvokeResponse,
} from "../schemas";
import { BaseResourceClient } from "../base";
import { buildClickhouseInvokePayload } from "../payload-builders/clickhouse";

export class ClickhouseResourceClient extends BaseResourceClient {
  /**
   * Execute a SQL query against ClickHouse
   * @param sql The SQL query to execute
   * @param params Optional positional parameters (? placeholders)
   * @param invocationKey Unique key for tracking this invocation
   * @param timeoutMs Optional timeout in milliseconds
   * @returns Typed response with rows of type T
   *
   * @example
   * ```ts
   * interface Event { id: number; name: string; timestamp: string }
   *
   * const response = await client.invoke<Event>(
   *   "SELECT id, name, timestamp FROM events WHERE id = ?",
   *   [123],
   *   "get-event-123"
   * );
   *
   * if (response.ok) {
   *   const events: Event[] = response.result.rows;
   * }
   * ```
   */
  async invoke<T = Record<string, unknown>>(
    sql: string,
    params: DbClickhouseParamPrimitive[] | undefined,
    invocationKey: string,
    timeoutMs?: number
  ): Promise<DatabaseInvokeResponse<T>> {
    const payload = buildClickhouseInvokePayload(sql, params, timeoutMs);
    return this.invokeRaw(payload, invocationKey) as Promise<DatabaseInvokeResponse<T>>;
  }
}
