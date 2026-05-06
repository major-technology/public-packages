import type {
  HttpMethod,
  QueryParams,
  ApiInvokeResponse,
} from "../schemas";
import { BaseResourceClient } from "../base";
import { buildGmailInvokePayload } from "../payload-builders/gmail";

export class GmailResourceClient extends BaseResourceClient {
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
    const payload = buildGmailInvokePayload(method, path, options);
    return this.invokeRaw(payload, invocationKey) as Promise<ApiInvokeResponse>;
  }

  /**
   * List/search emails.
   * @param invocationKey Unique key for tracking this invocation
   * @param options Search and pagination options
   */
  async listMessages(
    invocationKey: string,
    options: {
      query?: string;
      maxResults?: number;
      pageToken?: string;
    } = {}
  ): Promise<ApiInvokeResponse> {
    const query: QueryParams = {};

    if (options.query) {
      query.q = options.query;
    }

    if (options.maxResults) {
      query.maxResults = String(options.maxResults);
    }

    if (options.pageToken) {
      query.pageToken = options.pageToken;
    }

    return this.invoke("GET", "users/me/messages", invocationKey, { query });
  }

  /**
   * Get a specific email by ID.
   * @param messageId The message ID to retrieve
   * @param invocationKey Unique key for tracking this invocation
   * @param format Response format: "full", "metadata", "minimal", "raw" (default: "full")
   */
  async getMessage(
    messageId: string,
    invocationKey: string,
    format: string = "full"
  ): Promise<ApiInvokeResponse> {
    return this.invoke(
      "GET",
      `users/me/messages/${messageId}`,
      invocationKey,
      { query: { format } }
    );
  }

  /**
   * Send a plain-text email.
   * @param to Recipient email address
   * @param subject Email subject
   * @param body Email body (plain text)
   * @param invocationKey Unique key for tracking this invocation
   * @param options Additional options (cc, bcc)
   */
  async sendMessage(
    to: string,
    subject: string,
    body: string,
    invocationKey: string,
    options: {
      cc?: string;
      bcc?: string;
    } = {}
  ): Promise<ApiInvokeResponse> {
    // Construct MIME message and base64url encode
    let mime = `To: ${to}\r\n`;

    if (options.cc) {
      mime += `Cc: ${options.cc}\r\n`;
    }

    if (options.bcc) {
      mime += `Bcc: ${options.bcc}\r\n`;
    }

    mime += `Subject: ${subject}\r\n`;
    mime += `Content-Type: text/plain; charset="UTF-8"\r\n`;
    mime += `\r\n`;
    mime += body;

    const raw = btoa(mime)
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");

    return this.invoke("POST", "users/me/messages/send", invocationKey, {
      body: { type: "json", value: { raw } },
    });
  }

  /**
   * List all Gmail labels.
   * @param invocationKey Unique key for tracking this invocation
   */
  async listLabels(invocationKey: string): Promise<ApiInvokeResponse> {
    return this.invoke("GET", "users/me/labels", invocationKey);
  }
}
