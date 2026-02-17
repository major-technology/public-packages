import type { AuthPayload } from "../schemas";

/**
 * Build a payload to share (grant) application access for a user by email.
 * @param email Email address of the user to grant access
 */
export function buildAuthShareAccessPayload(email: string): AuthPayload {
  return {
    type: "auth",
    subtype: "majorauth",
    action: "share",
    email,
  };
}

/**
 * Build a payload to revoke application access for a user by email.
 * @param email Email address of the user to revoke access from
 */
export function buildAuthRevokeAccessPayload(email: string): AuthPayload {
  return {
    type: "auth",
    subtype: "majorauth",
    action: "revoke",
    email,
  };
}
