import type { ApiFirefliesPayload } from "../schemas";

export function buildFirefliesQueryPayload(
  query: string,
  options?: { variables?: Record<string, unknown>; operationName?: string; timeoutMs?: number }
): ApiFirefliesPayload {
  return {
    type: "api",
    subtype: "fireflies",
    query,
    variables: options?.variables,
    operationName: options?.operationName,
    timeoutMs: options?.timeoutMs ?? 30000,
  };
}

export function buildFirefliesMutatePayload(
  mutation: string,
  options?: { variables?: Record<string, unknown>; operationName?: string; timeoutMs?: number }
): ApiFirefliesPayload {
  return buildFirefliesQueryPayload(mutation, options);
}
