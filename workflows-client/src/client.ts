import type {
  WorkflowsClientConfig,
  RunWorkflowRequest,
  RunWorkflowResponse,
  GetWorkflowRunRequest,
  GetWorkflowRunResponse,

  RespondToApprovalRequest,
} from "./types";
import {
  WorkflowsClientError,
  WorkflowsValidationError,
  WorkflowsAuthError,
  WorkflowNotFoundError,
  WorkflowRunNotStartedError,
} from "./errors";

/**
 * Client for starting Major workflow runs, and reading back the runs it started, from a deployed app or sandbox preview.
 *
 * Prefer the `createWorkflowsClient()` factory — it reads platform-managed env
 * vars and (when imported from `@major-tech/workflows-client/next`) wires up
 * auto-forwarding of the inbound viewer JWT.
 */
export class WorkflowsClient {
  private readonly baseUrl: string;
  private readonly majorJwtToken: string | undefined;
  private readonly workflowId: string | undefined;
  private readonly getHeaders: () => Promise<Record<string, string>> | Record<string, string>;
  private readonly fetchImpl: typeof fetch;

  constructor(config: WorkflowsClientConfig = {}) {
    const baseUrl = config.baseUrl ?? process.env.MAJOR_API_BASE_URL;
    if (!baseUrl) {
      throw new WorkflowsClientError(
        "WorkflowsClient: baseUrl is required (set MAJOR_API_BASE_URL or pass baseUrl explicitly).",
      );
    }

    // The JWT is read lazily so generated module-scope singletons can load during
    // `next build` page-data collection (MAJOR_JWT_TOKEN is injected at runtime).
    this.baseUrl = baseUrl.replace(/\/$/, "");
    this.majorJwtToken = config.majorJwtToken;
    this.workflowId = config.workflowId;
    this.getHeaders = config.getHeaders ?? (() => ({}));
    this.fetchImpl = config.fetch ?? globalThis.fetch;
  }

  /**
   * Start a run. Returns as soon as the run is accepted; the workflow runs
   * asynchronously. It runs the workflow's published version; from a sandbox
   * preview, the run's calls back to this app go to that preview.
   */
  async run(request: RunWorkflowRequest = {}): Promise<RunWorkflowResponse> {
    const workflowId = request.workflowId ?? this.workflowId;
    if (!workflowId) {
      throw new WorkflowsValidationError(
        "WorkflowsClient.run: workflowId is required (pass it in the request or bind it on the client).",
      );
    }

    return this.request<RunWorkflowResponse>("POST", `/workflows/${encodeURIComponent(workflowId)}/runs`, {
      input: request.input,
    });
  }

  /**
   * Read back a run this app started: its status, and once finished its output
   * (`document.output`) or error (`run.error`). Any other run is not found.
   */
  async getRun(request: GetWorkflowRunRequest): Promise<GetWorkflowRunResponse> {
    const workflowId = request.workflowId ?? this.workflowId;
    if (!workflowId) {
      throw new WorkflowsValidationError(
        "WorkflowsClient.getRun: workflowId is required (pass it in the request or bind it on the client).",
      );
    }

    return this.request<GetWorkflowRunResponse>(
      "GET",
      `/workflows/${encodeURIComponent(workflowId)}/runs/${encodeURIComponent(request.runId)}`,
      undefined,
    );
  }

  /** Answering approvals a workflow delegated to this app (see `AppApprovalRequest`). */
  readonly approvals = {
    /**
     * Record the app user's decision on an approval this app was sent. Major
     * checks the approval names this app, the run is still waiting, and
     * `choice` is one of its options; the app decides which of its users may
     * answer.
     */
    respond: async ({ runId, executionId, choice }: RespondToApprovalRequest): Promise<void> => {
      await this.request<{ success: boolean }>(
        "POST",
        `/workflow-approvals/runs/${encodeURIComponent(runId)}/executions/${encodeURIComponent(executionId)}`,
        { choice },
      );
    },
  };

  private async request<T>(method: string, path: string, body: unknown): Promise<T> {
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    const majorJwtToken = this.majorJwtToken ?? process.env.MAJOR_JWT_TOKEN;
    if (majorJwtToken) {
      headers["x-major-jwt"] = majorJwtToken;
    }
    Object.assign(headers, await this.getHeaders());

    if (!headers["x-major-jwt"] && !headers["x-major-user-jwt"]) {
      throw new WorkflowsAuthError(
        "WorkflowsClient: no credentials (set MAJOR_JWT_TOKEN, or call from a request that carries x-major-user-jwt).",
      );
    }

    let response: Response;
    try {
      response = await this.fetchImpl(`${this.baseUrl}${path}`, {
        method,
        headers,
        body: body === undefined ? undefined : JSON.stringify(body),
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      throw new WorkflowRunNotStartedError(`Failed to reach Major API: ${message}`);
    }

    const requestId = response.headers.get("x-request-id") ?? undefined;

    if (response.ok) {
      return (await response.json()) as T;
    }

    const errorMessage = await readErrorMessage(response);
    throw toWorkflowsError(response.status, errorMessage, requestId);
  }
}

/**
 * Factory equivalent to `new WorkflowsClient(config)`.
 *
 * In Next.js apps, prefer `createWorkflowsClient` from
 * `@major-tech/workflows-client/next` — it auto-forwards `x-major-user-jwt` from
 * the inbound request headers.
 */
export function createWorkflowsClient(config: WorkflowsClientConfig = {}): WorkflowsClient {
  return new WorkflowsClient(config);
}

function toWorkflowsError(status: number, message: string, requestId?: string): WorkflowsClientError {
  if (status === 400) {
    return new WorkflowsValidationError(message, requestId);
  }
  if (status === 401 || status === 403) {
    return new WorkflowsAuthError(message, status, requestId);
  }
  if (status === 404) {
    return new WorkflowNotFoundError(message, requestId);
  }
  return new WorkflowRunNotStartedError(message, status, requestId);
}

async function readErrorMessage(response: Response): Promise<string> {
  try {
    const data = (await response.json()) as { error?: unknown; message?: unknown };
    if (typeof data.error === "string") {
      return data.error;
    }
    if (typeof data.message === "string") {
      return data.message;
    }
  } catch {
    // Non-JSON body: fall through to the status text.
  }
  return `HTTP ${response.status} ${response.statusText}`;
}
