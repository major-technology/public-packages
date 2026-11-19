/**
 * Error hierarchy for the Major workflows client. Every error extends
 * {@link WorkflowsClientError}, which carries the HTTP status (when the failure
 * came from a response) and the server's `x-request-id` for support/debugging.
 */
export class WorkflowsClientError extends Error {
  readonly httpStatus?: number;
  readonly requestId?: string;

  constructor(message: string, httpStatus?: number, requestId?: string) {
    super(message);
    this.name = "WorkflowsClientError";
    this.httpStatus = httpStatus;
    this.requestId = requestId;
  }
}

/** The request was rejected as invalid, e.g. input failing the workflow's `input_schema` (HTTP 400). */
export class WorkflowsValidationError extends WorkflowsClientError {
  constructor(message: string, requestId?: string) {
    super(message, 400, requestId);
    this.name = "WorkflowsValidationError";
  }
}

/**
 * Authentication or authorization failed (HTTP 401/403): no caller token, or
 * the app or its deployer may not use this workflow.
 */
export class WorkflowsAuthError extends WorkflowsClientError {
  constructor(message: string, httpStatus?: number, requestId?: string) {
    super(message, httpStatus, requestId);
    this.name = "WorkflowsAuthError";
  }
}

/** The workflow or version could not be found (HTTP 404). */
export class WorkflowNotFoundError extends WorkflowsClientError {
  constructor(message: string, requestId?: string) {
    super(message, 404, requestId);
    this.name = "WorkflowNotFoundError";
  }
}

/**
 * The run could not be started: the workflow is not published and not open in
 * a sandbox (HTTP 409), or a transport error prevented the request.
 */
export class WorkflowRunNotStartedError extends WorkflowsClientError {
  constructor(message: string, httpStatus?: number, requestId?: string) {
    super(message, httpStatus, requestId);
    this.name = "WorkflowRunNotStartedError";
  }
}
