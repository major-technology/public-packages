import type { ApiDynamicsPayload, HttpMethod, QueryParams, JsonBody } from "../schemas";

/**
 * Build a generic Dynamics (Dataverse Web API) invoke payload.
 *
 * @param method - HTTP method to use
 * @param path - Dataverse API path (e.g. "accounts", "contacts(guid)")
 * @param options - Optional query params, body, and timeout
 */
export function buildDynamicsInvokePayload(
  method: HttpMethod,
  path: string,
  options?: {
    query?: QueryParams;
    body?: JsonBody;
    timeoutMs?: number;
  }
): ApiDynamicsPayload {
  return {
    type: "api",
    subtype: "dynamics",
    method,
    path,
    query: options?.query,
    body: options?.body,
    timeoutMs: options?.timeoutMs ?? 30000,
  };
}

/**
 * Build a Dynamics listEntities payload.
 * Lists entity definitions from the Dataverse metadata endpoint.
 *
 * @param options - Optional timeout
 */
export function buildDynamicsListEntitiesPayload(
  options?: { timeoutMs?: number }
): ApiDynamicsPayload {
  return buildDynamicsInvokePayload("GET", "EntityDefinitions", {
    query: { "$select": ["LogicalName,DisplayName,EntitySetName"] },
    timeoutMs: options?.timeoutMs,
  });
}

/**
 * Build a Dynamics getRecords payload.
 * Retrieves multiple records from an entity set with optional OData query options.
 *
 * @param entitySet - Entity set name (e.g. "accounts", "contacts")
 * @param options - OData query options and timeout
 */
export function buildDynamicsGetRecordsPayload(
  entitySet: string,
  options?: {
    select?: string;
    filter?: string;
    orderBy?: string;
    top?: number;
    expand?: string;
    timeoutMs?: number;
  }
): ApiDynamicsPayload {
  const query: QueryParams = {};

  if (options?.select) {
    query["$select"] = [options.select];
  }

  if (options?.filter) {
    query["$filter"] = [options.filter];
  }

  if (options?.orderBy) {
    query["$orderby"] = [options.orderBy];
  }

  if (options?.top !== undefined) {
    query["$top"] = [String(options.top)];
  }

  if (options?.expand) {
    query["$expand"] = [options.expand];
  }

  return buildDynamicsInvokePayload("GET", entitySet, {
    query: Object.keys(query).length > 0 ? query : undefined,
    timeoutMs: options?.timeoutMs,
  });
}

/**
 * Build a Dynamics getRecord payload.
 * Retrieves a single record by its GUID.
 *
 * @param entitySet - Entity set name (e.g. "accounts", "contacts")
 * @param recordId - The GUID of the record
 * @param options - Optional select/expand fields and timeout
 */
export function buildDynamicsGetRecordPayload(
  entitySet: string,
  recordId: string,
  options?: {
    select?: string;
    expand?: string;
    timeoutMs?: number;
  }
): ApiDynamicsPayload {
  const query: QueryParams = {};

  if (options?.select) {
    query["$select"] = [options.select];
  }

  if (options?.expand) {
    query["$expand"] = [options.expand];
  }

  return buildDynamicsInvokePayload("GET", `${entitySet}(${recordId})`, {
    query: Object.keys(query).length > 0 ? query : undefined,
    timeoutMs: options?.timeoutMs,
  });
}
