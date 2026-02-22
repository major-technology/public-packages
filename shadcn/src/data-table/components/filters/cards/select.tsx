"use client";

import { cn } from "../../../../lib/utils";
import { Button } from "../../../../primitives/button";
import { useDataTable } from "../../../context";
import { FilterCardHeader } from "../shared";
import type { DataTableSelectFilterDef } from "../../../types";

export interface SelectFilterCardProps {
	definition: DataTableSelectFilterDef;
	onRemove: () => void;
}

export function SelectFilterCard({ definition, onRemove }: SelectFilterCardProps) {
	"use no memo";
	const table = useDataTable();
	const column = table.getColumn(definition.columnId);
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
		<>
			<FilterCardHeader title={definition.title} onRemove={onRemove} />

			<div className="flex flex-wrap gap-1">
				{definition.options.map((option) => {
					const isSelected = selectedValues.has(option.value);

					return (
						<Button
							key={option.value}
							variant="outline"
							onClick={() => toggleValue(option.value)}
							className={cn(
								"h-7 gap-1.5 px-2 text-xs transition-colors",
								isSelected ? "border-primary bg-primary/10 text-primary" : "text-muted-foreground",
							)}
						>
							<div
								className={cn(
									"flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-sm border",
									isSelected ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground/40",
								)}
							>
								{isSelected && <span className="text-[9px] leading-none">&#x2713;</span>}
							</div>
							{option.label}
						</Button>
					);
				})}
			</div>
		</>
	);
}
