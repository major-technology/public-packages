/**
 * Error thrown when resource invocation fails
 * Contains the error message and optional HTTP status code
 */
export class ResourceInvokeError extends Error {
  readonly httpStatus?: number;
  readonly requestId?: string;
  /** Machine-readable error code, e.g. "USER_OAUTH_REQUIRED" */
  readonly code?: string;
  /** Additional structured metadata about the error */
  readonly metadata?: Record<string, unknown>;

  constructor(
    message: string,
    httpStatus?: number,
    requestId?: string,
    code?: string,
    metadata?: Record<string, unknown>,
  ) {
    super(message);
    this.name = "ResourceInvokeError";
    this.httpStatus = httpStatus;
    this.requestId = requestId;
    this.code = code;
    this.metadata = metadata;
  }
}

