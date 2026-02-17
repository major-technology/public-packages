/**
 * Major Auth resource payload and result types
 */

export interface AuthPayload {
  type: "auth";
  subtype: "majorauth";
  action: "share" | "revoke";
  email: string;
}

export interface AuthResult {
  kind: "auth";
  success: boolean;
  message?: string;
}
