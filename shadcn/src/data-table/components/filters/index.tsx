"use client";

import { useState, useRef, useMemo } from "react";
import { SlidersHorizontalIcon } from "lucide-react";
import { cn } from "../../../lib/utils";
import { Button } from "../../../primitives/button";
import { useDataTable } from "../../context";
import { useClickOutside } from "../../hooks/use-click-outside";
import { ColumnPicker } from "./column-picker";
import { FilterListView } from "./filter-list-view";
import { CountBadge } from "./shared";
import type { DataTableFilterDefinition, PropsWithClassName } from "../../types";

export interface DataTableFiltersProps extends PropsWithClassName {
	/** Filter definitions for each filterable column */
	filters: DataTableFilterDefinition[];
}

export function DataTableFilters({ className, filters }: DataTableFiltersProps) {
	"use no memo";
	const table = useDataTable();
	const [open, setOpen] = useState(false);
	const [activeFilterIds, setActiveFilterIds] = useState<string[]>([]);
	const [isPickingColumn, setIsPickingColumn] = useState(false);
	const popoverRef = useRef<HTMLDivElement>(null);

	useClickOutside(
		popoverRef,
		() => {
			setOpen(false);
			setIsPickingColumn(false);
		},
		open,
	);

	const availableFilters = filters.filter((f) => !activeFilterIds.includes(f.columnId));

	// Count total active filter values
	const columnFilters = table.getState().columnFilters;
	const totalActiveCount = useMemo(() => {
		let count = 0;

		for (const filter of columnFilters) {
			if (!activeFilterIds.includes(filter.id)) {
				continue;
			}

			const { value } = filter;

			if (value !== undefined && value !== null) {
				if (Array.isArray(value)) {
					count += value.length;
				} else {
					count += 1;
				}
			}
		}

		return count;
	}, [activeFilterIds, columnFilters]);

	const addFilter = (columnId: string) => {
		setActiveFilterIds((prev) => [...prev, columnId]);
		setIsPickingColumn(false);
	};

	const removeFilter = (columnId: string) => {
		setActiveFilterIds((prev) => prev.filter((id) => id !== columnId));
		table.getColumn(columnId)?.setFilterValue(undefined);
	};

	const clearAll = () => {
		for (const id of activeFilterIds) {
			table.getColumn(id)?.setFilterValue(undefined);
		}

		setActiveFilterIds([]);
	};

	return (
		<div className={cn("relative inline-block", className)} ref={popoverRef}>
			{/* Trigger button */}
			<Button
				variant="outline"
				onClick={() => {
					setOpen(!open);
					setIsPickingColumn(false);
				}}
				className={cn(totalActiveCount > 0 && "border-primary")}
			>
				<SlidersHorizontalIcon className="size-4" />
				Filters
				{totalActiveCount > 0 && <CountBadge count={totalActiveCount} />}
			</Button>

			{/* Dropdown */}
			{open && (
				<div className="absolute left-0 top-full z-50 mt-1 w-80 rounded-md border bg-popover shadow-md">
					{isPickingColumn ? (
						<ColumnPicker
							available={availableFilters}
							onSelect={addFilter}
							onCancel={() => setIsPickingColumn(false)}
						/>
					) : (
						<FilterListView
							filters={filters}
							activeFilterIds={activeFilterIds}
							availableCount={availableFilters.length}
							onRemove={removeFilter}
							onAddClick={() => setIsPickingColumn(true)}
							onClearAll={clearAll}
						/>
					)}
				</div>
			)}
		</div>
	);
}
