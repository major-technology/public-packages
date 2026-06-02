/**
 * GitHub invoke operation discriminator.
 * The MCP proxy + HTTP proxy cover the GitHub API surface; invoke is for things
 * they can't do (today just minting a downscoped installation token).
 */
export type GitHubOperation = "getGitToken";

/**
 * Payload for invoking a GitHub resource.
 * Matches the backend GitHubInvokePayload in go-common/resourcetypes/github.go.
 */
export interface ApiGitHubPayload {
  type: "api";
  subtype: "github";
  operation: GitHubOperation;

  /**
   * Repo names to scope the token to (empty = all installed repos).
   * Only used by the getGitToken operation.
   */
  repositories?: string[];

  /**
   * Permission subset, e.g. { "contents": "read" } (empty = full granted
   * permissions). Only used by the getGitToken operation.
   */
  permissions?: Record<string, string>;
}

/**
 * Result from a GitHub getGitToken invocation.
 * Matches the backend GitHubTokenResult in go-common/resourcetypes/github.go.
 */
export interface ApiGitHubTokenResult {
  kind: "github_git_token";

  /**
   * The minted installation token (ghs_...). Use as `Authorization: Bearer`.
   * Downscoped tokens are never cached server-side.
   */
  token: string;

  /**
   * Seconds until the token expires.
   */
  expiresIn: number;
}
