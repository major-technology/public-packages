/**
 * Generate a simple fingerprint for client-side deduplication.
 * The server generates its own authoritative fingerprint via SHA-256.
 */
export function clientFingerprint(message: string, stack?: string): string {
  const frame = extractFirstFrame(stack);
  return `${message}::${frame}`;
}

function extractFirstFrame(stack?: string): string {
  if (!stack) {
    return "";
  }

  const lines = stack.split("\n");

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      continue;
    }

    // Skip the error message line
    if (
      !trimmed.includes("at ") &&
      !trimmed.startsWith("at ") &&
      !trimmed.includes("@") &&
      !trimmed.includes("(")
    ) {
      continue;
    }

    // Skip framework/library frames
    if (
      trimmed.includes("node_modules") ||
      trimmed.includes("webpack") ||
      trimmed.includes("error-reporter") ||
      trimmed.includes("<anonymous>")
    ) {
      continue;
    }

    return trimmed;
  }

  return lines[0]?.trim() ?? "";
}
