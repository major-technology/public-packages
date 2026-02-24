"use client";

import type { PropsWithChildren } from "react";

import { cn } from "@/registry/default/lib/utils";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "../primitives/table";
import { SKELETON_ROW_COUNT } from "../constants";
import type { PropsWithClassName } from "../types";

const SKELETON_COLUMN_COUNT = 4;

export interface DataTableSkeletonProps extends PropsWithClassName {
	columnCount?: number;
	rowCount?: number;
}

export function DataTableSkeleton({
	className,
	columnCount = SKELETON_COLUMN_COUNT,
	rowCount = SKELETON_ROW_COUNT,
}: DataTableSkeletonProps) {
	return (
		<div className={cn("rounded-md border", className)}>
			<Table>
				<TableHeader>
					<TableRow>
						{Array.from({ length: columnCount }).map((_, i) => (
							<TableHead key={i}>
								<div className="h-4 w-24 animate-pulse rounded bg-muted" />
							</TableHead>
						))}
					</TableRow>
				</TableHeader>
				<TableBody>
					{Array.from({ length: rowCount }).map((_, rowIdx) => (
						<TableRow key={rowIdx}>
							{Array.from({ length: columnCount }).map((_, colIdx) => (
								<TableCell key={colIdx}>
									<div className="h-4 w-full animate-pulse rounded bg-muted" />
								</TableCell>
							))}
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
}

const EMPTY_STATE_TITLE = "No results";
const EMPTY_STATE_DESCRIPTION = "No data to display.";

export interface DataTableEmptyProps extends PropsWithClassName, PropsWithChildren {
	title?: string;
	description?: string;
}

export function DataTableEmpty({
	className,
	title = EMPTY_STATE_TITLE,
	description = EMPTY_STATE_DESCRIPTION,
	children,
}: DataTableEmptyProps) {
	return (
		<div className={cn("flex flex-col items-center justify-center rounded-md border py-12", className)}>
			<p className="text-lg font-medium text-foreground">{title}</p>
			<p className="mt-1 text-sm text-muted-foreground">{description}</p>
			{children && <div className="mt-4">{children}</div>}
		</div>
	);
}
