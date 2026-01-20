/**
 * Supported S3 commands for storage resources
 */
export type S3Command =
  | "ListObjectsV2"
  | "HeadObject"
  | "GetObjectTagging"
  | "PutObjectTagging"
  | "DeleteObject"
  | "DeleteObjects"
  | "CopyObject"
  | "ListBuckets"
  | "GetBucketLocation"
  | "GeneratePresignedUrl";

/**
 * S3 specific invoke data
 */
export interface S3InvokeData {
  /** S3 command to execute */
  command: S3Command;
  /** Parameters for the S3 command (varies by command) */
  params: Record<string, unknown>;
  /** Optional timeout in milliseconds */
  timeoutMs?: number;
}

/**
 * Payload for invoking an S3 storage resource
 * Uses embedded structure for direct Go unmarshaling
 */
export interface StorageS3Payload {
  type: "storage";
  subtype: "s3";
  /** Embedded S3 payload */
  s3: S3InvokeData;
}

/**
 * Standard S3 command result
 */
export interface StorageS3ResultStandard {
  kind: "storage";
  command: string;
  /** Raw AWS SDK response data */
  data: unknown;
}

/**
 * Presigned URL result (for GeneratePresignedUrl command)
 */
export interface StorageS3ResultPresigned {
  kind: "storage";
  /** The generated presigned URL */
  presignedUrl: string;
  /** ISO 8601 timestamp when the URL expires */
  expiresAt: string;
}

/**
 * Result from an S3 storage operation
 */
export type StorageS3Result = StorageS3ResultStandard | StorageS3ResultPresigned;
