/**
 * Payload for invoking a Payload CMS GraphQL query/mutation
 */
export interface ApiPayloadCMSPayload {
  type: "api";
  subtype: "payloadcms";
  /** GraphQL query or mutation string */
  query: string;
  /** GraphQL variables */
  variables?: Record<string, unknown>;
  /** GraphQL operation name */
  operationName?: string;
  /** Timeout in milliseconds (default: 30000) */
  timeoutMs?: number;
}
