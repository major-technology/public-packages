import type { ReactNode } from "react";
import type {
	ColumnDef,
	ColumnFiltersState,
	ExpandedState,
	PaginationState,
	RowSelectionState,
	SortingState,
	VisibilityState,
	OnChangeFn,
} from "@tanstack/react-table";

import type { FILTER_TYPES, TEXT_FILTER_OPERATORS, NUMBER_FILTER_OPERATORS, DATE_FILTER_OPERATORS } from "./constants";

type ValueOf<T> = T[keyof T];

export interface PropsWithClassName {
	className?: string;
}

export interface DataTableRequestParams {
	page: number;
	pageSize: number;
	sorting: SortingState;
	columnFilters: ColumnFiltersState;
	globalFilter: string;
}

/**
 * Standard paginated API response contract.
 * All server-side paginated endpoints should return this shape.
 */
export interface PaginatedResponse<TData> {
	items: TData[];
	page: number;
	totalPages: number;
	totalCount: number;
}

/**
 * Full response envelope with error handling.
 * onLoadRows must return this shape so the table can handle errors gracefully.
 */
export type DataTableResponse<TData> =
	| ({ success: true } & PaginatedResponse<TData>)
	| { success: false; error: { code: string; message: string } };

/** The promise-returning function the table calls to load row data */
export type DataTableLoadRowsFn<TData> = (params: DataTableRequestParams) => Promise<DataTableResponse<TData>>;

interface DataTableBaseProps<TData> extends PropsWithClassName {
	columns: ColumnDef<TData, unknown>[];
	getRowId?: (row: TData) => string;

	pageSize?: number;

	rowSelection?: RowSelectionState;
	onRowSelectionChange?: OnChangeFn<RowSelectionState>;

	expanded?: ExpandedState;
	onExpandedChange?: OnChangeFn<ExpandedState>;

	columnVisibility?: VisibilityState;
	onColumnVisibilityChange?: OnChangeFn<VisibilityState>;

	enableMultiSort?: boolean;
	enableColumnReordering?: boolean;
	enableColumnResizing?: boolean;

	children: ReactNode;
}

/**
 * Static mode — consumer provides row data directly.
 *
 * Supports both client-side (just `data`) and server-side controlled
 * (pass `sorting + onSortingChange`, `pagination + onPaginationChange`, etc.)
 * patterns. The table infers manual mode from the presence of a controlled state.
 */
export interface DataTableStaticProps<TData> extends DataTableBaseProps<TData> {
	/** Row data to display */
	data: TData[];

	isLoading?: boolean;

	sorting?: SortingState;
	onSortingChange?: OnChangeFn<SortingState>;

	columnFilters?: ColumnFiltersState;
	onColumnFiltersChange?: OnChangeFn<ColumnFiltersState>;

	globalFilter?: string;
	onGlobalFilterChange?: OnChangeFn<string>;

	pagination?: PaginationState;
	onPaginationChange?: OnChangeFn<PaginationState>;

	rowCount?: number;

	// Prevent auto-mode props
	onLoadRows?: never;
	initialData?: never;
	onError?: never;
}

/**
 * Auto mode — table manages the entire data fetching lifecycle.
 *
 * Calls `onLoadRows` whenever sorting, filtering, or pagination changes.
 * Pass `initialData` to render the first page immediately (SSR/RSC)
 * and skip the initial fetch.
 */
export interface DataTableAutoProps<TData> extends DataTableBaseProps<TData> {
	/** Function the table calls to load data */
	onLoadRows: DataTableLoadRowsFn<TData>;

	initialData?: PaginatedResponse<TData>;
	onError?: (error: { code: string; message: string }) => void;

	// Prevent static-mode props (auto mode manages these internally)
	data?: never;
	isLoading?: never;
	sorting?: never;
	onSortingChange?: never;
	columnFilters?: never;
	onColumnFiltersChange?: never;
	globalFilter?: never;
	onGlobalFilterChange?: never;
	pagination?: never;
	onPaginationChange?: never;
	rowCount?: never;
}

export type DataTableProps<TData> = DataTableStaticProps<TData> | DataTableAutoProps<TData>;

export type FilterType = ValueOf<typeof FILTER_TYPES>;

/** Base fields shared by all filter definitions */
interface DataTableFilterDefinitionBase {
	columnId: string;
	title: string;
}

/** Multi-select from a set of predefined values */
export interface DataTableSelectFilterDef extends DataTableFilterDefinitionBase {
	type: typeof FILTER_TYPES.SELECT;
	options: { label: string; value: string }[];
}

/** Free-text "contains" filter */
export interface DataTableTextFilterDef extends DataTableFilterDefinitionBase {
	type: typeof FILTER_TYPES.TEXT;
}

/** Numeric min/max range filter */
export interface DataTableNumberFilterDef extends DataTableFilterDefinitionBase {
	type: typeof FILTER_TYPES.NUMBER;
}

/** Date from/to range filter */
export interface DataTableDateFilterDef extends DataTableFilterDefinitionBase {
	type: typeof FILTER_TYPES.DATE;
}

/** Boolean yes/no filter */
export interface DataTableBooleanFilterDef extends DataTableFilterDefinitionBase {
	type: typeof FILTER_TYPES.BOOLEAN;
}

export type DataTableFilterDefinition =
	| DataTableSelectFilterDef
	| DataTableTextFilterDef
	| DataTableNumberFilterDef
	| DataTableDateFilterDef
	| DataTableBooleanFilterDef;

export type TextFilterOperator = ValueOf<typeof TEXT_FILTER_OPERATORS>;
export type NumberFilterOperator = ValueOf<typeof NUMBER_FILTER_OPERATORS>;
export type DateFilterOperator = ValueOf<typeof DATE_FILTER_OPERATORS>;

export type TextFilterValue = { op: TextFilterOperator; value: string };

type NumberSingleOperator =
	| typeof NUMBER_FILTER_OPERATORS.EQUALS
	| typeof NUMBER_FILTER_OPERATORS.LESS_THAN
	| typeof NUMBER_FILTER_OPERATORS.GREATER_THAN
	| typeof NUMBER_FILTER_OPERATORS.NOT_EQUALS;

/** Number: single-value operators vs range */
export type NumberFilterValue =
	| { op: NumberSingleOperator; value: number; min?: never; max?: never }
	| { op: typeof NUMBER_FILTER_OPERATORS.RANGE; min?: number; max?: number; value?: never };

type DateSingleOperator =
	| typeof DATE_FILTER_OPERATORS.EQUALS
	| typeof DATE_FILTER_OPERATORS.BEFORE
	| typeof DATE_FILTER_OPERATORS.AFTER
	| typeof DATE_FILTER_OPERATORS.NOT_EQUALS;

/** Date: single-value operators vs range */
export type DateFilterValue =
	| { op: DateSingleOperator; value: string; from?: never; to?: never }
	| { op: typeof DATE_FILTER_OPERATORS.RANGE; from?: string; to?: string; value?: never };
