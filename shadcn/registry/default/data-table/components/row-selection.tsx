"use client";

import type { ReactNode } from "react";
import type { Row } from "@tanstack/react-table";
import { cn } from "@/registry/default/lib/utils";
import { useDataTable } from "../context";
import type { PropsWithClassName } from "../types";

export interface DataTableRowSelectionProps<TData = unknown> extends PropsWithClassName {
	children: (selectedRows: Row<TData>[]) => ReactNode;
}

export function DataTableRowSelection<TData>({ className, children }: DataTableRowSelectionProps<TData>) {
	"use no memo";
	const table = useDataTable<TData>();
	const selectedRows = table.getFilteredSelectedRowModel().rows;

	if (selectedRows.length === 0) {
		return null;
	}

	return (
		<div className={cn("flex items-center gap-4 rounded-md border bg-muted/50 px-4 py-2 text-sm", className)}>
			<span className="text-muted-foreground">{selectedRows.length} row(s) selected</span>
			<div className="flex items-center gap-2">{children(selectedRows)}</div>
		</div>
	);
}
