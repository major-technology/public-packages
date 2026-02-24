"use client";

import { useState, useEffect, useEffectEvent, useCallback, useRef } from "react";
import { useEffectOnce } from "./use-effect-once";
import { useLatestValue } from "./use-latest-value";
import type { SortingState, ColumnFiltersState, PaginationState, OnChangeFn } from "@tanstack/react-table";
import { DEFAULT_PAGE_SIZE } from "../constants";
import type { DataTableLoadRowsFn, PaginatedResponse } from "../types";

const NETWORK_ERROR_CODE = "NETWORK_ERROR";
const NETWORK_ERROR_MESSAGE = "Failed to fetch data";

export interface AutoModeState<TData> {
	/** Whether auto mode is active (onLoadRows was provided) */
	isActive: boolean;

	// Data
	data: TData[];
	isLoading: boolean;
	error: { code: string; message: string } | null;
	retry: () => void;

	// Data mutations
	reloadPage: () => void;
	updateRow: (rowId: string, updater: (row: TData) => TData) => void;
	removeRow: (rowId: string) => void;

	// Infinite scroll
	loadNextPage: () => Promise<boolean>;
	hasMore: boolean;

	// Row count for TanStack manualPagination
	totalCount: number;

	// TanStack-compatible state + handlers
	sorting: SortingState;
	onSortingChange: OnChangeFn<SortingState>;
	columnFilters: ColumnFiltersState;
	onColumnFiltersChange: OnChangeFn<ColumnFiltersState>;
	globalFilter: string;
	onGlobalFilterChange: OnChangeFn<string>;
	pagination: PaginationState;
	onPaginationChange: OnChangeFn<PaginationState>;
}

/**
 * Encapsulates all auto-mode data loading logic.
 *
 * Always call this hook (React rules of hooks). When `onLoadRows` is undefined,
 * the hook is inert — all state stays at defaults and effects are skipped.
 *
 * When `initialData` is provided, the first render uses it immediately
 * without a loading state and the initial fetch is skipped. Subsequent
 * interactions (page change, sort, filter) trigger `onLoadRows` as normal.
 */
export function useAutoModeLoader<TData>(
	onLoadRows: DataTableLoadRowsFn<TData> | undefined,
	pageSize: number | undefined,
	initialData: PaginatedResponse<TData> | undefined,
	onError: ((error: { code: string; message: string }) => void) | undefined,
	getRowId: ((row: TData) => string) | undefined,
): AutoModeState<TData> {
	const isActive = onLoadRows !== undefined;
	const effectivePageSize = pageSize ?? DEFAULT_PAGE_SIZE;

	const [data, setData] = useState<TData[]>(initialData?.items ?? []);
	const [isLoading, setIsLoading] = useState(isActive && !initialData);
	const [totalCount, setTotalCount] = useState(initialData?.totalCount ?? 0);
	const [totalPages, setTotalPages] = useState(initialData?.totalPages ?? 1);
	const [currentPage, setCurrentPage] = useState(initialData?.page ?? 0);
	const [error, setError] = useState<{ code: string; message: string } | null>(null);
	const [retryCounter, setRetryCounter] = useState(0);
	const loadingNextRef = useRef(false);

	const initialDataConsumedRef = useRef(false);

	const [sorting, setSorting] = useState<SortingState>([]);
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
	const [globalFilter, setGlobalFilter] = useState<string>("");
	const [pagination, setPagination] = useState<PaginationState>({
		pageIndex: 0,
		pageSize: effectivePageSize,
	});

	const onSortingChange = useCallback<OnChangeFn<SortingState>>((updater) => {
		setSorting(updater);
		setPagination((prev) => ({ ...prev, pageIndex: 0 }));
	}, []);

	const onColumnFiltersChange = useCallback<OnChangeFn<ColumnFiltersState>>((updater) => {
		setColumnFilters(updater);
		setPagination((prev) => ({ ...prev, pageIndex: 0 }));
	}, []);

	const onGlobalFilterChange = useCallback<OnChangeFn<string>>((updater) => {
		setGlobalFilter(updater);
		setPagination((prev) => ({ ...prev, pageIndex: 0 }));
	}, []);

	const onPaginationChange = useCallback<OnChangeFn<PaginationState>>((updater) => {
		setPagination((prev) => {
			const next = typeof updater === "function" ? updater(prev) : updater;

			// Reset to page 0 when page size changes
			if (next.pageSize !== prev.pageSize) {
				return { ...next, pageIndex: 0 };
			}

			return next;
		});
	}, []);

	const executeLoad = useEffectEvent(async (signal: AbortSignal) => {
		if (!onLoadRows) {
			return;
		}

		setIsLoading(true);

		try {
			const response = await onLoadRows({
				page: pagination.pageIndex,
				pageSize: pagination.pageSize,
				sorting,
				columnFilters,
				globalFilter,
			});

			if (signal.aborted) {
				return;
			}

			if (!response.success) {
				setError(response.error);
				onError?.(response.error);
				setIsLoading(false);
				return;
			}

			setError(null);
			setData(response.items);
			setTotalCount(response.totalCount);
			setTotalPages(response.totalPages);
			setCurrentPage(response.page);
		} catch {
			if (!signal.aborted) {
				const err = { code: NETWORK_ERROR_CODE, message: NETWORK_ERROR_MESSAGE };
				setError(err);
				onError?.(err);
			}
		} finally {
			if (!signal.aborted) {
				setIsLoading(false);
			}
		}
	});

	useEffect(() => {
		if (!isActive) {
			return;
		}

		// Skip the first load when initialData was provided
		if (initialData && !initialDataConsumedRef.current) {
			initialDataConsumedRef.current = true;
			return;
		}

		const controller = new AbortController();
		void executeLoad(controller.signal);

		return () => {
			controller.abort();
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isActive, sorting, columnFilters, globalFilter, pagination, retryCounter]);

	// Refs to capture current state for loadNextPage without re-creating the callback
	const stateRef = useLatestValue({
		currentPage,
		pagination,
		sorting,
		columnFilters,
		globalFilter,
		onLoadRows,
		onError,
	});
	const nextPageAbortRef = useRef<AbortController | null>(null);

	// Abort any in-flight loadNextPage request on unmount
	useEffectOnce(() => {
		return () => {
			nextPageAbortRef.current?.abort();
		};
	});

	const loadNextPage = useCallback(async (): Promise<boolean> => {
		const { onLoadRows: loader, onError: errHandler, ...state } = stateRef.current;

		if (!loader || loadingNextRef.current) {
			return false;
		}

		loadingNextRef.current = true;
		nextPageAbortRef.current?.abort();
		const controller = new AbortController();
		nextPageAbortRef.current = controller;
		const nextPage = state.currentPage + 1;

		try {
			const response = await loader({
				page: nextPage,
				pageSize: state.pagination.pageSize,
				sorting: state.sorting,
				columnFilters: state.columnFilters,
				globalFilter: state.globalFilter,
			});

			if (controller.signal.aborted) {
				return false;
			}

			if (!response.success) {
				setError(response.error);
				errHandler?.(response.error);
				return false;
			}

			setError(null);
			setData((prev) => [...prev, ...response.items]);
			setTotalCount(response.totalCount);
			setTotalPages(response.totalPages);
			setCurrentPage(response.page);
			return true;
		} catch {
			if (controller.signal.aborted) {
				return false;
			}

			const err = { code: NETWORK_ERROR_CODE, message: NETWORK_ERROR_MESSAGE };
			setError(err);
			errHandler?.(err);
			return false;
		} finally {
			loadingNextRef.current = false;
		}
	}, [stateRef]);

	const hasMore = isActive && currentPage + 1 < totalPages;

	const reloadPage = useCallback(() => {
		setRetryCounter((c) => c + 1);
	}, []);

	const retry = reloadPage;

	const getRowIdRef = useLatestValue(getRowId);

	const updateRow = useCallback(
		(rowId: string, updater: (row: TData) => TData) => {
			const rowIdFn = getRowIdRef.current;

			if (!rowIdFn) {
				return;
			}

			setData((prev) => prev.map((row) => (rowIdFn(row) === rowId ? updater(row) : row)));
		},
		[getRowIdRef],
	);

	const removeRow = useCallback(
		(rowId: string) => {
			const rowIdFn = getRowIdRef.current;

			if (!rowIdFn) {
				return;
			}

			setData((prev) => prev.filter((row) => rowIdFn(row) !== rowId));
			setTotalCount((prev) => {
				const next = Math.max(0, prev - 1);
				setTotalPages(Math.max(1, Math.ceil(next / (stateRef.current.pagination.pageSize || effectivePageSize))));
				return next;
			});
		},
		[getRowIdRef, stateRef, effectivePageSize],
	);

	return {
		isActive,
		data,
		isLoading,
		error,
		retry,
		reloadPage,
		updateRow,
		removeRow,
		loadNextPage,
		hasMore,
		totalCount,
		sorting,
		onSortingChange,
		columnFilters,
		onColumnFiltersChange,
		globalFilter,
		onGlobalFilterChange,
		pagination,
		onPaginationChange,
	};
}
