import { forwardRef, type HTMLAttributes, type CSSProperties, type Ref, type ThHTMLAttributes, type TdHTMLAttributes } from "react";
import { cn } from "../lib/utils";

interface TableProps extends HTMLAttributes<HTMLTableElement> {
	/** Additional class name for the scroll container wrapping the table */
	containerClassName?: string;
	/** Inline styles for the scroll container (e.g. maxHeight for sticky header) */
	containerStyle?: CSSProperties;
	/** Ref for the scroll container div (used by virtualizer) */
	containerRef?: Ref<HTMLDivElement>;
}

const Table = forwardRef<HTMLTableElement, TableProps>(
	({ className, containerClassName, containerStyle, containerRef, ...props }, ref) => (
		<div ref={containerRef} className={cn("relative w-full overflow-auto", containerClassName)} style={containerStyle}>
			<table
				ref={ref}
				className={cn("w-full border-separate border-spacing-0 caption-bottom text-sm", className)}
				{...props}
			/>
		</div>
	),
);
Table.displayName = "Table";

const TableHeader = forwardRef<HTMLTableSectionElement, HTMLAttributes<HTMLTableSectionElement>>(
	({ className, ...props }, ref) => <thead ref={ref} className={cn("bg-muted/50", className)} {...props} />,
);
TableHeader.displayName = "TableHeader";

const TableBody = forwardRef<HTMLTableSectionElement, HTMLAttributes<HTMLTableSectionElement>>(
	({ className, ...props }, ref) => (
		<tbody ref={ref} className={cn("[&_tr:last-child>td]:shadow-none", className)} {...props} />
	),
);
TableBody.displayName = "TableBody";

const TableRow = forwardRef<HTMLTableRowElement, HTMLAttributes<HTMLTableRowElement>>(
	({ className, ...props }, ref) => (
		<tr
			ref={ref}
			className={cn("transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted", className)}
			{...props}
		/>
	),
);
TableRow.displayName = "TableRow";

const TableHead = forwardRef<HTMLTableCellElement, ThHTMLAttributes<HTMLTableCellElement>>(
	({ className, ...props }, ref) => (
		<th
			ref={ref}
			className={cn(
				"h-12 px-4 text-left align-middle font-medium text-muted-foreground shadow-[inset_0_-1px_0_var(--color-border)] [&:has([role=checkbox])]:pr-0",
				className,
			)}
			{...props}
		/>
	),
);
TableHead.displayName = "TableHead";

const TableCell = forwardRef<HTMLTableCellElement, TdHTMLAttributes<HTMLTableCellElement>>(
	({ className, ...props }, ref) => (
		<td
			ref={ref}
			className={cn(
				"p-4 align-middle shadow-[inset_0_-1px_0_var(--color-border)] [&:has([role=checkbox])]:pr-0",
				className,
			)}
			{...props}
		/>
	),
);
TableCell.displayName = "TableCell";

export { Table, TableHeader, TableBody, TableRow, TableHead, TableCell };
