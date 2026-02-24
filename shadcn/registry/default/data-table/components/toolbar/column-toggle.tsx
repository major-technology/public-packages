"use client";

import { Eye } from "lucide-react";

import { Button } from "@/registry/default/ui/button";
import { useDataTable } from "../../context";
import { CheckIndicator } from "./filters/shared";
import { InlinePopover } from "../inline-popover";
import type { PropsWithClassName } from "../../types";
import { flexRender, HeaderContext } from "@tanstack/react-table";

export interface DataTableColumnToggleProps extends PropsWithClassName {
	label?: string;
}

export function DataTableColumnToggle({ className, label = "Columns" }: DataTableColumnToggleProps) {
	"use no memo";
	const table = useDataTable();

	const columns = table.getAllColumns().filter((col) => col.getCanHide());
	const visibleCount = columns.filter((col) => col.getIsVisible()).length;

	return (
		<InlinePopover
			className={className}
			widthClass="w-48"
			trigger={({ toggle }) => (
				<Button variant="outline" onClick={toggle}>
					<Eye />
					{label}
				</Button>
			)}
		>
			<div className="max-h-60 overflow-auto">
				{columns.map((column) => {
					const isVisible = column.getIsVisible();
					const isLastVisible = isVisible && visibleCount <= 1;

					return (
						<Button
							key={column.id}
							variant="ghost"
							disabled={isLastVisible}
							onClick={() => column.toggleVisibility(!isVisible)}
							className="flex w-full justify-start gap-2 rounded-sm px-2 py-1.5 text-sm"
						>
							<CheckIndicator checked={isVisible} />
							<span className="capitalize">
								{flexRender(column.columnDef.header, { column } as HeaderContext<unknown, unknown>)}
							</span>
						</Button>
					);
				})}
			</div>
		</InlinePopover>
	);
}
