/**
 * HTTP methods supported by API resources
 */
export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

/**
 * Query parameters for HTTP requests
 * Values can be single strings or arrays of strings
 */
export type QueryParams = Record<string, string | string[]>;

/**
 * JSON body payload
 */
export interface JsonBody {
  type: "json";
  value: unknown;
}

/**
 * Plain text body payload
 */
export interface TextBody {
  type: "text";
  value: string;
}

/**
 * Binary/bytes body payload (base64 encoded)
 */
export interface BytesBody {
  type: "bytes";
  base64: string;
  contentType: string;
}

/**
 * Discriminated union of all body payload types
 */
export type BodyPayload = JsonBody | TextBody | BytesBody;

/**
 * API result body - JSON response
 */
export interface ApiResultBodyJson {
  kind: "json";
  value: unknown;
}

/**
 * API result body - text response
 */
export interface ApiResultBodyText {
  kind: "text";
  value: string;
}

/**
 * API result body - binary response (base64 encoded)
 */
export interface ApiResultBodyBytes {
  kind: "bytes";
  base64: string;
  contentType: string;
}

/**
 * Complete API result with status and body
 */
export interface ApiResult {
  kind: "api";
  status: number;
  body: ApiResultBodyJson | ApiResultBodyText | ApiResultBodyBytes;
}

