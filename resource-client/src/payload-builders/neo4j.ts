import type { DbNeo4jPayload } from "../schemas";

/**
 * Build a Neo4j invoke payload
 * @param cypher The Cypher query to execute
 * @param params Optional named parameters for the query
 * @param timeoutMs Optional timeout in milliseconds
 */
export function buildNeo4jInvokePayload(
  cypher: string,
  params?: Record<string, unknown>,
  timeoutMs?: number
): DbNeo4jPayload {
  return {
    type: "database",
    subtype: "neo4j",
    cypher,
    params,
    timeoutMs,
  };
}
