"use client";

import { useRef, useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon, ChevronsLeftIcon, ChevronsRightIcon } from "lucide-react";

import { cn } from "@/registry/default/lib/utils";
import { Button } from "@/registry/default/ui/button";
import { Input } from "@/registry/default/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/registry/default/ui/select";
import { useDataTable, useDataTableState } from "../../context";
import type { PropsWithClassName } from "../../types";

const DEFAULT_PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

export interface DataTablePaginationProps extends PropsWithClassName {
	pageSizeOptions?: number[];
	/** Stick pagination to the bottom of the nearest scroll container */
	sticky?: boolean;
}

export function DataTablePagination({
	className,
	pageSizeOptions = DEFAULT_PAGE_SIZE_OPTIONS,
	sticky,
}: DataTablePaginationProps) {
	"use no memo";
	const table = useDataTable();
	const { isLoading } = useDataTableState();
	const pageIndex = table.getState().pagination.pageIndex;
	const pageCount = table.getPageCount() || 1;
	const inputRef = useRef<HTMLInputElement>(null);
	const [isFocused, setIsFocused] = useState(false);
	const [editingPage, setEditingPage] = useState(pageIndex + 1);

	// When focused, show the user's typed value; otherwise show the actual page
	const displayedPage = isFocused ? editingPage : pageIndex + 1;

	const commitPage = () => {
		const clamped = Math.max(1, Math.min(editingPage || 1, pageCount));
		setEditingPage(clamped);
		table.setPageIndex(clamped - 1);
	};

	const currentPageSize = table.getState().pagination.pageSize;

	// Ensure the current page size is always present in the options list
	const resolvedOptions = pageSizeOptions.includes(currentPageSize)
		? pageSizeOptions
		: [...pageSizeOptions, currentPageSize].sort((a, b) => a - b);

	return (
		<div
			className={cn(
				"flex items-center justify-between px-2",
				sticky && "sticky bottom-0 z-10 bg-background py-2",
				className,
			)}
		>
			<div className="flex items-center gap-2 text-sm text-muted-foreground">
				<span>Rows per page</span>
				<Select
					value={String(currentPageSize)}
					onValueChange={(value) => table.setPageSize(Number(value))}
					disabled={isLoading}
				>
					<SelectTrigger className="h-8 w-[70px]">
						<SelectValue placeholder={String(currentPageSize)} />
					</SelectTrigger>
					<SelectContent>
						{resolvedOptions.map((size) => (
							<SelectItem key={size} value={String(size)}>
								{size}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>

			<div className="flex items-center gap-2">
				<div className="flex items-center gap-1.5 text-sm text-muted-foreground">
					<span>Page</span>
					<Input
						ref={inputRef}
						type="number"
						min={1}
						max={pageCount}
						disabled={isLoading}
						value={displayedPage}
						onFocus={() => {
							setEditingPage(pageIndex + 1);
							setIsFocused(true);
						}}
						onChange={(e) => setEditingPage(e.target.valueAsNumber)}
						onBlur={() => {
							commitPage();
							setIsFocused(false);
						}}
						onKeyDown={(e) => {
							if (e.key === "Enter") {
								commitPage();
								inputRef.current?.blur();
							}
						}}
						className="h-8 w-12 text-center text-sm px-1 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
					/>
					<span>of {pageCount}</span>
				</div>

				<div className="flex items-center gap-1">
					<Button
						variant="outline"
						size="icon"
						className="size-8"
						onClick={() => table.firstPage()}
						disabled={isLoading || !table.getCanPreviousPage()}
					>
						<ChevronsLeftIcon className="size-4" />
					</Button>
					<Button
						variant="outline"
						size="icon"
						className="size-8"
						onClick={() => table.previousPage()}
						disabled={isLoading || !table.getCanPreviousPage()}
					>
						<ChevronLeftIcon className="size-4" />
					</Button>
					<Button
						variant="outline"
						size="icon"
						className="size-8"
						onClick={() => table.nextPage()}
						disabled={isLoading || !table.getCanNextPage()}
					>
						<ChevronRightIcon className="size-4" />
					</Button>
					<Button
						variant="outline"
						size="icon"
						className="size-8"
						onClick={() => table.lastPage()}
						disabled={isLoading || !table.getCanNextPage()}
					>
						<ChevronsRightIcon className="size-4" />
					</Button>
				</div>
			</div>
		</div>
	);
}
