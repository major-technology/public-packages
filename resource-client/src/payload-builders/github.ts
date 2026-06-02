import type { ApiGitHubPayload } from "../schemas";

/**
 * Build a GitHub getGitToken payload.
 * Mints an installation token, optionally downscoped to a subset of repos
 * and/or permissions.
 *
 * @param options Optional downscope (repositories and/or permissions)
 */
export function buildGitHubGetGitTokenPayload(options?: {
  repositories?: string[];
  permissions?: Record<string, string>;
}): ApiGitHubPayload {
  return {
    type: "api",
    subtype: "github",
    operation: "getGitToken",
    repositories: options?.repositories,
    permissions: options?.permissions,
  };
}
