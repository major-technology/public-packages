"use client";

import { useState, useEffect, useMemo } from "react";
import {
	useReactTable,
	getCoreRowModel,
	getSortedRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getExpandedRowModel,
	type SortingState,
	type ColumnFiltersState,
	type ColumnOrderState,
	type ColumnSizingState,
	type VisibilityState,
	type RowSelectionState,
	type ExpandedState,
	type PaginationState,
} from "@tanstack/react-table";

import { cn } from "../lib/utils";
import { DataTableTableContext, DataTableStateContext } from "./context";
import { DEFAULT_PAGE_SIZE } from "./constants";
import { useAutoModeLoader } from "./hooks/use-auto-mode-loader";
import type { DataTableProps } from "./types";

const COLUMN_RESIZE_MIN_SIZE = 80;
const COLUMN_RESIZE_MODE = "onChange" as const;

export function DataTable<TData>(props: DataTableProps<TData>) {
	const {
		columns,
		getRowId,
		pageSize: pageSizeProp,
		enableMultiSort = false,
		enableColumnReordering = false,
		enableColumnResizing = false,
		className,
		children,
	} = props;

	const auto = useAutoModeLoader<TData>(props.onLoadRows, pageSizeProp, props.initialData, props.onError, getRowId);

	const [internalSorting, setInternalSorting] = useState<SortingState>([]);
	const [internalColumnFilters, setInternalColumnFilters] = useState<ColumnFiltersState>([]);
	const [internalGlobalFilter, setInternalGlobalFilter] = useState<string>("");
	const [internalPagination, setInternalPagination] = useState<PaginationState>({
		pageIndex: 0,
		pageSize: pageSizeProp ?? DEFAULT_PAGE_SIZE,
	});

	const [internalRowSelection, setInternalRowSelection] = useState<RowSelectionState>({});
	const [internalExpanded, setInternalExpanded] = useState<ExpandedState>({});
	const [internalColumnVisibility, setInternalColumnVisibility] = useState<VisibilityState>({});
	const [internalColumnOrder, setInternalColumnOrder] = useState<ColumnOrderState>([]);
	const [internalColumnSizing, setInternalColumnSizing] = useState<ColumnSizingState>({});

	useEffect(() => {
		if (!enableColumnResizing) {
			setInternalColumnSizing({});
		}
	}, [enableColumnResizing]);

	const isControlledSorting = !auto.isActive && props.sorting !== undefined && props.onSortingChange !== undefined;
	const isControlledFiltering =
		!auto.isActive && props.columnFilters !== undefined && props.onColumnFiltersChange !== undefined;
	const isControlledPagination =
		!auto.isActive && props.pagination !== undefined && props.onPaginationChange !== undefined;

	const sorting = auto.isActive ? auto.sorting : isControlledSorting ? props.sorting! : internalSorting;
	const onSortingChange = auto.isActive
		? auto.onSortingChange
		: isControlledSorting
			? props.onSortingChange!
			: setInternalSorting;

	const columnFilters = auto.isActive
		? auto.columnFilters
		: isControlledFiltering
			? props.columnFilters!
			: internalColumnFilters;
	const onColumnFiltersChange = auto.isActive
		? auto.onColumnFiltersChange
		: isControlledFiltering
			? props.onColumnFiltersChange!
			: setInternalColumnFilters;

	const globalFilter = auto.isActive
		? auto.globalFilter
		: props.globalFilter !== undefined
			? props.globalFilter
			: internalGlobalFilter;
	const onGlobalFilterChange = auto.isActive
		? auto.onGlobalFilterChange
		: (props.onGlobalFilterChange ?? setInternalGlobalFilter);

	const isControlledRowSelection = props.rowSelection !== undefined && props.onRowSelectionChange !== undefined;
	const rowSelection = isControlledRowSelection ? props.rowSelection : internalRowSelection;
	const onRowSelectionChange = isControlledRowSelection ? props.onRowSelectionChange : setInternalRowSelection;

	const isControlledExpanded = props.expanded !== undefined && props.onExpandedChange !== undefined;
	const expanded = isControlledExpanded ? props.expanded : internalExpanded;
	const onExpandedChange = isControlledExpanded ? props.onExpandedChange : setInternalExpanded;

	const isControlledColumnVisibility =
		props.columnVisibility !== undefined && props.onColumnVisibilityChange !== undefined;
	const columnVisibility = isControlledColumnVisibility ? props.columnVisibility : internalColumnVisibility;
	const onColumnVisibilityChange = isControlledColumnVisibility
		? props.onColumnVisibilityChange
		: setInternalColumnVisibility;

	const pagination = auto.isActive ? auto.pagination : isControlledPagination ? props.pagination! : internalPagination;
	const onPaginationChange = auto.isActive
		? auto.onPaginationChange
		: isControlledPagination
			? props.onPaginationChange!
			: setInternalPagination;

	const data = auto.isActive ? auto.data : (props.data ?? []);
	const rowCount = auto.isActive ? auto.totalCount : isControlledPagination ? props.rowCount : undefined;
	const isManual = auto.isActive || isControlledSorting || isControlledFiltering || isControlledPagination;

	const table = useReactTable({
		data,
		columns,
		getRowId,
		getCoreRowModel: getCoreRowModel(),
		defaultColumn: enableColumnResizing ? { minSize: COLUMN_RESIZE_MIN_SIZE } : undefined,

		getSortedRowModel: isManual ? undefined : getSortedRowModel(),
		manualSorting: isManual,
		onSortingChange,
		enableMultiSort,

		getFilteredRowModel: isManual ? undefined : getFilteredRowModel(),
		manualFiltering: isManual,
		onColumnFiltersChange,
		onGlobalFilterChange,

		getPaginationRowModel: isManual ? undefined : getPaginationRowModel(),
		manualPagination: isManual,
		onPaginationChange,
		rowCount,

		enableRowSelection: true,
		onRowSelectionChange,

		getExpandedRowModel: getExpandedRowModel(),
		onExpandedChange,

		onColumnVisibilityChange,

		onColumnOrderChange: enableColumnReordering ? setInternalColumnOrder : undefined,

		enableColumnResizing,
		columnResizeMode: enableColumnResizing ? COLUMN_RESIZE_MODE : undefined,
		onColumnSizingChange: enableColumnResizing ? setInternalColumnSizing : undefined,

		state: {
			sorting,
			columnFilters,
			globalFilter,
			rowSelection,
			expanded,
			columnVisibility,
			columnOrder: enableColumnReordering ? internalColumnOrder : undefined,
			columnSizing: internalColumnSizing,
			pagination,
		},
	});

	const isResizingColumn = table.getState().columnSizingInfo.isResizingColumn;

	const tableContextValue = useMemo(
		() => ({ table }),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[
			data,
			columns,
			rowCount,
			sorting,
			columnFilters,
			globalFilter,
			rowSelection,
			expanded,
			columnVisibility,
			internalColumnOrder,
			internalColumnSizing,
			pagination,
			// Track resize interaction state so consumers re-render when resize ends
			isResizingColumn,
		],
	);

	const stateContextValue = useMemo(
		() => ({
			isLoading: auto.isActive ? auto.isLoading : (props.isLoading ?? false),
			loadNextPage: auto.isActive ? auto.loadNextPage : undefined,
			hasMore: auto.hasMore,
			enableColumnReordering,
			enableColumnResizing,
			error: auto.isActive ? auto.error : null,
			retry: auto.retry,
			reloadPage: auto.reloadPage,
			updateRow: auto.updateRow,
			removeRow: auto.removeRow,
		}),
		[
			auto.isLoading,
			auto.loadNextPage,
			auto.hasMore,
			auto.error,
			auto.retry,
			auto.reloadPage,
			auto.updateRow,
			auto.removeRow,
			props.isLoading,
			auto.isActive,
			enableColumnReordering,
			enableColumnResizing,
		],
	);

	return (
		<DataTableTableContext.Provider value={tableContextValue}>
			<DataTableStateContext.Provider value={stateContextValue}>
				<div className={cn("space-y-4", className)}>{children}</div>
			</DataTableStateContext.Provider>
		</DataTableTableContext.Provider>
	);
}
