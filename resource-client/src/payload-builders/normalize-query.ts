import type { QueryParams } from "../schemas";

/**
 * Normalize query params so every value is string[].
 * The Go backend expects map[string][]string, but QueryParams allows
 * bare strings (Record<string, string | string[]>). This ensures
 * single strings are wrapped in an array before sending.
 */
export function normalizeQueryParams(
  query: QueryParams | undefined
): Record<string, string[]> | undefined {
  if (!query) {
    return undefined;
  }

  const normalized: Record<string, string[]> = {};

  for (const [key, value] of Object.entries(query)) {
    normalized[key] = Array.isArray(value) ? value : [value];
  }

  return normalized;
}
