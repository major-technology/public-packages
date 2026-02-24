import type { Row } from "@tanstack/react-table";
import { TEXT_FILTER_OPERATORS, NUMBER_FILTER_OPERATORS, DATE_FILTER_OPERATORS } from "../constants";

function matchesSelect(cellValue: unknown, filterValue: string[]): boolean {
	return filterValue.length === 0 || filterValue.includes(String(cellValue));
}

function matchesNumber(cellValue: unknown, operator: string, filterNumber: number): boolean {
	const cellNumber = cellValue as number;

	switch (operator) {
		case NUMBER_FILTER_OPERATORS.EQUALS:
			return cellNumber === filterNumber;
		case NUMBER_FILTER_OPERATORS.LESS_THAN:
			return cellNumber < filterNumber;
		case NUMBER_FILTER_OPERATORS.GREATER_THAN:
			return cellNumber > filterNumber;
		case NUMBER_FILTER_OPERATORS.NOT_EQUALS:
			return cellNumber !== filterNumber;
		default:
			return true;
	}
}

function matchesNumberRange(cellValue: unknown, min?: number, max?: number): boolean {
	const cellNumber = cellValue as number;

	if (min !== undefined && cellNumber < min) {
		return false;
	}

	return !(max !== undefined && cellNumber > max);
}

function matchesText(cellValue: unknown, operator: string, filterText: string): boolean {
	const cellText = String(cellValue).toLowerCase();
	const searchText = filterText.toLowerCase();

	switch (operator) {
		case TEXT_FILTER_OPERATORS.CONTAINS:
			return cellText.includes(searchText);
		case TEXT_FILTER_OPERATORS.STARTS_WITH:
			return cellText.startsWith(searchText);
		case TEXT_FILTER_OPERATORS.ENDS_WITH:
			return cellText.endsWith(searchText);
		case TEXT_FILTER_OPERATORS.EQUALS:
			return cellText === searchText;
		case TEXT_FILTER_OPERATORS.NOT_EQUALS:
			return cellText !== searchText;
		default:
			return cellText.includes(searchText);
	}
}

function matchesDate(cellValue: unknown, operator: string, filterDate: string): boolean {
	const cellDate = String(cellValue);

	switch (operator) {
		case DATE_FILTER_OPERATORS.EQUALS:
			return cellDate === filterDate;
		case DATE_FILTER_OPERATORS.BEFORE:
			return cellDate < filterDate;
		case DATE_FILTER_OPERATORS.AFTER:
			return cellDate > filterDate;
		case DATE_FILTER_OPERATORS.NOT_EQUALS:
			return cellDate !== filterDate;
		default:
			return true;
	}
}

function matchesDateRange(cellValue: unknown, from?: string, to?: string): boolean {
	const cellDate = String(cellValue);

	if (from && cellDate < from) {
		return false;
	}

	return !(to && cellDate > to);
}

function matchesOperatorValue(cellValue: unknown, operator: string, filterValue: unknown): boolean {
	if (typeof filterValue === "number") {
		return matchesNumber(cellValue, operator, filterValue);
	}

	if (typeof filterValue === "string") {
		if (operator === DATE_FILTER_OPERATORS.BEFORE || operator === DATE_FILTER_OPERATORS.AFTER) {
			return matchesDate(cellValue, operator, filterValue);
		}

		return matchesText(cellValue, operator, filterValue);
	}

	return true;
}

/**
 * Custom filter function for client-side filtering.
 *
 * This function is only called by TanStack Table in client-side mode
 * (static data). In server-side (auto) mode, `manualFiltering: true`
 * disables client-side filtering entirely — the server handles it.
 *
 * However, setting this as the default filterFn is also required for
 * server-side mode: TanStack's auto-detected filterFn for numeric columns
 * (`inNumberRange`) has an `autoRemove` that expects [min, max] tuples.
 * Our {op, value} objects fail that check and get silently stripped from
 * state before ever reaching `onLoadRows`. This function has no `autoRemove`,
 * so filter values are preserved.
 */
export function dataTableFilterFn(row: Row<unknown>, columnId: string, filterValue: unknown): boolean {
	const cellValue = row.getValue(columnId);

	if (Array.isArray(filterValue)) {
		return matchesSelect(cellValue, filterValue);
	}

	if (typeof filterValue === "boolean") {
		return cellValue === filterValue;
	}

	if (typeof filterValue === "object" && filterValue !== null) {
		const typedFilterValue = filterValue as Record<string, unknown>;
		const operator = (typedFilterValue.op as string) ?? "";

		if ("min" in typedFilterValue || "max" in typedFilterValue) {
			return matchesNumberRange(
				cellValue,
				typedFilterValue.min as number | undefined,
				typedFilterValue.max as number | undefined,
			);
		}

		if ("from" in typedFilterValue || "to" in typedFilterValue) {
			return matchesDateRange(
				cellValue,
				typedFilterValue.from as string | undefined,
				typedFilterValue.to as string | undefined,
			);
		}

		if ("value" in typedFilterValue) {
			return matchesOperatorValue(cellValue, operator, typedFilterValue.value);
		}

		return true;
	}

	if (typeof filterValue === "string") {
		return String(cellValue).toLowerCase().includes(filterValue.toLowerCase());
	}

	return true;
}
