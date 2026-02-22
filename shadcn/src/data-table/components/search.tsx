"use client";

import { useEffect, useState } from "react";

import { cn } from "../../lib/utils";
import { Input } from "../../primitives/input";
import { useDataTable } from "../context";
import { SEARCH_DEBOUNCE_MS } from "../constants";
import { useDebouncedCallback } from "../hooks/use-debounced-callback";
import type { PropsWithClassName } from "../types";

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

	// Sync local value when globalFilter changes externally (e.g. cleared by filters reset)
	useEffect(() => {
		setValue(externalFilter);
	}, [externalFilter]);

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
