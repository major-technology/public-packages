import { useMemo } from "react";
import type { ColumnDef, Row } from "@tanstack/react-table";
import {
	DataTable,
	DataTableContent,
	DataTablePagination,
	createExpandColumn,
} from "@data-table";
import { baseColumns, loadUsers, type User } from "../mock-data";

function ExpandedRowDetail({ row }: { row: Row<User> }) {
	const user = row.original;

	return (
		<div className="p-4 bg-muted/30 space-y-2">
			<p className="text-sm font-medium">Details for {user.name}</p>
			<div className="grid grid-cols-3 gap-4 text-sm text-muted-foreground">
				<div><span className="font-medium text-foreground">Email:</span> {user.email}</div>
				<div><span className="font-medium text-foreground">Role:</span> {user.role}</div>
				<div><span className="font-medium text-foreground">Department:</span> {user.department}</div>
				<div><span className="font-medium text-foreground">Status:</span> {user.status}</div>
				<div><span className="font-medium text-foreground">Created:</span> {user.createdAt}</div>
				<div><span className="font-medium text-foreground">ID:</span> {user.id}</div>
			</div>
		</div>
	);
}

export default function ExpandablePage() {
	const columns = useMemo<ColumnDef<User, unknown>[]>(
		() => [createExpandColumn<User>(), ...baseColumns],
		[],
	);

	return (
		<div className="space-y-4">
			<div>
				<h1 className="text-xl font-semibold">Expandable Rows</h1>
				<p className="text-sm text-muted-foreground">Click the arrow to reveal a detail panel below each row.</p>
			</div>

			<DataTable onLoadRows={loadUsers} columns={columns} getRowId={(row) => row.id} pageSize={50}>
				<DataTableContent<User> renderExpandedRow={(row) => <ExpandedRowDetail row={row} />} />
				<DataTablePagination pageSizeOptions={[10, 25, 50]} />
			</DataTable>
		</div>
	);
}
