"use client";

import { flexRender } from "@tanstack/react-table";
import { ChevronUpIcon, ChevronDownIcon, ChevronsUpDownIcon, GripVerticalIcon } from "lucide-react";

import { cn } from "@/registry/default/lib/utils";
import { TableHeader, TableRow, TableHead } from "../primitives/table";
import { ResizeHandle } from "./resize-handle";
import { useDataTable, useDataTableState } from "../context";
import { ACTIONS_COLUMN_ID, SORT_DIRECTION } from "../constants";
import type { CSSProperties } from "react";
import type { ColumnDragHandlers } from "../hooks/use-column-reordering";

export interface DataTableHeaderProps {
	stickyHeader?: boolean;
	hasActionsColumn: boolean;
	actionsShadow: string;
	getColumnWidth: (columnId: string, getSize: () => number) => CSSProperties | undefined;
	// Drag-and-drop
	draggedColumnId: string | null;
	dropTargetColumnId: string | null;
	dragHandlers: ColumnDragHandlers;
	isDraggable: (columnId: string, isPlaceholder: boolean) => boolean;
	// Resize
	hoveredResizeColumnId: string | null;
	onResizeHoverChange: (columnId: string | null) => void;
	isResizeActive: (columnId: string) => boolean;
	resizeHandlerMap: Record<string, (e: unknown) => void>;
}

export function DataTableHeader<TData>({
	stickyHeader,
	hasActionsColumn,
	actionsShadow,
	getColumnWidth,
	draggedColumnId,
	dropTargetColumnId,
	dragHandlers,
	isDraggable,
	hoveredResizeColumnId,
	onResizeHoverChange,
	isResizeActive,
	resizeHandlerMap,
}: DataTableHeaderProps) {
	"use no memo";

	const table = useDataTable<TData>();
	const { enableColumnResizing } = useDataTableState();
	const headerGroups = table.getHeaderGroups();

	return (
		<TableHeader>
			{headerGroups.map((headerGroup) => (
				<TableRow key={headerGroup.id}>
					{headerGroup.headers.map((header, headerIndex) => {
						const colCanSort = header.column.getCanSort();
						const sorted = header.column.getIsSorted();
						const draggable = isDraggable(header.column.id, header.isPlaceholder);
						const canResize = enableColumnResizing && header.column.getCanResize();
						const isLastHeader = headerIndex === headerGroup.headers.length - 1;
						const isActionsHeader = hasActionsColumn && header.column.id === ACTIONS_COLUMN_ID;

						return (
							<TableHead
								key={header.id}
								style={{
									...getColumnWidth(header.column.id, () => header.getSize()),
									...(isResizeActive(header.column.id) ? { cursor: "col-resize" } : {}),
									...(isActionsHeader ? { boxShadow: actionsShadow } : {}),
								}}
								className={cn(
									"relative",
									stickyHeader && "sticky top-0 z-10 bg-muted",
									colCanSort && "cursor-pointer select-none",
									draggable && "cursor-grab",
									draggedColumnId === header.column.id && "opacity-50",
									dropTargetColumnId === header.column.id && "bg-accent",
									canResize && !isLastHeader && "border-r border-border",
									isActionsHeader && "sticky right-0 z-20 !px-2 bg-muted",
								)}
								draggable={draggable && hoveredResizeColumnId !== header.column.id}
								onDragStart={draggable ? (e) => dragHandlers.onDragStart(e, header.column.id) : undefined}
								onDragOver={draggable ? (e) => dragHandlers.onDragOver(e, header.column.id) : undefined}
								onDragLeave={draggable ? dragHandlers.onDragLeave : undefined}
								onDrop={draggable ? (e) => dragHandlers.onDrop(e, header.column.id) : undefined}
								onDragEnd={draggable ? dragHandlers.onDragEnd : undefined}
								onClick={colCanSort && !draggedColumnId ? header.column.getToggleSortingHandler() : undefined}
							>
								<div className={cn("flex w-full items-center gap-1.5", enableColumnResizing && "overflow-hidden")}>
									{draggable && <GripVerticalIcon className="size-3.5 text-muted-foreground/50 shrink-0" />}
									<div className={cn("min-w-0", !draggable && !colCanSort && "flex-1")}>
										{header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
									</div>
									{colCanSort && (
										<span className="text-muted-foreground shrink-0">
											{sorted === SORT_DIRECTION.ASC && <ChevronUpIcon className="size-3.5" />}
											{sorted === SORT_DIRECTION.DESC && <ChevronDownIcon className="size-3.5" />}
											{!sorted && <ChevronsUpDownIcon className="size-3.5" />}
										</span>
									)}
								</div>

								{canResize && resizeHandlerMap[header.column.id] && (
									<ResizeHandle
										columnId={header.column.id}
										isActive={isResizeActive(header.column.id)}
										onHoverChange={onResizeHoverChange}
										onResize={resizeHandlerMap[header.column.id]}
									/>
								)}
							</TableHead>
						);
					})}
				</TableRow>
			))}
		</TableHeader>
	);
}
