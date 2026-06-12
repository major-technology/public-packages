/**
 * Configuration accepted by `createAgentsClient` / `new AgentsClient(...)`.
 *
 * In a deployed Major app every field has a sensible default sourced from
 * platform-managed env vars and the Next.js request context.
 */
export interface AgentsClientConfig {
  /** Base URL of the Major API. Defaults to `process.env.MAJOR_API_BASE_URL`. */
  baseUrl?: string;
  /**
   * Deployment-identity JWT. Defaults to `process.env.MAJOR_JWT_TOKEN`. Sent as
   * the `x-major-jwt` header on every request.
   */
  majorJwtToken?: string;
  /**
   * Returns extra headers for each outbound call. The
   * `@major-tech/agents-client/next` entry defaults this to lift
   * `x-major-user-jwt` from the current request so per-user-OAuth agents work
   * transparently. Override (e.g. return `{}`) outside a Next.js request scope.
   */
  getHeaders?: () => Promise<Record<string, string>> | Record<string, string>;
  /** Custom fetch implementation. Defaults to `globalThis.fetch`. */
  fetch?: typeof fetch;
}

/**
 * Request input for `AgentsClient.run`. Mirrors the body the Major API expects
 * at `POST /agents/:agentId/runs`.
 */
export interface RunAgentRequest {
  /** Stable id of the agent to invoke. */
  agentId: string;
  /** Prompt the agent should act on. */
  prompt: string;
  /** Optional human-readable name for the run. Shown in the Major UI. */
  name?: string;
  /** Optional description for the run. */
  description?: string;
  /** Optional structured context forwarded to the agent. */
  payload?: Record<string, unknown>;
}

/** Successful response from `AgentsClient.run`. */
export interface RunAgentResponse {
  /** Chat thread the run is associated with; also the `runId` for run-ops. */
  chatThreadId: string;
  /** Run lifecycle status. V1 only emits `"started"`. */
  status: "started";
}

/** Response from `AgentsClient.sendMessage`. */
export interface SendMessageResponse {
  /** The message was accepted and enqueued to the run. */
  status: "queued";
}

/**
 * Response from `AgentsClient.stopAgent`. Idempotent: stopping an
 * already-finished run still reports `"stopped"`.
 */
export interface StopRunResponse {
  status: "stopped";
}

/** A run started by this app, as returned by `getRunningInstancesOfAgent`. */
export interface AgentRun {
  /** The run id (= chat thread id). */
  runId: string;
  /** Agent the run is executing. */
  agentId: string;
  /** Live status. Only currently-running runs are returned. */
  status: "running";
  /** ISO-8601 start time. */
  startedAt: string;
}

/**
 * One message in a run's thread, as returned by `getAgentContent`. Mirrors the
 * Major chat-message envelope; `content` is left loose because its shape varies
 * by `type` (`message` / `thinking` / `tool_use` / `tool_result` / ...).
 */
export interface AgentMessage {
  role: "user" | "assistant" | "system";
  type: string;
  content: unknown;
  timestamp: string;
}

/**
 * A tool call a run is paused on, awaiting approval, as returned by
 * `listPendingApprovals`. The agent blocks until the app submits a decision via
 * `respondToApproval`.
 */
export interface PendingApproval {
  /** Id to pass back to `respondToApproval`. */
  approvalId: string;
  /** The tool the agent wants to call (e.g. a connector or app-endpoint tool). */
  toolName: string;
  /** The arguments of the gated call, so the app can show what's about to run. */
  toolArgs: unknown;
  /** Optional human-readable summary of the request. */
  description?: string;
  /** ISO-8601 time the approval auto-denies if left unanswered. */
  expiresAt?: string;
}

/** Input for `AgentsClient.respondToApproval`. */
export interface ApprovalDecision {
  /** `true` to allow the tool call, `false` to deny it. */
  approved: boolean;
  /** Optional note passed back to the agent (especially useful on a denial). */
  feedback?: string;
  /**
   * When `true`, persist the decision agent-wide so this tool stops prompting on
   * future runs. No-op for tools that aren't permission-governed. Defaults to
   * `false`.
   */
  remember?: boolean;
}

/** Response from `AgentsClient.respondToApproval`. */
export interface SubmitApprovalDecisionResponse {
  /** The decision was recorded and the run unblocked. */
  status: "recorded";
}
