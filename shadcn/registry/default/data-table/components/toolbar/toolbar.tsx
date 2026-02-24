"use client";

import type { PropsWithChildren } from "react";

import { cn } from "@/registry/default/lib/utils";
import type { PropsWithClassName } from "../../types";

type DataTableToolbarProps = PropsWithClassName & PropsWithChildren;

export function DataTableToolbar({ className, children }: DataTableToolbarProps) {
	return <div className={cn("flex items-center gap-2", className)}>{children}</div>;
}
