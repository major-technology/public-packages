"use client";

import { useMemo, useState, type ReactNode, type CSSProperties } from "react";
import type { Row } from "@tanstack/react-table";
import { RefreshCwIcon } from "lucide-react";

import { cn } from "@/registry/default/lib/utils";
import { Button } from "@/registry/default/ui/button";
import { Table } from "../primitives/table";
import { DataTableEmpty } from "./states";
import { DataTableHeader } from "./header";
import { DataTableBody } from "./body";
import { useDataTable, useDataTableState } from "../context";
import { useColumnMeasurement } from "../hooks/use-column-measurement";
import { useColumnReordering } from "../hooks/use-column-reordering";
import { useTableScroll } from "../hooks/use-table-scroll";
import { useRowVirtualizer } from "../hooks/use-row-virtualizer";
import { ACTIONS_COLUMN_ID } from "../constants";
import type { PropsWithClassName } from "../types";

export interface DataTableContentProps<TData> extends PropsWithClassName {
	renderExpandedRow?: (row: Row<TData>) => ReactNode;
	onRowClick?: (row: Row<TData>) => void;
	emptyTitle?: string;
	emptyDescription?: string;
	emptyContent?: ReactNode;
	/** Pin the table header while scrolling rows. Pair with maxHeight. */
	stickyHeader?: boolean;
	/** Constrains the table scroll area height (px or CSS value). Required for stickyHeader to scroll. */
	maxHeight?: number | string;
	/** Enable row virtualization. Requires maxHeight to define the scroll viewport. */
	virtualized?: boolean;
	/** Estimated height of a single row in px. Used by the virtualizer for initial layout. @default 48 */
	estimateRowHeight?: number;
	/** Number of rows to render outside the visible area. @default 5 */
	overscan?: number;
}

export function DataTableContent<TData>({
	className,
	renderExpandedRow,
	onRowClick,
	emptyTitle,
	emptyDescription,
	emptyContent,
	stickyHeader,
	maxHeight,
	virtualized = false,
	estimateRowHeight = 48,
	overscan = 5,
}: DataTableContentProps<TData>) {
	"use no memo";

	const table = useDataTable<TData>();
	const { isLoading, enableColumnReordering, enableColumnResizing, error, retry, loadNextPage, hasMore } =
		useDataTableState();

	const rows = table.getRowModel().rows;
	const columnCount = table.getAllColumns().length;
	const headerGroups = table.getHeaderGroups();
	const hasActionsColumn = table.getAllLeafColumns().some((col) => col.id === ACTIONS_COLUMN_ID);

	const { tableRef, getColumnWidth } = useColumnMeasurement(
		table,
		headerGroups,
		enableColumnResizing,
		rows.length,
		columnCount,
	);

	const { draggedColumnId, dropTargetColumnId, dragHandlers, isDraggable } = useColumnReordering(
		table,
		enableColumnReordering,
	);

	const { containerRef, isScrolledToEnd } = useTableScroll({
		hasActionsColumn,
		virtualized,
		hasMore,
		loadNextPage,
	});

	const { virtualItems, totalSize, measureElement } = useRowVirtualizer({
		enabled: virtualized,
		scrollContainerRef: containerRef,
		rowCount: rows.length,
		estimateRowHeight,
		overscan,
	});

	const columnSizingInfo = table.getState().columnSizingInfo;
	const resizingColumnId = columnSizingInfo.isResizingColumn;
	const [hoveredResizeColumnId, setHoveredResizeColumnId] = useState<string | null>(null);

	const isResizeActive = (columnId: string): boolean => {
		return resizingColumnId === columnId || hoveredResizeColumnId === columnId;
	};

	const resizeHandlerMap = useMemo(() => {
		const map: Record<string, (e: unknown) => void> = {};

		if (enableColumnResizing) {
			for (const hg of headerGroups) {
				for (const h of hg.headers) {
					if (h.column.getCanResize()) {
						map[h.column.id] = h.getResizeHandler();
					}
				}
			}
		}

		return map;
	}, [enableColumnResizing, headerGroups]);

	const showBodySkeleton = isLoading && rows.length === 0;
	const actionsShadow = isScrolledToEnd ? "none" : "-4px 0 8px -2px rgba(0,0,0,0.1)";
	const containerStyle: CSSProperties | undefined =
		maxHeight !== undefined ? { maxHeight: typeof maxHeight === "number" ? `${maxHeight}px` : maxHeight } : undefined;

	const columnSizing = table.getState().columnSizing;
	const hasPopulatedSizes = enableColumnResizing && Object.keys(columnSizing).length > 0;
	const tableStyle: CSSProperties | undefined = hasPopulatedSizes
		? { tableLayout: "fixed" as const, width: table.getCenterTotalSize() }
		: undefined;

	if (!isLoading && error && rows.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center rounded-md border py-12 text-center">
				<p className="text-sm text-muted-foreground">An error occurred while loading this page.</p>
				<Button variant="outline" size="sm" className="mt-3" onClick={retry}>
					<RefreshCwIcon className="size-3.5" />
					Retry
				</Button>
			</div>
		);
	}

	if (!isLoading && rows.length === 0) {
		return (
			<DataTableEmpty title={emptyTitle} description={emptyDescription}>
				{emptyContent}
			</DataTableEmpty>
		);
	}

	return (
		<Table
			ref={tableRef}
			containerRef={containerRef}
			containerClassName={cn("rounded-md border", stickyHeader && !maxHeight && "overflow-visible", className)}
			containerStyle={containerStyle}
			style={tableStyle}
		>
			<DataTableHeader<TData>
				stickyHeader={stickyHeader}
				hasActionsColumn={hasActionsColumn}
				actionsShadow={actionsShadow}
				getColumnWidth={getColumnWidth}
				draggedColumnId={draggedColumnId}
				dropTargetColumnId={dropTargetColumnId}
				dragHandlers={dragHandlers}
				isDraggable={isDraggable}
				hoveredResizeColumnId={hoveredResizeColumnId}
				onResizeHoverChange={setHoveredResizeColumnId}
				isResizeActive={isResizeActive}
				resizeHandlerMap={resizeHandlerMap}
			/>

			<DataTableBody<TData>
				renderExpandedRow={renderExpandedRow}
				onRowClick={onRowClick}
				hasActionsColumn={hasActionsColumn}
				actionsShadow={actionsShadow}
				getColumnWidth={getColumnWidth}
				isResizeActive={isResizeActive}
				onResizeHoverChange={setHoveredResizeColumnId}
				resizeHandlerMap={resizeHandlerMap}
				virtualized={virtualized}
				virtualItems={virtualItems}
				totalSize={totalSize}
				measureElement={measureElement}
				showBodySkeleton={showBodySkeleton}
				columnCount={columnCount}
			/>
		</Table>
	);
}
