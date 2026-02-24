"use client";

import { Fragment, type ReactNode, type CSSProperties } from "react";
import { flexRender, type Row } from "@tanstack/react-table";

import { cn } from "@/registry/default/lib/utils";
import { TableBody, TableRow, TableCell } from "../primitives/table";
import { ResizeHandle } from "./resize-handle";
import { useDataTable, useDataTableState } from "../context";
import { ACTIONS_COLUMN_ID, SKELETON_ROW_COUNT } from "../constants";
import type { VirtualItem } from "../hooks/use-row-virtualizer";

export interface DataTableBodyProps<TData> {
	renderExpandedRow?: (row: Row<TData>) => ReactNode;
	onRowClick?: (row: Row<TData>) => void;
	hasActionsColumn: boolean;
	actionsShadow: string;
	getColumnWidth: (columnId: string, getSize: () => number) => CSSProperties | undefined;
	// Resize
	isResizeActive: (columnId: string) => boolean;
	onResizeHoverChange: (columnId: string | null) => void;
	resizeHandlerMap: Record<string, (e: unknown) => void>;
	// Virtualization
	virtualized: boolean;
	virtualItems: VirtualItem[];
	totalSize: number;
	measureElement: ((node: Element | null) => void) | undefined;
	// Skeleton
	showBodySkeleton: boolean;
	columnCount: number;
}

export function DataTableBody<TData>({
	renderExpandedRow,
	onRowClick,
	hasActionsColumn,
	actionsShadow,
	getColumnWidth,
	isResizeActive,
	onResizeHoverChange,
	resizeHandlerMap,
	virtualized,
	virtualItems,
	totalSize,
	measureElement,
	showBodySkeleton,
	columnCount,
}: DataTableBodyProps<TData>) {
	"use no memo";

	const table = useDataTable<TData>();
	const { enableColumnResizing } = useDataTableState();
	const rows = table.getRowModel().rows;

	const renderRow = (row: Row<TData>) => {
		return (
			<Fragment key={row.id}>
				<TableRow
					data-state={row.getIsSelected() ? "selected" : undefined}
					className={cn(onRowClick && "cursor-pointer")}
					onClick={onRowClick ? () => onRowClick(row) : undefined}
				>
					{row.getVisibleCells().map((cell, cellIndex, cells) => {
						const canResizeCell = enableColumnResizing && cell.column.getCanResize();
						const isLastCell = cellIndex === cells.length - 1;
						const isActionsCell = hasActionsColumn && cell.column.id === ACTIONS_COLUMN_ID;

						return (
							<TableCell
								key={cell.id}
								style={{
									...getColumnWidth(cell.column.id, () => cell.column.getSize()),
									...(isResizeActive(cell.column.id) ? { cursor: "col-resize" } : {}),
									...(isActionsCell ? { boxShadow: actionsShadow } : {}),
								}}
								className={cn(
									canResizeCell && "relative",
									canResizeCell && !isLastCell && "border-r border-border",
									isActionsCell && "sticky right-0 z-10 !px-2 bg-background group-hover:bg-muted group-data-[state=selected]:bg-muted",
								)}
							>
								{canResizeCell ? (
									<div className="truncate">{flexRender(cell.column.columnDef.cell, cell.getContext())}</div>
								) : (
									flexRender(cell.column.columnDef.cell, cell.getContext())
								)}
								{canResizeCell && resizeHandlerMap[cell.column.id] && (
									<ResizeHandle
										columnId={cell.column.id}
										isActive={isResizeActive(cell.column.id)}
										onHoverChange={onResizeHoverChange}
										onResize={resizeHandlerMap[cell.column.id]}
									/>
								)}
							</TableCell>
						);
					})}
				</TableRow>

				{row.getIsExpanded() && renderExpandedRow && (
					<TableRow>
						<TableCell colSpan={row.getVisibleCells().length} className="p-0">
							{renderExpandedRow(row)}
						</TableCell>
					</TableRow>
				)}
			</Fragment>
		);
	};

	if (showBodySkeleton) {
		return (
			<TableBody>
				{Array.from({ length: SKELETON_ROW_COUNT }).map((_, i) => (
					<TableRow key={i}>
						{Array.from({ length: columnCount }).map((_, j) => (
							<TableCell key={j}>
								<div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
							</TableCell>
						))}
					</TableRow>
				))}
			</TableBody>
		);
	}

	if (virtualized) {
		const firstItem = virtualItems[0];
		const lastItem = virtualItems[virtualItems.length - 1];
		const topPad = firstItem ? firstItem.start : 0;
		const bottomPad = lastItem ? totalSize - lastItem.end : 0;

		return (
			<>
				{topPad > 0 && (
					<tbody>
						<tr>
							<td style={{ height: topPad, padding: 0, border: "none" }} />
						</tr>
					</tbody>
				)}

				{virtualItems.map((virtualRow) => {
					const row = rows[virtualRow.index];

					if (!row) {
						return null;
					}

					return (
						<tbody key={virtualRow.key} data-index={virtualRow.index} ref={measureElement}>
							{renderRow(row)}
						</tbody>
					);
				})}

				{bottomPad > 0 && (
					<tbody>
						<tr>
							<td style={{ height: bottomPad, padding: 0, border: "none" }} />
						</tr>
					</tbody>
				)}
			</>
		);
	}

	return <TableBody>{rows.map((row) => renderRow(row))}</TableBody>;
}
