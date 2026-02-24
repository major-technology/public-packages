import type { DataTableRequestParams } from "../types";

const SEARCH_PARAMS = {
	PAGE: "page",
	PAGE_SIZE: "pageSize",
	SORT_BY: "sortBy",
	SORT_DESC: "sortDesc",
	SEARCH: "search",
	SUFFIX_OP: "_op",
	SUFFIX_MIN: "_min",
	SUFFIX_MAX: "_max",
	SUFFIX_FROM: "_from",
	SUFFIX_TO: "_to",
} as const;

/**
 * Converts DataTableRequestParams to URLSearchParams following the standard
 * query param contract: page, pageSize, sortBy, sortDesc, search, {columnId}.
 *
 * Handles all filter value types:
 * - string[] → `role=admin,editor` (select)
 * - boolean → `verified=true` (boolean)
 * - { op, value } → `name_op=contains&name=john` (text, number single, date single)
 * - { op, min, max } → `score_op=range&score_min=10&score_max=100` (number range)
 * - { op, from, to } → `createdAt_op=range&createdAt_from=...&createdAt_to=...` (date range)
 */
export function buildRequestSearchParams(params: DataTableRequestParams): URLSearchParams {
	const sp = new URLSearchParams({
		[SEARCH_PARAMS.PAGE]: String(params.page),
		[SEARCH_PARAMS.PAGE_SIZE]: String(params.pageSize),
	});

	if (params.sorting[0]) {
		sp.set(SEARCH_PARAMS.SORT_BY, params.sorting[0].id);
		sp.set(SEARCH_PARAMS.SORT_DESC, String(params.sorting[0].desc));
	}

	if (params.globalFilter) {
		sp.set(SEARCH_PARAMS.SEARCH, params.globalFilter);
	}

	for (const filter of params.columnFilters) {
		const value = filter.value;

		if (value === undefined || value === null) {
			continue;
		}

		// Select: string[]
		if (Array.isArray(value)) {
			if (value.length > 0) {
				sp.set(filter.id, value.join(","));
			}

			continue;
		}

		// Boolean
		if (typeof value === "boolean") {
			sp.set(filter.id, String(value));
			continue;
		}

		// Object with operator (text, number, date)
		if (typeof value === "object") {
			const obj = value as Record<string, unknown>;

			if (obj.op) {
				sp.set(`${filter.id}${SEARCH_PARAMS.SUFFIX_OP}`, String(obj.op));
			}

			// Single value (text, number eq/lt/gt/neq, date eq/before/after/neq)
			if (obj.value !== undefined && obj.value !== null && obj.value !== "") {
				sp.set(filter.id, String(obj.value));
			}

			// Number range
			if (obj.min !== undefined && obj.min !== null && obj.min !== "") {
				sp.set(`${filter.id}${SEARCH_PARAMS.SUFFIX_MIN}`, String(obj.min));
			}

			if (obj.max !== undefined && obj.max !== null && obj.max !== "") {
				sp.set(`${filter.id}${SEARCH_PARAMS.SUFFIX_MAX}`, String(obj.max));
			}

			// Date range
			if (obj.from !== undefined && obj.from !== null && obj.from !== "") {
				sp.set(`${filter.id}${SEARCH_PARAMS.SUFFIX_FROM}`, String(obj.from));
			}

			if (obj.to !== undefined && obj.to !== null && obj.to !== "") {
				sp.set(`${filter.id}${SEARCH_PARAMS.SUFFIX_TO}`, String(obj.to));
			}

			continue;
		}

		// Plain string (legacy)
		if (typeof value === "string" && value) {
			sp.set(filter.id, value);
		}
	}

	return sp;
}
