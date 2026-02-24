"use client";

import { useState, type DragEvent } from "react";
import type { Table } from "@tanstack/react-table";
import { SELECT_COLUMN_ID, EXPAND_COLUMN_ID, ACTIONS_COLUMN_ID } from "../constants";

const NON_DRAGGABLE_COLUMNS = new Set([SELECT_COLUMN_ID, EXPAND_COLUMN_ID, ACTIONS_COLUMN_ID]);

export interface ColumnDragHandlers {
	onDragStart: (e: DragEvent, columnId: string) => void;
	onDragOver: (e: DragEvent, columnId: string) => void;
	onDragLeave: () => void;
	onDrop: (e: DragEvent, columnId: string) => void;
	onDragEnd: () => void;
}

export interface UseColumnReorderingReturn {
	draggedColumnId: string | null;
	dropTargetColumnId: string | null;
	dragHandlers: ColumnDragHandlers;
	isDraggable: (columnId: string, isPlaceholder: boolean) => boolean;
}

export function useColumnReordering<TData>(
	table: Table<TData>,
	enabled: boolean,
): UseColumnReorderingReturn {
	const [draggedColumnId, setDraggedColumnId] = useState<string | null>(null);
	const [dropTargetColumnId, setDropTargetColumnId] = useState<string | null>(null);

	const isDraggable = (columnId: string, isPlaceholder: boolean): boolean => {
		return enabled && !isPlaceholder && !NON_DRAGGABLE_COLUMNS.has(columnId);
	};

	const onDragStart = (e: DragEvent, columnId: string) => {
		setDraggedColumnId(columnId);
		e.dataTransfer.effectAllowed = "move";
		e.dataTransfer.setData("text/plain", columnId);
	};

	const onDragOver = (e: DragEvent, columnId: string) => {
		e.preventDefault();
		e.dataTransfer.dropEffect = "move";

		if (columnId !== draggedColumnId) {
			setDropTargetColumnId(columnId);
		}
	};

	const onDragLeave = () => {
		setDropTargetColumnId(null);
	};

	const onDrop = (e: DragEvent, targetColumnId: string) => {
		e.preventDefault();
		setDropTargetColumnId(null);
		setDraggedColumnId(null);

		const sourceColumnId = e.dataTransfer.getData("text/plain");

		if (!sourceColumnId || sourceColumnId === targetColumnId) {
			return;
		}

		const currentOrder =
			table.getState().columnOrder.length > 0
				? [...table.getState().columnOrder]
				: table.getAllLeafColumns().map((col) => col.id);

		const sourceIndex = currentOrder.indexOf(sourceColumnId);
		const targetIndex = currentOrder.indexOf(targetColumnId);

		if (sourceIndex === -1 || targetIndex === -1) {
			return;
		}

		currentOrder.splice(sourceIndex, 1);
		currentOrder.splice(targetIndex, 0, sourceColumnId);
		table.setColumnOrder(currentOrder);
	};

	const onDragEnd = () => {
		setDraggedColumnId(null);
		setDropTargetColumnId(null);
	};

	return {
		draggedColumnId,
		dropTargetColumnId,
		dragHandlers: { onDragStart, onDragOver, onDragLeave, onDrop, onDragEnd },
		isDraggable,
	};
}
