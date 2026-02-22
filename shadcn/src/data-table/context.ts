import { createContext, useContext } from "react";
import type { Table } from "@tanstack/react-table";

const CONTEXT_ERROR = "useDataTable must be used within a <DataTable> provider";

interface DataTableTableContextValue {
	table: {};
}

const DataTableTableContext = createContext<DataTableTableContextValue | null>(null);

export function useDataTable<TData>(): Table<TData> {
	const context = useContext(DataTableTableContext);

	if (!context) {
		throw new Error(CONTEXT_ERROR);
	}

	return context.table as Table<TData>;
}

export interface DataTableStateContextValue {
	isLoading: boolean;
	loadNextPage?: () => Promise<boolean>;
	hasMore: boolean;
	enableColumnReordering: boolean;
	enableColumnResizing: boolean;
	error: { code: string; message: string } | null;
	retry: () => void;
	/** Re-fetch the current page from the server. */
	reloadPage: () => void;
	/** Optimistically update a row by ID. Requires getRowId on DataTable. */
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	updateRow: (rowId: string, updater: (row: any) => any) => void;
	/** Optimistically remove a row by ID. Requires getRowId on DataTable. */
	removeRow: (rowId: string) => void;
}

const DataTableStateContext = createContext<DataTableStateContextValue | null>(null);

export function useDataTableState(): DataTableStateContextValue {
	const context = useContext(DataTableStateContext);

	if (!context) {
		throw new Error(CONTEXT_ERROR);
	}

	return context;
}

export interface DataTableActions<TData> {
	/** Re-fetch the current page from the server. */
	reloadPage: () => void;
	/** Optimistically update a row by ID. Requires getRowId on DataTable. */
	updateRow: (rowId: string, updater: (row: TData) => TData) => void;
	/** Optimistically remove a row by ID. Requires getRowId on DataTable. */
	removeRow: (rowId: string) => void;
}

export function useDataTableActions<TData>(): DataTableActions<TData> {
	const { reloadPage, updateRow, removeRow } = useDataTableState();
	return { reloadPage, updateRow, removeRow } as DataTableActions<TData>;
}

export { DataTableTableContext, DataTableStateContext };
