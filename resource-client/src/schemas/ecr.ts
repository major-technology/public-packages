/**
 * Supported ECR commands
 */
export type ECRCommand =
  | "ListRepositories"
  | "ListImages"
  | "DescribeImages";

/**
 * Payload for invoking an ECR resource
 */
export interface ApiECRPayload {
  type: "api";
  subtype: "ecr";
  /** ECR command to execute */
  command: ECRCommand;
  /** Parameters for the ECR command (varies by command) */
  params?: Record<string, unknown>;
  /** Optional timeout in milliseconds */
  timeoutMs?: number;
}

/**
 * Result from an ECR operation
 */
export interface ApiECRResult {
  kind: "api";
  command: string;
  /** Response data from the ECR command */
  data: unknown;
}
