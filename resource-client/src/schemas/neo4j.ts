/**
 * Payload for invoking a Neo4j database resource
 */
export interface DbNeo4jPayload {
  type: "database";
  subtype: "neo4j";
  /** Cypher query to execute */
  cypher: string;
  /** Optional named parameters for the query */
  params?: Record<string, unknown>;
  /** Optional timeout in milliseconds */
  timeoutMs?: number;
}

/**
 * Result from a Neo4j query execution
 */
export interface DbNeo4jResult {
  kind: "neo4j";
  /** Array of record objects returned by the query */
  records: Record<string, unknown>[];
  /** Column keys from the result set */
  keys: string[];
}
