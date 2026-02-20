/**
 * Payload for invoking a GraphQL API resource
 */
export interface ApiGraphQLPayload {
  type: "api";
  subtype: "graphql";
  /** GraphQL query or mutation string */
  query: string;
  /** Variables for the GraphQL operation */
  variables?: Record<string, unknown>;
  /** Name of the operation to execute (when query contains multiple operations) */
  operationName?: string;
  /** Optional timeout in milliseconds (default: 30000) */
  timeoutMs?: number;
}
