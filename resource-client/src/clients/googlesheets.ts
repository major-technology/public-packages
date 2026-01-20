import type {
  HttpMethod,
  QueryParams,
  JsonBody,
  ApiGoogleSheetsPayload,
} from "../schemas";
import type { ApiInvokeResponse } from "../schemas/response";
import { BaseResourceClient } from "../base";

export class GoogleSheetsResourceClient extends BaseResourceClient {
  /**
   * Make an HTTP request to the Google Sheets API
   * @param method HTTP method
   * @param path Google Sheets API path relative to the spreadsheet
   * @param invocationKey Unique key for tracking this invocation
   * @param options Optional query, body, and timeout
   * @returns Response with nested result: response.result.api
   */
  async invoke(
    method: HttpMethod,
    path: string,
    invocationKey: string,
    options: {
      query?: QueryParams;
      body?: JsonBody;
      timeoutMs?: number;
    } = {}
  ): Promise<ApiInvokeResponse> {
    const payload: ApiGoogleSheetsPayload = {
      type: "api",
      subtype: "googlesheets",
      googlesheets: {
        method,
        path,
        query: options.query,
        body: options.body,
        timeoutMs: options.timeoutMs || 30000,
      },
    };

    return this.invokeRaw(payload, invocationKey) as Promise<ApiInvokeResponse>;
  }

  /**
   * Get values from a range in the spreadsheet
   * @param range A1 notation range (e.g., "Sheet1!A1:D5")
   * @param invocationKey Unique key for tracking this invocation
   */
  async getValues(
    range: string,
    invocationKey: string
  ): Promise<ApiInvokeResponse> {
    return this.invoke("GET", `/values/${range}`, invocationKey);
  }

  /**
   * Update values in a range in the spreadsheet
   * @param range A1 notation range (e.g., "Sheet1!A1:D5")
   * @param values 2D array of values to write
   * @param invocationKey Unique key for tracking this invocation
   * @param valueInputOption How to interpret input values ("RAW" or "USER_ENTERED")
   */
  async updateValues(
    range: string,
    values: unknown[][],
    invocationKey: string,
    valueInputOption: "RAW" | "USER_ENTERED" = "USER_ENTERED"
  ): Promise<ApiInvokeResponse> {
    return this.invoke(
      "PUT",
      `/values/${range}`,
      invocationKey,
      {
        query: { valueInputOption },
        body: { type: "json", value: { values } },
      }
    );
  }

  /**
   * Append values to a sheet
   * @param range A1 notation range (e.g., "Sheet1!A1:D1")
   * @param values 2D array of values to append
   * @param invocationKey Unique key for tracking this invocation
   * @param valueInputOption How to interpret input values ("RAW" or "USER_ENTERED")
   */
  async appendValues(
    range: string,
    values: unknown[][],
    invocationKey: string,
    valueInputOption: "RAW" | "USER_ENTERED" = "USER_ENTERED"
  ): Promise<ApiInvokeResponse> {
    return this.invoke(
      "POST",
      `/values/${range}:append`,
      invocationKey,
      {
        query: { valueInputOption },
        body: { type: "json", value: { values } },
      }
    );
  }

  /**
   * Clear values in a range
   * @param range A1 notation range (e.g., "Sheet1!A1:D5")
   * @param invocationKey Unique key for tracking this invocation
   */
  async clearValues(
    range: string,
    invocationKey: string
  ): Promise<ApiInvokeResponse> {
    return this.invoke("POST", `/values/${range}:clear`, invocationKey);
  }

  /**
   * Batch get multiple ranges
   * @param ranges Array of A1 notation ranges
   * @param invocationKey Unique key for tracking this invocation
   */
  async batchGetValues(
    ranges: string[],
    invocationKey: string
  ): Promise<ApiInvokeResponse> {
    return this.invoke("GET", "/values:batchGet", invocationKey, {
      query: { ranges },
    });
  }

  /**
   * Batch update multiple ranges
   * @param data Array of range updates
   * @param invocationKey Unique key for tracking this invocation
   * @param valueInputOption How to interpret input values ("RAW" or "USER_ENTERED")
   */
  async batchUpdateValues(
    data: Array<{ range: string; values: unknown[][] }>,
    invocationKey: string,
    valueInputOption: "RAW" | "USER_ENTERED" = "USER_ENTERED"
  ): Promise<ApiInvokeResponse> {
    return this.invoke("POST", "/values:batchUpdate", invocationKey, {
      body: {
        type: "json",
        value: {
          valueInputOption,
          data,
        },
      },
    });
  }

  /**
   * Get spreadsheet metadata
   * @param invocationKey Unique key for tracking this invocation
   */
  async getSpreadsheet(invocationKey: string): Promise<ApiInvokeResponse> {
    return this.invoke("GET", "/", invocationKey);
  }

  /**
   * Batch update spreadsheet (for formatting, creating sheets, etc.)
   * @param requests Array of update requests
   * @param invocationKey Unique key for tracking this invocation
   */
  async batchUpdate(
    requests: unknown[],
    invocationKey: string
  ): Promise<ApiInvokeResponse> {
    return this.invoke("POST", "/:batchUpdate", invocationKey, {
      body: { type: "json", value: { requests } },
    });
  }
}
