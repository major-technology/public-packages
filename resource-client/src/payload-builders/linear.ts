import type { ApiLinearPayload } from "../schemas";

export function buildLinearGraphQLPayload(
  query: string,
  options?: {
    variables?: Record<string, unknown>;
    operationName?: string;
    timeoutMs?: number;
  }
): ApiLinearPayload {
  return {
    type: "api",
    subtype: "linear",
    query,
    variables: options?.variables,
    operationName: options?.operationName,
    timeoutMs: options?.timeoutMs ?? 30000,
  };
}
