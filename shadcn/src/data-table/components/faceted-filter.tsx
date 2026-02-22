"use client";

import { cn } from "../../lib/utils";
import { Button } from "../../primitives/button";
import { useDataTable } from "../context";
import { CheckIndicator, CountBadge } from "./filters/shared";
import { InlinePopover } from "./inline-popover";
import type { PropsWithClassName } from "../types";

export interface DataTableFacetedFilterProps extends PropsWithClassName {
	columnId: string;
	title: string;
	options: { label: string; value: string }[];
}

export function DataTableFacetedFilter({ className, columnId, title, options }: DataTableFacetedFilterProps) {
	"use no memo";
	const table = useDataTable();
	const column = table.getColumn(columnId);

	const rawFilter = column?.getFilterValue();
	const selectedValues = new Set(Array.isArray(rawFilter) ? (rawFilter as string[]) : []);

	if (!column) {
		return null;
	}

	const toggleValue = (value: string) => {
		const next = new Set(selectedValues);

		if (next.has(value)) {
			next.delete(value);
		} else {
			next.add(value);
		}

		column.setFilterValue(next.size > 0 ? Array.from(next) : undefined);
	};

	return (
		<InlinePopover
			className={className}
			align="left"
			widthClass="w-56"
			trigger={({ toggle }) => (
				<Button
					variant="outline"
					onClick={toggle}
					className={cn(selectedValues.size > 0 && "border-primary")}
				>
					{title}
					{selectedValues.size > 0 && <CountBadge count={selectedValues.size} className="ml-1" />}
				</Button>
			)}
		>
			<div className="max-h-60 overflow-auto">
				{options.map((option) => {
					const isSelected = selectedValues.has(option.value);

					return (
						<Button
							key={option.value}
							variant="ghost"
							onClick={() => toggleValue(option.value)}
							className="flex w-full justify-start gap-2 rounded-sm px-2 py-1.5 text-sm"
						>
							<CheckIndicator checked={isSelected} />
							{option.label}
						</Button>
					);
				})}
			</div>

			{selectedValues.size > 0 && (
				<>
					<div className="my-1 border-t" />
					<Button
						variant="ghost"
						onClick={() => column.setFilterValue(undefined)}
						className="w-full rounded-sm px-2 py-1.5 text-sm"
					>
						Clear filters
					</Button>
				</>
			)}
		</InlinePopover>
	);
}
