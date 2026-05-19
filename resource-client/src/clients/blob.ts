import type {
  BlobCommand,
  StorageBlobInvokeResponse,
} from "../schemas";
import { buildBlobInvokePayload } from "../payload-builders/blob";
import { BaseResourceClient } from "../base";

/**
 * Body input accepted by `put`. Strings are encoded as UTF-8.
 */
export type BlobBody = Uint8Array | ArrayBuffer | string;

/**
 * Maximum raw byte size accepted by the inline `put` and returned by the
 * inline `get`. Larger objects must use `getUploadUrl` / `getDownloadUrl`
 * and a direct PUT/GET against the returned URL.
 *
 * Mirrors the server-side `BlobInlineMaxBytes` constant. Picked to fit
 * under common serverless body ceilings once base64 + JSON envelope is
 * added.
 */
export const BLOB_INLINE_MAX_BYTES = 5 * 1024 * 1024;

function bodyByteLength(input: BlobBody): number {
  if (typeof input === "string") {
    return new TextEncoder().encode(input).length;
  }

  if (input instanceof ArrayBuffer) {
    return input.byteLength;
  }

  return input.byteLength;
}

/**
 * Cross-runtime base64 encoder. Works in Node (Buffer), browsers (btoa),
 * and edge runtimes that expose either.
 */
interface NodeBufferLike {
  from(input: ArrayBufferLike | Uint8Array | string, encoding?: string): { toString(encoding: string): string };
}

function getBuffer(): NodeBufferLike | undefined {
  const buf = (globalThis as { Buffer?: NodeBufferLike }).Buffer;

  return typeof buf === "function" ? buf : undefined;
}

function toBase64(input: BlobBody): string {
  const Buf = getBuffer();

  if (typeof input === "string") {
    if (Buf) {
      return Buf.from(input, "utf-8").toString("base64");
    }

    if (typeof btoa !== "undefined") {
      return btoa(unescape(encodeURIComponent(input)));
    }

    throw new Error("No base64 encoder available in this runtime");
  }

  const bytes = input instanceof ArrayBuffer ? new Uint8Array(input) : input;

  if (Buf) {
    return Buf.from(bytes).toString("base64");
  }

  if (typeof btoa !== "undefined") {
    let s = "";
    const chunk = 0x8000;

    for (let i = 0; i < bytes.length; i += chunk) {
      s += String.fromCharCode.apply(null, Array.from(bytes.subarray(i, i + chunk)));
    }

    return btoa(s);
  }

  throw new Error("No base64 encoder available in this runtime");
}

/**
 * Client for Major-managed blob storage resources.
 *
 * Customers see a flat key namespace (`user/avatar.png`); the underlying
 * bucket and per-tenant prefix are handled by Major and never exposed.
 *
 * For small objects, use `put` / `get` for inline JSON-encoded transfer.
 * For larger content, use `getUploadUrl` / `getDownloadUrl` and have the
 * client upload/download directly to S3 via the returned presigned URL.
 */
export class BlobResourceClient extends BaseResourceClient {
  /**
   * Generic invoke escape hatch. Prefer the typed methods below.
   */
  invoke(
    command: BlobCommand,
    key: string,
    params: Record<string, unknown>,
    invocationKey: string,
    options: { timeoutMs?: number } = {}
  ): Promise<StorageBlobInvokeResponse> {
    const payload = buildBlobInvokePayload(command, key, params, options);

    return this.invokeRaw(payload, invocationKey) as Promise<StorageBlobInvokeResponse>;
  }

  /**
   * Read a blob by key.
   */
  get(key: string, invocationKey: string, options: { timeoutMs?: number } = {}): Promise<StorageBlobInvokeResponse> {
    return this.invoke("Get", key, {}, invocationKey, options);
  }

  /**
   * Write a blob.
   *
   * For small objects (config, JSON, modest assets). Body is base64-encoded
   * in the JSON envelope, so the practical ceiling is around a few MB. For
   * larger content use `getUploadUrl` + a direct PUT.
   */
  put(
    key: string,
    body: BlobBody,
    invocationKey: string,
    options: {
      contentType?: string;
      cacheControl?: string;
      contentDisposition?: string;
      timeoutMs?: number;
    } = {}
  ): Promise<StorageBlobInvokeResponse> {
    const len = bodyByteLength(body);

    if (len > BLOB_INLINE_MAX_BYTES) {
      throw new Error(
        `blob.put body too large: ${len} bytes (max ${BLOB_INLINE_MAX_BYTES}). Use blob.getUploadUrl() and PUT directly to the returned URL for larger objects.`
      );
    }

    const params: Record<string, unknown> = {
      body: toBase64(body),
    };

    if (options.contentType) {
      params.contentType = options.contentType;
    }

    if (options.cacheControl) {
      params.cacheControl = options.cacheControl;
    }

    if (options.contentDisposition) {
      params.contentDisposition = options.contentDisposition;
    }

    return this.invoke("Put", key, params, invocationKey, { timeoutMs: options.timeoutMs });
  }

  /**
   * List blobs under a prefix.
   *
   * Pass an empty prefix to list everything in this resource's namespace.
   * Use `delimiter: "/"` for hierarchical listings (returns CommonPrefixes
   * for "subdirectories"). Pagination via `continuationToken` from the
   * previous response.
   */
  list(
    prefix: string,
    invocationKey: string,
    options: {
      delimiter?: string;
      maxKeys?: number;
      continuationToken?: string;
      timeoutMs?: number;
    } = {}
  ): Promise<StorageBlobInvokeResponse> {
    const params: Record<string, unknown> = {};

    if (options.delimiter) {
      params.delimiter = options.delimiter;
    }

    if (options.maxKeys !== undefined) {
      params.maxKeys = options.maxKeys;
    }

    if (options.continuationToken) {
      params.continuationToken = options.continuationToken;
    }

    return this.invoke("List", prefix, params, invocationKey, { timeoutMs: options.timeoutMs });
  }

  /**
   * Delete a blob.
   */
  del(key: string, invocationKey: string, options: { timeoutMs?: number } = {}): Promise<StorageBlobInvokeResponse> {
    return this.invoke("Del", key, {}, invocationKey, options);
  }

  /**
   * Get a presigned URL the caller can PUT to directly. Use for large
   * uploads to avoid base64-in-JSON overhead.
   *
   * Default expiration is 15 minutes; capped server-side at 1 hour.
   */
  getUploadUrl(
    key: string,
    invocationKey: string,
    options: {
      contentType?: string;
      expiresInSeconds?: number;
      timeoutMs?: number;
    } = {}
  ): Promise<StorageBlobInvokeResponse> {
    const params: Record<string, unknown> = {};

    if (options.contentType) {
      params.contentType = options.contentType;
    }

    if (options.expiresInSeconds !== undefined) {
      params.expiresInSeconds = options.expiresInSeconds;
    }

    return this.invoke("GetUploadUrl", key, params, invocationKey, { timeoutMs: options.timeoutMs });
  }

  /**
   * Get a presigned URL the caller can GET from directly. Use for large
   * downloads, public sharing windows, or browser-direct streaming.
   *
   * Default expiration is 1 hour; capped server-side at 7 days.
   */
  getDownloadUrl(
    key: string,
    invocationKey: string,
    options: {
      expiresInSeconds?: number;
      timeoutMs?: number;
    } = {}
  ): Promise<StorageBlobInvokeResponse> {
    const params: Record<string, unknown> = {};

    if (options.expiresInSeconds !== undefined) {
      params.expiresInSeconds = options.expiresInSeconds;
    }

    return this.invoke("GetDownloadUrl", key, params, invocationKey, { timeoutMs: options.timeoutMs });
  }

  /**
   * Read a blob's metadata (size, content type, etag, last modified) without
   * downloading the body.
   */
  getMetadata(
    key: string,
    invocationKey: string,
    options: { timeoutMs?: number } = {}
  ): Promise<StorageBlobInvokeResponse> {
    return this.invoke("GetMetadata", key, {}, invocationKey, options);
  }
}
