/**
 * Payload for invoking a Slack Web API resource
 * Note: Slack authentication is handled automatically by the API
 */
export interface ApiSlackPayload {
  type: "api";
  subtype: "slack";
  /** Slack API method (e.g., "chat.postMessage", "conversations.list") */
  method: string;
  /** Optional JSON body arguments for the API method */
  body?: Record<string, unknown>;
  /** Optional timeout in milliseconds (default: 30000) */
  timeoutMs?: number;
}
