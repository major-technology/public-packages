import { useMemo } from "react";
import type { ColumnDef, Row } from "@tanstack/react-table";
import {
	DataTable,
	DataTableContent,
	DataTableSearch,
	DataTableToolbar,
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
			</div>
		</div>
	);
}

export default function VirtualizedPage() {
	const columns = useMemo<ColumnDef<User, unknown>[]>(
		() => [createExpandColumn<User>(), ...baseColumns],
		[],
	);

	return (
		<div className="space-y-4">
			<div>
				<h1 className="text-xl font-semibold">Virtualized</h1>
				<p className="text-sm text-muted-foreground">
					Row virtualization with infinite scroll. Only ~20-30 rows are in the DOM at any time.
					Expand rows to verify the virtualizer re-measures height correctly.
				</p>
			</div>

			<DataTable onLoadRows={loadUsers} columns={columns} getRowId={(row) => row.id} pageSize={100}>
				<DataTableToolbar>
					<DataTableSearch />
				</DataTableToolbar>
				<DataTableContent<User>
					virtualized
					estimateRowHeight={48}
					overscan={10}
					stickyHeader
					maxHeight={600}
					renderExpandedRow={(row) => <ExpandedRowDetail row={row} />}
				/>
			</DataTable>
		</div>
	);
}
