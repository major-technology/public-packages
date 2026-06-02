import type { ApiGitHubTokenResult } from "../schemas";
import type { BaseInvokeSuccess, InvokeFailure } from "../schemas/response";
import { BaseResourceClient } from "../base";
import { buildGitHubGetGitTokenPayload } from "../payload-builders/github";

export class GitHubResourceClient extends BaseResourceClient {
  /**
   * Mint a GitHub App installation token for git operations (clone, push, etc.),
   * optionally downscoped to a subset of repos and/or permissions.
   *
   * @param invocationKey - A unique key for tracking this invocation
   * @param options - Optional downscope (repositories and/or permissions)
   * @returns The minted installation token and its TTL in seconds
   *
   * @example
   * ```typescript
   * // Full-scope token for all installed repos
   * const result = await githubClient.getGitToken("clone-repos");
   *
   * if (result.ok) {
   *   const remote = `https://x-access-token:${result.result.token}@github.com/org/repo.git`;
   * }
   *
   * // Downscoped to specific repos with read-only contents
   * const scoped = await githubClient.getGitToken("read-config", {
   *   repositories: ["my-repo"],
   *   permissions: { contents: "read" },
   * });
   * ```
   */
  async getGitToken(
    invocationKey: string,
    options?: {
      repositories?: string[];
      permissions?: Record<string, string>;
    },
  ): Promise<BaseInvokeSuccess<ApiGitHubTokenResult> | InvokeFailure> {
    const payload = buildGitHubGetGitTokenPayload(options);
    return this.invokeRaw(payload, invocationKey) as Promise<
      BaseInvokeSuccess<ApiGitHubTokenResult> | InvokeFailure
    >;
  }
}
