"use server";

import type { ErrorEvent } from "./types";

function truncate(value: unknown, length: number): string | undefined {
  return typeof value === "string" ? value.slice(0, length) : undefined;
}

function sanitizeError(value: unknown): ErrorEvent | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }

  const input = value as Partial<ErrorEvent>;
  if (typeof input.message !== "string" || !input.message) {
    return null;
  }

  return {
    message: input.message.slice(0, 2_000),
    stack: truncate(input.stack, 10_000),
    source: "client",
    url: truncate(input.url, 2_000),
    userAgent: truncate(input.userAgent, 500),
    timestamp: new Date().toISOString(),
    context: input.context,
  };
}

/** Forward client errors using trusted runtime-only app credentials. */
export async function submitClientErrors(values: unknown): Promise<void> {
  if (!Array.isArray(values)) {
    return;
  }

  const endpoint = process.env.MAJOR_API_BASE_URL;
  const jwtToken = process.env.MAJOR_JWT_TOKEN;
  const applicationId =
    process.env.APPLICATION_ID || process.env.MAJOR_APPLICATION_ID;

  if (!endpoint || !jwtToken || !applicationId) {
    throw new Error("Major error reporting is not configured");
  }

  const errors = values
    .slice(0, 10)
    .map(sanitizeError)
    .filter((error): error is ErrorEvent => error !== null);
  if (errors.length === 0) {
    return;
  }

  const response = await fetch(
    `${endpoint}/internal/apps/v1/${applicationId}/errors`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-major-jwt": jwtToken,
      },
      body: JSON.stringify({ errors }),
    },
  );

  if (!response.ok) {
    throw new Error(`Major error ingestion returned ${response.status}`);
  }
}
