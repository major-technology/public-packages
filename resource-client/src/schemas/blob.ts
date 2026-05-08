/**
 * Supported managed blob commands for storage resources
 */
export type BlobCommand =
  | "List"
  | "Get"
  | "Put"
  | "Del"
  | "GetUploadUrl"
  | "GetDownloadUrl"
  | "GetMetadata";

/**
 * Payload for invoking a managed blob storage resource
 */
export interface StorageBlobPayload {
  type: "storage";
  subtype: "blob";
  /** Object key to operate on */
  key: string;
  /** Managed blob command to execute */
  command: BlobCommand;
  /** Parameters for the S3 command (varies by command) */
  params: Record<string, unknown>;
  /** Optional timeout in milliseconds */
  timeoutMs?: number;
}

/**
 * Blob storage command result with body in response (for Get command)
 */
export interface StorageBlobResultWithBody {
  kind: "storage";
  command: string;
  /** Raw AWS SDK response data */
  body: unknown;
}

/**
 * Blob storage command result with data in response (for List and GetMetadata commands).
 *
 * For List, `data` is shaped like:
 *   {
 *     objects: { key: string; size?: number; lastModified?: string }[];
 *     commonPrefixes: string[]; // hierarchical "folders" when delimiter is set
 *     isTruncated?: true;
 *     nextContinuationToken?: string;
 *   }
 *
 * For GetMetadata, `data` carries object metadata (size, etag, lastModified, etc.).
 */
export interface StorageBlobResultWithData {
  kind: "storage";
  command: string;
  /** Raw AWS SDK response data */
  data: unknown;
}

/**
 * Presigned URL result (for GetUploadUrl and GetDownloadUrl commands)
 */
export interface StorageBlobResultPresigned {
  kind: "storage";
  command: string;
  /** The generated presigned URL */
  presignedUrl: string;
  /** ISO 8601 timestamp when the URL expires */
  expiresAt: string;
}

/**
 * Result from a managed blob storage operation
 */
export type StorageBlobResult = StorageBlobResultWithBody | StorageBlobResultWithData | StorageBlobResultPresigned;

