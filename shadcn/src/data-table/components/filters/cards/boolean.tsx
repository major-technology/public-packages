"use client";

import { cn } from "../../../../lib/utils";
import { Button } from "../../../../primitives/button";
import { useDataTable } from "../../../context";
import { FilterCardHeader } from "../shared";

export interface BooleanFilterCardProps {
	columnId: string;
	title: string;
	onRemove: () => void;
}

export function BooleanFilterCard({ columnId, title, onRemove }: BooleanFilterCardProps) {
	"use no memo";
	const table = useDataTable();
	const column = table.getColumn(columnId);
	const currentValue = column?.getFilterValue() as boolean | undefined;

	if (!column) {
		return null;
	}

	const toggle = (value: boolean) => {
		if (currentValue === value) {
			column.setFilterValue(undefined);
		} else {
			column.setFilterValue(value);
		}
	};

	return (
		<>
			<FilterCardHeader title={title} onRemove={onRemove} />

			<div className="flex items-center gap-1">
				<Button
					variant="outline"
					onClick={() => toggle(true)}
					className={cn(
						"h-7 px-3 text-xs transition-colors",
						currentValue === true ? "border-primary bg-primary/10 text-primary" : "text-muted-foreground",
					)}
				>
					Yes
				</Button>
				<Button
					variant="outline"
					onClick={() => toggle(false)}
					className={cn(
						"h-7 px-3 text-xs transition-colors",
						currentValue === false ? "border-primary bg-primary/10 text-primary" : "text-muted-foreground",
					)}
				>
					No
				</Button>
			</div>
		</>
	);
}
