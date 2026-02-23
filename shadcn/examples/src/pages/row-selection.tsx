import { useMemo } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import {
	DataTable,
	DataTableContent,
	DataTableRowSelection,
	DataTablePagination,
	createSelectColumn,
	Button,
} from "@data-table";
import { baseColumns, loadUsers, type User } from "../mock-data";

export default function RowSelectionPage() {
	const columns = useMemo<ColumnDef<User, unknown>[]>(
		() => [createSelectColumn<User>(), ...baseColumns],
		[],
	);

	return (
		<div className="space-y-4">
			<div>
				<h1 className="text-xl font-semibold">Row Selection</h1>
				<p className="text-sm text-muted-foreground">
					Select rows with checkboxes. The bulk action bar appears when rows are selected.
				</p>
			</div>

			<DataTable onLoadRows={loadUsers} columns={columns} getRowId={(row) => row.id} pageSize={50}>
				<DataTableRowSelection<User>>
					{(selectedRows) => (
						<>
							<Button
								variant="outline"
								size="sm"
								onClick={() => {
									const headers = ["Name", "Email", "Role", "Status", "Department"];
									const csvRows = selectedRows.map((r) => {
										const u = r.original;
										return [u.name, u.email, u.role, u.status, u.department].map((v) => `"${String(v).replace(/"/g, '""')}"`).join(",");
									});
									const csv = [headers.join(","), ...csvRows].join("\n");
									const blob = new Blob([csv], { type: "text/csv" });
									const url = URL.createObjectURL(blob);
									const a = document.createElement("a");
									a.href = url;
									a.download = "users-export.csv";
									a.click();
									URL.revokeObjectURL(url);
								}}
							>
								Export CSV
							</Button>
							<Button
								variant="destructive"
								size="sm"
								onClick={() => alert(`Deleting ${selectedRows.length} row(s)`)}
							>
								Delete
							</Button>
						</>
					)}
				</DataTableRowSelection>
				<DataTableContent />
				<DataTablePagination pageSizeOptions={[10, 25, 50]} />
			</DataTable>
		</div>
	);
}
