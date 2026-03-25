export interface ApiLinearPayload {
  type: "api";
  subtype: "linear";
  query: string;
  variables?: Record<string, unknown>;
  operationName?: string;
  timeoutMs?: number;
}
