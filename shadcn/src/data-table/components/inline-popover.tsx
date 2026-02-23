"use client";

import { useState, useRef, type ReactNode } from "react";
import { cn } from "../../lib/utils";
import { useClickOutside } from "../hooks/use-click-outside";

export interface InlinePopoverProps {
	trigger: (props: { open: boolean; toggle: () => void }) => ReactNode;
	children: ReactNode;
	/** Horizontal alignment of the popover. @default "right" */
	align?: "left" | "right";
	/** Width class for the popover (e.g. "w-48"). */
	widthClass?: string;
	className?: string;
}

export function InlinePopover({ trigger, children, align = "right", widthClass, className }: InlinePopoverProps) {
	const [open, setOpen] = useState(false);
	const popoverRef = useRef<HTMLDivElement>(null);

	useClickOutside(popoverRef, () => setOpen(false), open);

	return (
		<div className={cn("relative", className)} ref={popoverRef}>
			{trigger({ open, toggle: () => setOpen(!open) })}

			{open && (
				<div
					className={cn(
						"absolute top-full z-50 mt-1 rounded-md border bg-popover p-1 shadow-md",
						align === "right" ? "right-0" : "left-0",
						widthClass,
					)}
				>
					{children}
				</div>
			)}
		</div>
	);
}
