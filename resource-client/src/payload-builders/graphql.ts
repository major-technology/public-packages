import type { ApiGraphQLPayload } from "../schemas";

/**
 * Build a GraphQL invoke payload
 * @param query GraphQL query or mutation string
 * @param options Additional options
 */
export function buildGraphQLInvokePayload(
  query: string,
  options?: {
    variables?: Record<string, unknown>;
    operationName?: string;
    timeoutMs?: number;
  }
): ApiGraphQLPayload {
  return {
    type: "api",
    subtype: "graphql",
    query,
    variables: options?.variables,
    operationName: options?.operationName,
    timeoutMs: options?.timeoutMs ?? 30000,
  };
}
