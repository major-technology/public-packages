import type {
  Neo4jInvokeResponse,
} from "../schemas/response";
import { BaseResourceClient } from "../base";
import { buildNeo4jInvokePayload } from "../payload-builders/neo4j";

export class Neo4jResourceClient extends BaseResourceClient {
  /**
   * Execute a Cypher query against Neo4j
   * @param cypher The Cypher query to execute
   * @param params Optional named parameters for the query
   * @param invocationKey Unique key for tracking this invocation
   * @param timeoutMs Optional timeout in milliseconds
   * @returns Response with records and keys
   *
   * @example
   * ```ts
   * const response = await client.invoke(
   *   "MATCH (n:Person {name: $name}) RETURN n",
   *   { name: "Alice" },
   *   "find-alice"
   * );
   *
   * if (response.ok) {
   *   const records = response.result.records;
   * }
   * ```
   */
  async invoke(
    cypher: string,
    params: Record<string, unknown> | undefined,
    invocationKey: string,
    timeoutMs?: number
  ): Promise<Neo4jInvokeResponse> {
    const payload = buildNeo4jInvokePayload(cypher, params, timeoutMs);
    return this.invokeRaw(payload, invocationKey) as Promise<Neo4jInvokeResponse>;
  }
}
