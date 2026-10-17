"use client";

import { useLayoutEffect, useRef, RefObject, type CSSProperties } from "react";
import type { Table, HeaderGroup } from "@tanstack/react-table";

export interface UseColumnMeasurementReturn {
	tableRef: RefObject<HTMLTableElement | null>;
	getColumnWidth: (columnId: string, getSize: () => number) => CSSProperties | undefined;
}

export function useColumnMeasurement<TData>(
	table: Table<TData>,
	headerGroups: HeaderGroup<TData>[],
	enableColumnResizing: boolean,
	rowCount: number,
	columnCount: number,
): UseColumnMeasurementReturn {
	const columnSizing = table.getState().columnSizing;

	const tableRef = useRef<HTMLTableElement>(null);
	const hasMeasuredRef = useRef(false);
	const prevColumnCountRef = useRef(columnCount);
	const prevResizingRef = useRef(enableColumnResizing);

	// Measure actual DOM column widths and pre-populate columnSizing so that
	// getSize() returns real widths (not TanStack defaults) when resize starts.
	// This prevents the table from "jumping" when entering resize mode.
	// Runs once after first render with data, synchronously before paint.
	useLayoutEffect(() => {
		// Gate resets live here rather than in the render body: reading and writing a ref while
		// rendering is unsafe under StrictMode's double render and concurrent rendering, and it
		// is what React Compiler refuses to compile.
		if (columnCount !== prevColumnCountRef.current) {
			prevColumnCountRef.current = columnCount;
			hasMeasuredRef.current = false;
		}

		// Re-enabling resizing after it was off should measure fresh.
		if (prevResizingRef.current && !enableColumnResizing) {
			hasMeasuredRef.current = false;
		}

		prevResizingRef.current = enableColumnResizing;

		if (!enableColumnResizing || hasMeasuredRef.current || rowCount === 0) {
			return;
		}

		const tableEl = tableRef.current;

		if (!tableEl) {
			return;
		}

		const ths = tableEl.querySelectorAll<HTMLTableCellElement>("thead tr:first-child th");

		if (ths.length === 0) {
			return;
		}

		const headers = headerGroups[0]?.headers;

		if (!headers || headers.length !== ths.length) {
			return;
		}

		const measured: Record<string, number> = {};

		for (let i = 0; i < headers.length; i++) {
			const header = headers[i];
			const th = ths[i];

			if (!header || !th) {
				continue;
			}

			measured[header.column.id] = th.getBoundingClientRect().width;
		}

		hasMeasuredRef.current = true;
		table.setColumnSizing(measured);
		// headerGroups is a fresh array each render, so this effect runs every render. That is
		// cheap: everything past the gate above short-circuits once measurement has happened.
	}, [enableColumnResizing, rowCount, columnCount, headerGroups, table]);

	/**
	 * Return explicit width styles for a column if its size has been measured
	 * or user-resized. Columns not yet in columnSizing get no explicit width
	 * (browser auto-sizes via table-layout:auto).
	 */
	const getColumnWidth = (columnId: string, getSize: () => number): CSSProperties | undefined => {
		if (!(columnId in columnSizing)) {
			return undefined;
		}

		const size = getSize();
		return { width: size, minWidth: size, maxWidth: size };
	};

	return { tableRef, getColumnWidth };
}
