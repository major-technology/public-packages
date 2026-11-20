import { WorkflowsClient } from "../client";
import type { WorkflowsClientConfig } from "../types";
import { defaultGetHeaders } from "./auth";

/**
 * Next.js-aware factory: identical to the base `createWorkflowsClient`, but
 * defaults `getHeaders` to lift `x-major-user-jwt` from the inbound request.
 * Pass an explicit `getHeaders` to override.
 */
export function createWorkflowsClient(config: WorkflowsClientConfig = {}): WorkflowsClient {
  return new WorkflowsClient({
    ...config,
    getHeaders: config.getHeaders ?? defaultGetHeaders,
  });
}

export { WorkflowsClient } from "../client";
export type { WorkflowsClientConfig, RunWorkflowRequest, RunWorkflowResponse } from "../types";
export {
  WorkflowsClientError,
  WorkflowsValidationError,
  WorkflowsAuthError,
  WorkflowNotFoundError,
  WorkflowRunNotStartedError,
} from "../errors";
