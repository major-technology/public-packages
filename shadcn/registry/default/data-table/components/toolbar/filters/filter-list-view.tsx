"use client";

import { useState, useRef, useLayoutEffect, useCallback } from "react";
import { PlusIcon } from "lucide-react";

import { Button } from "@/registry/default/ui/button";
import { FilterCard } from "./filter-card";
import type { DataTableFilterDefinition } from "../../../types";

export interface FilterListViewProps {
	filters: DataTableFilterDefinition[];
	activeFilterIds: string[];
	availableCount: number;
	onRemove: (columnId: string) => void;
	onAddClick: () => void;
	onClearAll: () => void;
}

function computeScrollShadows(el: HTMLDivElement | null) {
	if (!el) {
		return { top: false, bottom: false };
	}

	return {
		top: el.scrollTop > 1,
		bottom: el.scrollTop + el.clientHeight < el.scrollHeight - 1,
	};
}

export function FilterListView({
	filters,
	activeFilterIds,
	availableCount,
	onRemove,
	onAddClick,
	onClearAll,
}: FilterListViewProps) {
	const scrollRef = useRef<HTMLDivElement>(null);
	const [showTopShadow, setShowTopShadow] = useState(false);
	const [showBottomShadow, setShowBottomShadow] = useState(false);

	const handleScroll = useCallback(() => {
		const { top, bottom } = computeScrollShadows(scrollRef.current);
		setShowTopShadow(top);
		setShowBottomShadow(bottom);
	}, []);

	useLayoutEffect(() => {
		const { top, bottom } = computeScrollShadows(scrollRef.current);
		setShowTopShadow(top);
		setShowBottomShadow(bottom);
	}, [activeFilterIds.length]);

	return (
		<div>
			{activeFilterIds.length === 0 ? (
				<div className="px-3 pb-1 pt-3 text-center text-sm text-muted-foreground">No filters applied</div>
			) : (
				<div className="relative">
					<div ref={scrollRef} onScroll={handleScroll} className="max-h-[320px] overflow-y-auto p-2">
						{activeFilterIds.map((id) => {
							const def = filters.find((f) => f.columnId === id);

							if (!def) {
								return null;
							}

							return (
								<div key={id} className="mb-2 last:mb-0 rounded-md border bg-background p-2">
									<FilterCard definition={def} onRemove={() => onRemove(id)} />
								</div>
							);
						})}
					</div>

					{showTopShadow && (
						<div className="pointer-events-none absolute left-0 right-0 top-0 z-10 h-4 bg-linear-to-b from-black/8 to-transparent" />
					)}

					{showBottomShadow && (
						<div className="pointer-events-none absolute bottom-0 left-0 right-0 z-10 h-4 bg-linear-to-t from-black/[0.08] to-transparent" />
					)}
				</div>
			)}

			<div className="border-t p-2">
				{availableCount > 0 && (
					<Button
						variant="ghost"
						size="sm"
						onClick={onAddClick}
						className="flex w-full justify-start gap-1.5 rounded-sm px-2 py-1.5 text-muted-foreground"
					>
						<PlusIcon className="size-3.5" />
						Add filter
					</Button>
				)}

				{activeFilterIds.length > 0 && (
					<Button
						variant="ghost"
						size="sm"
						onClick={onClearAll}
						className="mt-1 w-full rounded-sm px-2 py-1.5 text-muted-foreground"
					>
						Clear all filters
					</Button>
				)}
			</div>
		</div>
	);
}
