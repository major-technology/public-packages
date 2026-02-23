"use client";

import type { MouseEvent, ReactNode } from "react";
import type { ColumnDef, Row } from "@tanstack/react-table";
import { ChevronRightIcon, EllipsisVerticalIcon } from "lucide-react";

import { cn } from "../../lib/utils";
import { Button } from "../../primitives/button";
import { Checkbox } from "../../primitives/checkbox";
import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
} from "../../primitives/dropdown-menu";
import { SELECT_COLUMN_ID, EXPAND_COLUMN_ID, ACTIONS_COLUMN_ID } from "../constants";
import { useDataTableActions, type DataTableActions } from "../context";

const SELECT_COLUMN_SIZE = 40;
const EXPAND_COLUMN_SIZE = 40;

interface IndeterminateCheckboxProps {
	checked: boolean;
	indeterminate?: boolean;
	onChange: (e: unknown) => void;
	disabled?: boolean;
	onClick?: (e: MouseEvent) => void;
}

function IndeterminateCheckbox({ checked, indeterminate, onChange, disabled, onClick }: IndeterminateCheckboxProps) {
	return (
		<Checkbox
			checked={indeterminate ? "indeterminate" : checked}
			disabled={disabled}
			onCheckedChange={(value) => onChange({ target: { checked: !!value } })}
			onClick={onClick}
		/>
	);
}

/**
 * Creates a select column with a header checkbox and row checkboxes.
 * Add this as the first column definition to enable row selection.
 */
export function createSelectColumn<TData>(): ColumnDef<TData, unknown> {
	return {
		id: SELECT_COLUMN_ID,
		header: ({ table }) => (
			<div className="flex items-center justify-center">
				<IndeterminateCheckbox
					checked={table.getIsAllPageRowsSelected()}
					indeterminate={table.getIsSomePageRowsSelected()}
					onChange={table.getToggleAllPageRowsSelectedHandler()}
				/>
			</div>
		),
		cell: ({ row }) => (
			<div className="flex items-center justify-center">
				<IndeterminateCheckbox
					checked={row.getIsSelected()}
					disabled={!row.getCanSelect()}
					onChange={row.getToggleSelectedHandler()}
					onClick={(e) => e.stopPropagation()}
				/>
			</div>
		),
		enableSorting: false,
		enableHiding: false,
		enableResizing: false,
		size: SELECT_COLUMN_SIZE,
		minSize: SELECT_COLUMN_SIZE,
	};
}

/**
 * Creates an expand column with a toggle button.
 * Add this as the first (or second, after select) column definition
 * and provide `renderExpandedRow` on DataTableContent to enable expandable rows.
 */
export function createExpandColumn<TData>(): ColumnDef<TData, unknown> {
	return {
		id: EXPAND_COLUMN_ID,
		header: () => null,
		cell: ({ row }) => (
			<div className="flex items-center justify-center">
				<Button
					variant="ghost"
					size="icon-sm"
					className="h-6 w-6"
					onClick={(e) => {
						e.stopPropagation();
						row.toggleExpanded();
					}}
				>
					<ChevronRightIcon
						className={cn("size-4 text-muted-foreground transition-transform", row.getIsExpanded() && "rotate-90")}
					/>
				</Button>
			</div>
		),
		enableSorting: false,
		enableHiding: false,
		enableResizing: false,
		size: EXPAND_COLUMN_SIZE,
		minSize: EXPAND_COLUMN_SIZE,
	};
}

const ACTIONS_COLUMN_SIZE = 48;

export interface ActionItem<TData> {
	label: string;
	onSelect: (row: TData, actions: DataTableActions<TData>) => void;
	variant?: "default" | "destructive";
	disabled?: boolean;
	icon?: ReactNode;
}

export interface ActionSeparator {
	type: "separator";
}

export type ActionDefinition<TData> = ActionItem<TData> | ActionSeparator;

/**
 * Creates an actions column with a three-dot dropdown menu.
 * Add this as the last column definition.
 *
 * The `getActions` callback receives the row data and returns an array of action items.
 * Each `onSelect` receives the row data and a `DataTableActions` object with `reloadPage`,
 * `updateRow`, and `removeRow` for optimistic data mutations.
 * Use `{ type: "separator" }` to add visual separators between groups of actions.
 *
 * ```tsx
 * createActionsColumn<User>((row) => [
 *   { label: "Edit", onSelect: (r) => router.push(`/users/${r.id}/edit`) },
 *   { label: "Copy ID", onSelect: (r) => navigator.clipboard.writeText(r.id) },
 *   { type: "separator" },
 *   {
 *     label: "Delete",
 *     variant: "destructive",
 *     onSelect: async (r, { removeRow }) => {
 *       await api.deleteUser(r.id);
 *       removeRow(r.id);
 *     },
 *   },
 * ])
 * ```
 */
export function createActionsColumn<TData>(
	getActions: (row: TData) => ActionDefinition<TData>[],
): ColumnDef<TData, unknown> {
	return {
		id: ACTIONS_COLUMN_ID,
		header: () => null,
		cell: ({ row }: { row: Row<TData> }) => <ActionsCell row={row} getActions={getActions} />,
		enableSorting: false,
		enableHiding: false,
		enableResizing: false,
		size: ACTIONS_COLUMN_SIZE,
		minSize: ACTIONS_COLUMN_SIZE,
	};
}

interface ActionsCellProps<TData> {
	row: Row<TData>;
	getActions: (row: TData) => ActionDefinition<TData>[];
}

function ActionsCell<TData>({ row, getActions }: ActionsCellProps<TData>) {
	const tableActions = useDataTableActions<TData>();
	const actions = getActions(row.original);

	if (actions.length === 0) {
		return null;
	}

	return (
		<div className="flex items-center justify-center">
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant="ghost" size="icon-sm" className="h-7 w-7" onClick={(e) => e.stopPropagation()}>
						<EllipsisVerticalIcon className="size-4 text-muted-foreground" />
						<span className="sr-only">Actions</span>
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end">
					{actions.map((action, index) => {
						if ("type" in action && action.type === "separator") {
							return <DropdownMenuSeparator key={index} />;
						}

						const item = action as ActionItem<TData>;

						return (
							<DropdownMenuItem
								key={index}
								variant={item.variant}
								disabled={item.disabled}
								onSelect={() => item.onSelect(row.original, tableActions)}
							>
								{item.icon}
								{item.label}
							</DropdownMenuItem>
						);
					})}
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
}
