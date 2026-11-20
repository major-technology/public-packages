import { headers } from "next/headers";

/**
 * Lifts `x-major-user-jwt` from the current Next.js request headers and returns
 * it as a header bag suitable for `WorkflowsClientConfig.getHeaders`.
 *
 * Returns `{}` when called outside a Next.js request scope (`headers()` throws
 * there) or when the inbound request carried no `x-major-user-jwt`.
 */
export async function defaultGetHeaders(): Promise<Record<string, string>> {
  let userJwt: string | null = null;

  try {
    userJwt = (await headers()).get("x-major-user-jwt");
  } catch {
    return {};
  }

  if (!userJwt) {
    return {};
  }

  return { "x-major-user-jwt": userJwt };
}
