import type { ApiSlackPayload } from "../schemas";

/**
 * Build a Slack invoke payload
 * @param method Slack API method (e.g., "chat.postMessage")
 * @param options Additional options
 */
export function buildSlackInvokePayload(
  method: string,
  options?: {
    body?: Record<string, unknown>;
    timeoutMs?: number;
  }
): ApiSlackPayload {
  return {
    type: "api",
    subtype: "slack",
    method,
    body: options?.body,
    timeoutMs: options?.timeoutMs ?? 30000,
  };
}

export function buildSlackGetUploadURLPayload(
  filename: string,
  length: number,
  options?: { altText?: string; snippetType?: string }
): ApiSlackPayload {
  return buildSlackInvokePayload("files.getUploadURLExternal", {
    body: {
      filename,
      length,
      alt_txt: options?.altText,
      snippet_type: options?.snippetType,
    },
  });
}

export function buildSlackCompleteUploadPayload(
  files: Array<{ id: string; title?: string }>,
  channelId: string,
  options?: { initialComment?: string; threadTs?: string }
): ApiSlackPayload {
  return buildSlackInvokePayload("files.completeUploadExternal", {
    body: {
      files,
      channel_id: channelId,
      initial_comment: options?.initialComment,
      thread_ts: options?.threadTs,
    },
  });
}
