import type { ResourceInvokePayload } from ".";

/**
 * Request envelope for resource invocation
 */
export interface InvokeRequest {
  /** The resource-specific payload */
  payload: ResourceInvokePayload;
  /** 
   * Invocation key - reused across multiple invocations of the same query.
   * Can be searched in the source code for tracking purposes.
   * Format: letters, numbers, and . _ : - (must start with letter or number)
   */
  invocationKey: string;
}

