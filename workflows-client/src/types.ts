/**
 * Configuration accepted by `createWorkflowsClient` / `new WorkflowsClient(...)`.
 *
 * In a deployed Major app every field has a sensible default sourced from
 * platform-managed env vars and the Next.js request context.
 */
export interface WorkflowsClientConfig {
  /** Base URL of the Major API. Defaults to `process.env.MAJOR_API_BASE_URL`. */
  baseUrl?: string;
  /**
   * The app's platform token. Defaults to `process.env.MAJOR_JWT_TOKEN`. Sent as
   * `x-major-jwt` on every request; in a sandbox preview it authenticates calls
   * that did not come through the app's ingress (no user JWT).
   */
  majorJwtToken?: string;
  /**
   * Returns extra headers for each outbound call. The
   * `@major-tech/workflows-client/next` entry defaults this to lift
   * `x-major-user-jwt` from the current request. Override (e.g. return `{}`)
   * outside a Next.js request scope.
   */
  getHeaders?: () => Promise<Record<string, string>> | Record<string, string>;
  /** Custom fetch implementation. Defaults to `globalThis.fetch`. */
  fetch?: typeof fetch;
  /**
   * Bound workflow id for a generated per-workflow singleton. Used as the
   * default for `run` when the call omits `workflowId`.
   */
  workflowId?: string;
}

/**
 * Request input for `WorkflowsClient.run`. Mirrors the body the Major API
 * expects at `POST /workflows/:workflowId/runs`.
 */
export interface RunWorkflowRequest {
  /**
   * Id of the workflow to run. Optional when the client was constructed with a
   * bound `workflowId` (generated singletons).
   */
  workflowId?: string;
  /** Input for the workflow, as `trigger.input.<field>`; merged over its `input_schema` defaults. */
  input?: Record<string, unknown>;
}

/** Successful response from `WorkflowsClient.run`. */
export interface RunWorkflowResponse {
  /** Id of the started run. */
  runId: string;
}
