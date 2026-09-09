"use client";

import { useState } from "react";

import { cn } from "@/registry/default/lib/utils";
import { Input } from "@/registry/default/ui/input";
import { useDataTable } from "../../context";
import { SEARCH_DEBOUNCE_MS } from "../../constants";
import { useDebouncedCallback } from "../../hooks/use-debounced-callback";
import type { PropsWithClassName } from "../../types";

const SEARCH_PLACEHOLDER = "Search...";

export interface DataTableSearchProps extends PropsWithClassName {
	placeholder?: string;
	debounceMs?: number;
}

export function DataTableSearch({
	className,
	placeholder = SEARCH_PLACEHOLDER,
	debounceMs = SEARCH_DEBOUNCE_MS,
}: DataTableSearchProps) {
	"use no memo";
	const table = useDataTable();
	const externalFilter = (table.getState().globalFilter as string) ?? "";
	const [value, setValue] = useState<string>(externalFilter);

	// Sync the local value when globalFilter changes externally (e.g. cleared by a filters
	// reset). Adjusting state during render is React's documented alternative to syncing it in
	// an effect: it re-renders before committing, instead of painting a stale value first.
	const [prevExternalFilter, setPrevExternalFilter] = useState(externalFilter);

	if (externalFilter !== prevExternalFilter) {
		setPrevExternalFilter(externalFilter);
		setValue(externalFilter);
	}

	const [debouncedSetFilter] = useDebouncedCallback(
		(newValue: string) => {
			table.setGlobalFilter(newValue);
		},
		debounceMs,
		{ flushOnUnmount: false },
	);

	return (
		<Input
			placeholder={placeholder}
			value={value}
			onChange={(e) => {
				setValue(e.target.value);
				debouncedSetFilter(e.target.value);
			}}
			className={cn("max-w-sm", className)}
		/>
	);
}
