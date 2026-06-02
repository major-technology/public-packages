/**
 * Error hierarchy for the Major agents client. Every error extends
 * {@link AgentsClientError}, which carries the HTTP status (when the failure
 * came from a response) and the server's `x-request-id` for support/debugging.
 */
export class AgentsClientError extends Error {
  readonly httpStatus?: number;
  readonly requestId?: string;

  constructor(message: string, httpStatus?: number, requestId?: string) {
    super(message);
    this.name = "AgentsClientError";
    this.httpStatus = httpStatus;
    this.requestId = requestId;
  }
}

/** The request was rejected as invalid (HTTP 400). */
export class AgentsValidationError extends AgentsClientError {
  constructor(message: string, requestId?: string) {
    super(message, 400, requestId);
    this.name = "AgentsValidationError";
  }
}

/** Authentication or authorization failed (HTTP 401/403). */
export class AgentsAuthError extends AgentsClientError {
  constructor(message: string, httpStatus?: number, requestId?: string) {
    super(message, httpStatus, requestId);
    this.name = "AgentsAuthError";
  }
}

/** The agent or run could not be found, or is not owned by this app (HTTP 404). */
export class AgentNotFoundError extends AgentsClientError {
  constructor(message: string, requestId?: string) {
    super(message, 404, requestId);
    this.name = "AgentNotFoundError";
  }
}

/** A run could not be started, or a transport error prevented the request. */
export class AgentRunNotStartedError extends AgentsClientError {
  constructor(message: string, httpStatus?: number, requestId?: string) {
    super(message, httpStatus, requestId);
    this.name = "AgentRunNotStartedError";
  }
}

/**
 * The targeted run is no longer active, so the operation (e.g. `sendMessage`)
 * cannot be applied (HTTP 409). Re-trigger the agent with `run()` to start a
 * new run.
 */
export class AgentRunNotActiveError extends AgentsClientError {
  constructor(message: string, requestId?: string) {
    super(message, 409, requestId);
    this.name = "AgentRunNotActiveError";
  }
}
