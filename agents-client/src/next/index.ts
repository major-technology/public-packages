import { AgentsClient } from "../client";
import type { AgentsClientConfig } from "../types";
import { defaultGetHeaders } from "./auth";

/**
 * Next.js-aware factory: identical to the base `createAgentsClient`, but
 * defaults `getHeaders` to lift `x-major-user-jwt` from the inbound request so
 * per-user-OAuth agents work transparently. Pass an explicit `getHeaders` to
 * override (e.g. `() => ({})` in a background job).
 */
export function createAgentsClient(config: AgentsClientConfig = {}): AgentsClient {
  return new AgentsClient({
    ...config,
    getHeaders: config.getHeaders ?? defaultGetHeaders,
  });
}

export { AgentsClient } from "../client";
export type {
  AgentsClientConfig,
  RunAgentRequest,
  RunAgentResponse,
  SendMessageResponse,
  StopRunResponse,
  AgentRun,
  AgentMessage,
} from "../types";
export {
  AgentsClientError,
  AgentsValidationError,
  AgentsAuthError,
  AgentNotFoundError,
  AgentRunNotStartedError,
  AgentRunNotActiveError,
} from "../errors";
