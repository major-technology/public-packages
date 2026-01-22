/**
 * Lambda invocation type
 * - RequestResponse (default): Synchronous invocation
 * - Event: Asynchronous invocation
 * - DryRun: Validate parameters and permissions only
 */
export type LambdaInvocationType = "RequestResponse" | "Event" | "DryRun";

/**
 * Lambda log type
 * - None (default): Don't include logs
 * - Tail: Include the last 4 KB of execution log (sync only)
 */
export type LambdaLogType = "None" | "Tail";

/**
 * Payload for invoking a Lambda resource
 * Matches the backend LambdaInvokePayload structure in go-common/resourcetypes/lambda.go
 */
export interface ApiLambdaPayload {
  type: "api";
  subtype: "lambda";

  /**
   * The name, ARN, or partial ARN of the Lambda function.
   * Formats:
   * - Function name: my-function
   * - Function ARN: arn:aws:lambda:us-west-2:123456789012:function:my-function
   * - Partial ARN: 123456789012:function:my-function
   * You can append a version number or alias to any of the formats.
   */
  FunctionName: string;

  /**
   * The JSON input for the Lambda function.
   * Max 6 MB for synchronous invocations, 1 MB for asynchronous.
   */
  Payload?: unknown;

  /**
   * The invocation mode.
   * - RequestResponse (default): Synchronous invocation
   * - Event: Asynchronous invocation
   * - DryRun: Validate parameters and permissions only
   */
  InvocationType?: LambdaInvocationType;

  /**
   * Controls execution log inclusion in the response.
   * - None (default): Don't include logs
   * - Tail: Include the last 4 KB of execution log (sync only)
   */
  LogType?: LambdaLogType;

  /**
   * Specifies a version or alias to invoke.
   * If not specified, invokes $LATEST.
   */
  Qualifier?: string;

  /**
   * Up to 3,583 bytes of base64-encoded data about the invoking client
   * to pass to the function. Only for synchronous invocations.
   */
  ClientContext?: string;

  /**
   * A unique name for durable execution.
   * Length: 1-64 characters. Pattern: [a-zA-Z0-9-_]+
   */
  DurableExecutionName?: string;

  /**
   * The identifier for tenant in multi-tenant Lambda function.
   * Length: 1-256 characters.
   */
  TenantId?: string;
}

/**
 * Result from a Lambda invocation
 * Matches the backend LambdaInvokeResult structure in go-common/resourcetypes/lambda.go
 */
export interface ApiLambdaResult {
  kind: "lambda";

  /**
   * The HTTP status code for the invocation:
   * - 200: RequestResponse success
   * - 202: Event success (async)
   * - 204: DryRun success
   */
  StatusCode: number;

  /**
   * The response from the Lambda function.
   * For RequestResponse, contains the function's return value.
   * For Event and DryRun, this is empty.
   */
  Payload?: unknown;

  /**
   * Indicates if there was an error during function execution.
   * Values: "Handled" or "Unhandled"
   */
  FunctionError?: string;

  /**
   * The last 4 KB of execution log (base64-encoded).
   * Only populated when LogType is "Tail".
   */
  LogResult?: string;

  /**
   * The version of the function that was executed.
   */
  ExecutedVersion?: string;

  /**
   * The ARN of the started durable execution.
   */
  DurableExecutionArn?: string;
}
