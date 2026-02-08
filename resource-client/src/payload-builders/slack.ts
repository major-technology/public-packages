import type { ApiSlackPayload } from "../schemas";

/**
 * Build a Slack invoke payload
 * @param method Slack API method (e.g., "chat.postMessage")
 * @param options Additional options
 */
export function buildSlackInvokePayload(
  method: string,
  options?: {
    body?: Record<string, unknown>;
    timeoutMs?: number;
  }
): ApiSlackPayload {
  return {
    type: "api",
    subtype: "slack",
    method,
    body: options?.body,
    timeoutMs: options?.timeoutMs ?? 30000,
  };
}
