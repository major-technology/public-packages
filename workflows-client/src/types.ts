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
   * `x-major-jwt` when available. Starting a run also requires the inbound
   * app-user JWT.
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
   * default for `run` and `getRun` when the call omits `workflowId`.
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

/** Request input for `WorkflowsClient.getRun`. */
export interface GetWorkflowRunRequest {
  /** Id of the run, as returned by `run`. */
  runId: string;
  /** Id of the run's workflow. Optional when the client was constructed with a bound `workflowId`. */
  workflowId?: string;
}

/** A workflow run row. Mirrors the Major API's `WorkflowRunSchema`. */
export interface WorkflowRun {
  id: string;
  workflowId: string;
  status: "running" | "completed" | "failed" | "canceled";
  triggerType: "cron" | "invocation" | "connector-event" | "webhook" | "app";
  triggerId: string | null;
  workflowVersionId: string;
  version: number;
  scheduledAt: string | null;
  eventType: string | null;
  startedAt: string;
  completedAt: string | null;
  /** Set when the run failed or was canceled. */
  error: string | null;
  singleNodeId: string | null;
  name: string | null;
  createdBy: string;
}

/** The run's trace document. Mirrors the Major API's `WorkflowRunDocumentSchema`. */
export interface WorkflowRunDocument {
  run_id: string;
  workflow_id: string;
  workflow_version_id: string;
  status: "running" | "completed" | "failed";
  trigger: {
    id: string;
    type: WorkflowRun["triggerType"];
    input?: Record<string, unknown>;
    triggered_at: string;
  };
  /** Per-node execution records, keyed by execution id. */
  executions: Record<string, unknown>;
  /** The run's output, once it completed. */
  output?: unknown;
  error?: string;
}

/**
 * Successful response from `WorkflowsClient.getRun`. Mirrors the body the Major
 * API returns at `GET /workflows/:workflowId/runs/:runId`.
 */
export interface GetWorkflowRunResponse {
  run: WorkflowRun;
  /** Null until the run has written its trace. */
  document: WorkflowRunDocument | null;
  /** The definition text of the version the run executes. */
  definitionText: string;
}

/**
 * The request Major POSTs to an app's approval path when a workflow's
 * human_approval node delegates to the app. A 2xx only acknowledges receipt:
 * the run waits until the app answers with `approvals.respond`. Delivery
 * retries resend the same `(runId, executionId)`, so store the request keyed by
 * that pair.
 */
export interface AppApprovalRequest {
  runId: string;
  /** One execution of the approval node; loop iterations each get their own. */
  executionId: string;
  workflowId: string;
  message: string;
  /** The node's `payload`, resolved against the run's state. */
  payload: Record<string, unknown>;
  options: { value: string; label?: string; style?: "primary" | "danger" | "neutral" }[];
}

/** Input for `WorkflowsClient.approvals.respond`. `choice` is one of the request's `options[].value`. */
export interface RespondToApprovalRequest {
  runId: string;
  executionId: string;
  choice: string;
}
