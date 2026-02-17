import type { AuthInvokeResponse } from "../schemas";
import { BaseResourceClient } from "../base";
import { buildAuthShareAccessPayload, buildAuthRevokeAccessPayload } from "../payload-builders/auth";

export class MajorAuthResourceClient extends BaseResourceClient {
  /**
   * Grant a user view access to this application by email.
   * If the user doesn't have an account, one will be created.
   * If the user isn't a member of the organization, they will be invited.
   */
  async shareAccess(
    email: string,
    invocationKey: string,
  ): Promise<AuthInvokeResponse> {
    const payload = buildAuthShareAccessPayload(email);
    return this.invokeRaw(payload, invocationKey) as Promise<AuthInvokeResponse>;
  }

  /**
   * Revoke a user's view access to this application by email.
   * Only removes app-level access; does not affect org membership or roles.
   */
  async revokeAccess(
    email: string,
    invocationKey: string,
  ): Promise<AuthInvokeResponse> {
    const payload = buildAuthRevokeAccessPayload(email);
    return this.invokeRaw(payload, invocationKey) as Promise<AuthInvokeResponse>;
  }
}
