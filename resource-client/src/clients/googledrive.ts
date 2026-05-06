import type {
  HttpMethod,
  QueryParams,
  ApiInvokeResponse,
} from "../schemas";
import { BaseResourceClient } from "../base";
import { buildGoogleDriveInvokePayload } from "../payload-builders/googledrive";

export class GoogleDriveResourceClient extends BaseResourceClient {
  async invoke(
    method: HttpMethod,
    path: string,
    invocationKey: string,
    options: {
      query?: QueryParams;
      body?: { type: "json"; value: unknown };
      timeoutMs?: number;
    } = {}
  ): Promise<ApiInvokeResponse> {
    const payload = buildGoogleDriveInvokePayload(method, path, options);
    return this.invokeRaw(payload, invocationKey) as Promise<ApiInvokeResponse>;
  }

  /**
   * List/search files in Google Drive.
   * @param invocationKey Unique key for tracking this invocation
   * @param options Search and pagination options
   */
  async listFiles(
    invocationKey: string,
    options: {
      query?: string;
      maxResults?: number;
      pageToken?: string;
      fields?: string;
    } = {}
  ): Promise<ApiInvokeResponse> {
    const query: QueryParams = {};

    if (options.query) {
      query.q = options.query;
    }

    if (options.maxResults) {
      query.pageSize = String(options.maxResults);
    }

    if (options.pageToken) {
      query.pageToken = options.pageToken;
    }

    if (options.fields) {
      query.fields = options.fields;
    } else {
      query.fields = "files(id,name,mimeType,modifiedTime,size,parents),nextPageToken";
    }

    return this.invoke("GET", "files", invocationKey, { query });
  }

  /**
   * Get file metadata by ID.
   * @param fileId The file ID
   * @param invocationKey Unique key for tracking this invocation
   * @param fields Fields to include (default: all)
   */
  async getFile(
    fileId: string,
    invocationKey: string,
    fields: string = "*"
  ): Promise<ApiInvokeResponse> {
    return this.invoke("GET", `files/${fileId}`, invocationKey, {
      query: { fields },
    });
  }

  /**
   * Export a Google Workspace document to a specified MIME type.
   * @param fileId The file ID to export
   * @param invocationKey Unique key for tracking this invocation
   * @param mimeType Export MIME type (default: "text/plain")
   */
  async getFileContent(
    fileId: string,
    invocationKey: string,
    mimeType: string = "text/plain"
  ): Promise<ApiInvokeResponse> {
    return this.invoke("GET", `files/${fileId}/export`, invocationKey, {
      query: { mimeType },
    });
  }

  /**
   * List shared drives.
   * @param invocationKey Unique key for tracking this invocation
   */
  async listSharedDrives(invocationKey: string): Promise<ApiInvokeResponse> {
    return this.invoke("GET", "drives", invocationKey);
  }
}
