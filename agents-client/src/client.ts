import type {
  AgentsClientConfig,
  RunAgentRequest,
  RunAgentResponse,
  SendMessageResponse,
  StopRunResponse,
  AgentRun,
  AgentMessage,
  PendingApproval,
  ApprovalDecision,
  SubmitApprovalDecisionResponse,
} from "./types";
import {
  AgentsClientError,
  AgentsValidationError,
  AgentsAuthError,
  AgentNotFoundError,
  AgentRunNotStartedError,
  AgentRunNotActiveError,
} from "./errors";

/**
 * Client for triggering and interacting with Major agents from a deployed app.
 *
 * Prefer the `createAgentsClient()` factory — it reads platform-managed env
 * vars and (when imported from `@major-tech/agents-client/next`) wires up
 * auto-forwarding of the inbound viewer JWT.
 *
 * A "run" is a Major chat thread; the `chatThreadId` returned by `run()` is the
 * `runId` the run-ops methods (`sendMessage` / `stopAgent` / `getAgentContent`)
 * accept.
 */
export class AgentsClient {
  private readonly baseUrl: string;
  private readonly majorJwtToken: string;
  private readonly getHeaders: () => Promise<Record<string, string>> | Record<string, string>;
  private readonly fetchImpl: typeof fetch;

  constructor(config: AgentsClientConfig = {}) {
    const baseUrl = config.baseUrl ?? process.env.MAJOR_API_BASE_URL;
    if (!baseUrl) {
      throw new AgentsClientError(
        "AgentsClient: baseUrl is required (set MAJOR_API_BASE_URL or pass baseUrl explicitly).",
      );
    }

    const majorJwtToken = config.majorJwtToken ?? process.env.MAJOR_JWT_TOKEN;
    if (!majorJwtToken) {
      throw new AgentsClientError(
        "AgentsClient: majorJwtToken is required (set MAJOR_JWT_TOKEN or pass majorJwtToken explicitly).",
      );
    }

    this.baseUrl = baseUrl.replace(/\/$/, "");
    this.majorJwtToken = majorJwtToken;
    this.getHeaders = config.getHeaders ?? (() => ({}));
    this.fetchImpl = config.fetch ?? globalThis.fetch;
  }

  /**
   * Start an agent run. Fire-and-forget: returns as soon as the server has
   * created the chat thread and accepted the run; the agent itself runs
   * asynchronously. The returned `chatThreadId` is the `runId` for run-ops.
   */
  async run(request: RunAgentRequest): Promise<RunAgentResponse> {
    if (!request.agentId) {
      throw new AgentsValidationError("AgentsClient.run: agentId is required.");
    }
    if (!request.prompt) {
      throw new AgentsValidationError("AgentsClient.run: prompt is required.");
    }

    const { agentId, ...body } = request;

    return this.request<RunAgentResponse>(
      "POST",
      `/agents/${encodeURIComponent(agentId)}/runs`,
      body,
      (message) => new AgentRunNotStartedError(`Failed to reach Major API: ${message}`),
    );
  }

  /**
   * Send a follow-up message to a run this app started. Throws
   * {@link AgentRunNotActiveError} if the run has already finished — call
   * `run()` again to start a new one.
   */
  async sendMessage(runId: string, message: string): Promise<SendMessageResponse> {
    if (!runId) {
      throw new AgentsValidationError("AgentsClient.sendMessage: runId is required.");
    }
    if (!message) {
      throw new AgentsValidationError("AgentsClient.sendMessage: message is required.");
    }

    return this.request<SendMessageResponse>(
      "POST",
      `/agents/runs/${encodeURIComponent(runId)}/messages`,
      { message },
    );
  }

  /**
   * Stop a run this app started. Idempotent: stopping an already-finished run
   * succeeds and reports `"stopped"`.
   */
  async stopAgent(runId: string): Promise<StopRunResponse> {
    if (!runId) {
      throw new AgentsValidationError("AgentsClient.stopAgent: runId is required.");
    }

    return this.request<StopRunResponse>(
      "POST",
      `/agents/runs/${encodeURIComponent(runId)}/stop`,
      undefined,
    );
  }

  /**
   * List runs this app started that are still executing, optionally filtered to
   * a single agent. "Live" means the run's session has not ended.
   */
  async getRunningInstancesOfAgent(agentId?: string): Promise<AgentRun[]> {
    const params = new URLSearchParams({ status: "active" });
    if (agentId) {
      params.set("agentId", agentId);
    }

    const result = await this.request<{ runs: AgentRun[] }>(
      "GET",
      `/agents/runs?${params.toString()}`,
      undefined,
    );

    return result.runs;
  }

  /**
   * Read the most recent messages of a run's thread. `n` caps how many trailing
   * messages are returned (the server default applies when omitted).
   */
  async getAgentContent(runId: string, n?: number): Promise<AgentMessage[]> {
    if (!runId) {
      throw new AgentsValidationError("AgentsClient.getAgentContent: runId is required.");
    }

    const params = new URLSearchParams();
    if (n !== undefined) {
      params.set("n", String(n));
    }
    const query = params.toString();

    const result = await this.request<{ messages: AgentMessage[] }>(
      "GET",
      `/agents/runs/${encodeURIComponent(runId)}/messages${query ? `?${query}` : ""}`,
      undefined,
    );

    return result.messages;
  }

  /**
   * List the tool calls a run this app started is currently paused on, awaiting
   * approval. Each run blocks until you answer with {@link respondToApproval}.
   * Poll this (e.g. from a cron) to surface an approval button while a run is
   * live; returns an empty array when nothing is pending.
   */
  async listPendingApprovals(runId: string): Promise<PendingApproval[]> {
    if (!runId) {
      throw new AgentsValidationError("AgentsClient.listPendingApprovals: runId is required.");
    }

    const result = await this.request<{ approvals: PendingApproval[] }>(
      "GET",
      `/agents/runs/${encodeURIComponent(runId)}/approvals`,
      undefined,
    );

    return result.approvals;
  }

  /**
   * Approve or deny a pending tool call, unblocking the paused run. Throws
   * {@link AgentNotFoundError} if the approval is no longer pending (already
   * answered, or it expired and was auto-denied).
   */
  async respondToApproval(
    runId: string,
    approvalId: string,
    decision: ApprovalDecision,
  ): Promise<SubmitApprovalDecisionResponse> {
    if (!runId) {
      throw new AgentsValidationError("AgentsClient.respondToApproval: runId is required.");
    }
    if (!approvalId) {
      throw new AgentsValidationError("AgentsClient.respondToApproval: approvalId is required.");
    }

    return this.request<SubmitApprovalDecisionResponse>(
      "POST",
      `/agents/runs/${encodeURIComponent(runId)}/approvals/${encodeURIComponent(approvalId)}/decision`,
      {
        approved: decision.approved,
        feedback: decision.feedback,
        remember: decision.remember ?? false,
      },
    );
  }

  private async request<T>(
    method: string,
    path: string,
    body: unknown,
    onTransportError: (message: string) => AgentsClientError = (message) =>
      new AgentsClientError(`Failed to reach Major API: ${message}`),
  ): Promise<T> {
    const url = `${this.baseUrl}${path}`;
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      "x-major-jwt": this.majorJwtToken,
    };
    Object.assign(headers, await this.getHeaders());

    let response: Response;
    try {
      response = await this.fetchImpl(url, {
        method,
        headers,
        body: body === undefined ? undefined : JSON.stringify(body),
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      throw onTransportError(message);
    }

    const requestId = response.headers.get("x-request-id") ?? undefined;

    if (response.ok) {
      if (response.status === 204) {
        return undefined as T;
      }

      return (await response.json()) as T;
    }

    const errorMessage = await readErrorMessage(response);
    throw toAgentsError(response.status, errorMessage, requestId);
  }
}

/**
 * Factory mirroring the convention used by `@major-tech/resource-client`.
 * Equivalent to `new AgentsClient(config)`.
 *
 * In Next.js apps, prefer `createAgentsClient` from
 * `@major-tech/agents-client/next` — it auto-forwards `x-major-user-jwt` from
 * the inbound request headers.
 */
export function createAgentsClient(config: AgentsClientConfig = {}): AgentsClient {
  return new AgentsClient(config);
}

function toAgentsError(status: number, message: string, requestId?: string): AgentsClientError {
  if (status === 400) {
    return new AgentsValidationError(message, requestId);
  }
  if (status === 401 || status === 403) {
    return new AgentsAuthError(message, status, requestId);
  }
  if (status === 404) {
    return new AgentNotFoundError(message, requestId);
  }
  if (status === 409) {
    return new AgentRunNotActiveError(message, requestId);
  }
  return new AgentRunNotStartedError(message, status, requestId);
}

async function readErrorMessage(response: Response): Promise<string> {
  try {
    const data = (await response.json()) as { message?: unknown; error?: unknown };
    if (typeof data.message === "string") {
      return data.message;
    }
    if (typeof data.error === "string") {
      return data.error;
    }
  } catch {
    // Non-JSON error body — fall through to the generic message.
  }

  return `Major API responded with HTTP ${response.status}`;
}
