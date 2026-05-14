import type { ApiPayloadCMSPayload } from "../schemas";

export function buildPayloadCMSQueryPayload(
  query: string,
  options?: { variables?: Record<string, unknown>; operationName?: string; timeoutMs?: number }
): ApiPayloadCMSPayload {
  return {
    type: "api",
    subtype: "payloadcms",
    query,
    variables: options?.variables,
    operationName: options?.operationName,
    timeoutMs: options?.timeoutMs ?? 30000,
  };
}

export function buildPayloadCMSMutatePayload(
  mutation: string,
  options?: { variables?: Record<string, unknown>; operationName?: string; timeoutMs?: number }
): ApiPayloadCMSPayload {
  return buildPayloadCMSQueryPayload(mutation, options);
}
