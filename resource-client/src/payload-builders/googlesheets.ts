import type { ApiGoogleSheetsPayload, HttpMethod, QueryParams, JsonBody } from "../schemas";

/**
 * Build a Google Sheets invoke payload
 * @param method HTTP method to use
 * @param path Google Sheets API path relative to the spreadsheet
 * @param options Additional options
 */
export function buildGoogleSheetsInvokePayload(
  method: HttpMethod,
  path: string,
  options?: {
    query?: QueryParams;
    body?: JsonBody;
    timeoutMs?: number;
  }
): ApiGoogleSheetsPayload {
  return {
    type: "api",
    subtype: "googlesheets",
    method,
    path,
    query: options?.query,
    body: options?.body,
    timeoutMs: options?.timeoutMs ?? 30000,
  };
}

/**
 * Build a Google Sheets getValues payload
 * @param range A1 notation range (e.g., "Sheet1!A1:D5")
 * @param options Additional options
 */
export function buildGoogleSheetsGetValuesPayload(
  range: string,
  options?: { timeoutMs?: number }
): ApiGoogleSheetsPayload {
  return buildGoogleSheetsInvokePayload("GET", `/values/${range}`, {
    timeoutMs: options?.timeoutMs,
  });
}

/**
 * Build a Google Sheets updateValues payload
 * @param range A1 notation range (e.g., "Sheet1!A1:D5")
 * @param values 2D array of values to write
 * @param valueInputOption How to interpret input values ("RAW" or "USER_ENTERED")
 * @param options Additional options
 */
export function buildGoogleSheetsUpdateValuesPayload(
  range: string,
  values: unknown[][],
  valueInputOption: "RAW" | "USER_ENTERED" = "USER_ENTERED",
  options?: { timeoutMs?: number }
): ApiGoogleSheetsPayload {
  return buildGoogleSheetsInvokePayload("PUT", `/values/${range}`, {
    query: { valueInputOption: [valueInputOption] },
    body: { type: "json", value: { values } },
    timeoutMs: options?.timeoutMs,
  });
}

/**
 * Build a Google Sheets appendValues payload
 * @param range A1 notation range (e.g., "Sheet1!A1:D1")
 * @param values 2D array of values to append
 * @param valueInputOption How to interpret input values ("RAW" or "USER_ENTERED")
 * @param options Additional options
 */
export function buildGoogleSheetsAppendValuesPayload(
  range: string,
  values: unknown[][],
  valueInputOption: "RAW" | "USER_ENTERED" = "USER_ENTERED",
  options?: { timeoutMs?: number }
): ApiGoogleSheetsPayload {
  return buildGoogleSheetsInvokePayload("POST", `/values/${range}:append`, {
    query: { valueInputOption: [valueInputOption] },
    body: { type: "json", value: { values } },
    timeoutMs: options?.timeoutMs,
  });
}

/**
 * Build a Google Sheets clearValues payload
 * @param range A1 notation range (e.g., "Sheet1!A1:D5")
 * @param options Additional options
 */
export function buildGoogleSheetsClearValuesPayload(
  range: string,
  options?: { timeoutMs?: number }
): ApiGoogleSheetsPayload {
  return buildGoogleSheetsInvokePayload("POST", `/values/${range}:clear`, {
    timeoutMs: options?.timeoutMs,
  });
}

/**
 * Build a Google Sheets batchGetValues payload
 * @param ranges Array of A1 notation ranges
 * @param options Additional options
 */
export function buildGoogleSheetsBatchGetValuesPayload(
  ranges: string[],
  options?: { timeoutMs?: number }
): ApiGoogleSheetsPayload {
  return buildGoogleSheetsInvokePayload("GET", "/values:batchGet", {
    query: { ranges },
    timeoutMs: options?.timeoutMs,
  });
}

/**
 * Build a Google Sheets batchUpdateValues payload
 * @param data Array of range updates
 * @param valueInputOption How to interpret input values ("RAW" or "USER_ENTERED")
 * @param options Additional options
 */
export function buildGoogleSheetsBatchUpdateValuesPayload(
  data: Array<{ range: string; values: unknown[][] }>,
  valueInputOption: "RAW" | "USER_ENTERED" = "USER_ENTERED",
  options?: { timeoutMs?: number }
): ApiGoogleSheetsPayload {
  return buildGoogleSheetsInvokePayload("POST", "/values:batchUpdate", {
    body: {
      type: "json",
      value: {
        valueInputOption,
        data,
      },
    },
    timeoutMs: options?.timeoutMs,
  });
}

/**
 * Build a Google Sheets getSpreadsheet payload
 * @param options Additional options
 */
export function buildGoogleSheetsGetSpreadsheetPayload(
  options?: { timeoutMs?: number }
): ApiGoogleSheetsPayload {
  return buildGoogleSheetsInvokePayload("GET", "/", {
    timeoutMs: options?.timeoutMs,
  });
}

/**
 * Build a Google Sheets batchUpdate payload (for formatting, creating sheets, etc.)
 * @param requests Array of update requests
 * @param options Additional options
 */
export function buildGoogleSheetsBatchUpdatePayload(
  requests: unknown[],
  options?: { timeoutMs?: number }
): ApiGoogleSheetsPayload {
  return buildGoogleSheetsInvokePayload("POST", "/:batchUpdate", {
    body: { type: "json", value: { requests } },
    timeoutMs: options?.timeoutMs,
  });
}
