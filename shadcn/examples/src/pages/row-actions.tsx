import { useMemo } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import {
	DataTable,
	DataTableContent,
	DataTablePagination,
	createActionsColumn,
} from "@data-table";
import { baseColumns, loadUsers, type User } from "../mock-data";

export default function RowActionsPage() {
	const columns = useMemo<ColumnDef<User, unknown>[]>(
		() => [
			...baseColumns,
			createActionsColumn<User>((row) => [
				{ label: "View profile", onSelect: () => alert(`Viewing ${row.name}`) },
				{ label: "Copy email", onSelect: (r) => navigator.clipboard.writeText(r.email) },
				{ label: "Edit", onSelect: () => alert(`Editing ${row.name}`) },
				{ type: "separator" },
				{ label: "Delete", onSelect: () => alert(`Deleting ${row.name}`), variant: "destructive" },
			]),
		],
		[],
	);

	return (
		<div className="space-y-4">
			<div>
				<h1 className="text-xl font-semibold">Row Actions</h1>
				<p className="text-sm text-muted-foreground">
					Three-dot dropdown menu per row with contextual actions. Supports separators and destructive variants.
				</p>
			</div>

			<DataTable onLoadRows={loadUsers} columns={columns} getRowId={(row) => row.id} pageSize={50}>
				<DataTableContent />
				<DataTablePagination pageSizeOptions={[10, 25, 50]} />
			</DataTable>
		</div>
	);
}
