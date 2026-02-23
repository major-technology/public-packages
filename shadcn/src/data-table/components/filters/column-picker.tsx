"use client";

import { ChevronLeftIcon } from "lucide-react";

import { Button } from "../../../primitives/button";
import { FILTER_TYPE_LABELS } from "../../constants";
import type { DataTableFilterDefinition } from "../../types";

export interface ColumnPickerProps {
	available: DataTableFilterDefinition[];
	onSelect: (columnId: string) => void;
	onCancel: () => void;
}

export function ColumnPicker({ available, onSelect, onCancel }: ColumnPickerProps) {
	return (
		<div className="p-2">
			<Button
				variant="ghost"
				onClick={onCancel}
				className="mb-1 flex h-auto items-center gap-1 rounded-sm px-2 py-1 text-xs text-muted-foreground"
			>
				<ChevronLeftIcon className="size-3" />
				Back
			</Button>

			<p className="px-2 pb-1 text-xs font-medium text-muted-foreground">Select column to filter</p>

			<div className="max-h-60 overflow-auto">
				{available.map((filter) => (
					<Button
						key={filter.columnId}
						variant="ghost"
						onClick={() => onSelect(filter.columnId)}
						className="flex w-full justify-between rounded-sm px-2 py-1.5 text-sm"
					>
						<span>{filter.title}</span>
						<span className="text-xs text-muted-foreground">{FILTER_TYPE_LABELS[filter.type]}</span>
					</Button>
				))}
			</div>
		</div>
	);
}
