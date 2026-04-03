/**
 * Error thrown when resource invocation fails
 * Contains the error message and optional HTTP status code
 */
export class ResourceInvokeError extends Error {
  readonly httpStatus?: number;
  readonly requestId?: string;

  constructor(
    message: string,
    httpStatus?: number,
    requestId?: string
  ) {
    super(message);
    this.name = "ResourceInvokeError";
    this.httpStatus = httpStatus;
    this.requestId = requestId;
  }
}

