import type { ApiInvokeResponse } from "../schemas";
import { BaseResourceClient } from "../base";
import { buildSlackInvokePayload } from "../payload-builders/slack";

export class SlackResourceClient extends BaseResourceClient {
  async invoke(
    method: string,
    invocationKey: string,
    options: {
      body?: Record<string, unknown>;
      timeoutMs?: number;
    } = {}
  ): Promise<ApiInvokeResponse> {
    const payload = buildSlackInvokePayload(method, options);
    return this.invokeRaw(payload, invocationKey) as Promise<ApiInvokeResponse>;
  }

  /**
   * Get a pre-signed upload URL for uploading a file to Slack.
   * Step 1 of the file upload flow.
   * @see https://docs.slack.dev/reference/methods/files.getUploadURLExternal
   */
  async getUploadURL(
    filename: string,
    length: number,
    invocationKey: string,
    options?: {
      altText?: string;
      snippetType?: string;
    }
  ): Promise<ApiInvokeResponse> {
    return this.invoke("files.getUploadURLExternal", invocationKey, {
      body: {
        filename,
        length,
        alt_txt: options?.altText,
        snippet_type: options?.snippetType,
      },
    });
  }

  /**
   * Complete a file upload and optionally share it to a channel.
   * Step 3 of the file upload flow (step 2 is uploading binary data to the URL from getUploadURL).
   * @see https://docs.slack.dev/reference/methods/files.completeUploadExternal
   */
  async completeUpload(
    files: Array<{ id: string; title?: string }>,
    channelId: string,
    invocationKey: string,
    options?: {
      initialComment?: string;
      threadTs?: string;
    }
  ): Promise<ApiInvokeResponse> {
    return this.invoke("files.completeUploadExternal", invocationKey, {
      body: {
        files,
        channel_id: channelId,
        initial_comment: options?.initialComment,
        thread_ts: options?.threadTs,
      },
    });
  }
}
