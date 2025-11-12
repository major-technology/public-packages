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
 * Payload for invoking an S3 storage resource
 */
export interface StorageS3Payload {
  type: "storage";
  subtype: "s3";
  /** S3 command to execute */
  command: S3Command;
  /** Parameters for the S3 command (varies by command) */
  params: Record<string, unknown>;
  /** Optional timeout in milliseconds */
  timeoutMs?: number;
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

