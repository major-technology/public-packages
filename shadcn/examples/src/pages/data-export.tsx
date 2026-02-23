import { useMemo } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import {
	DataTable,
	DataTableContent,
	DataTablePagination,
	DataTableToolbar,
	DataTableSearch,
	DataTableFilters,
	DataTableExport,
	DataTableRowSelection,
	createSelectColumn,
	Button,
} from "@data-table";
import { baseColumns, userFilterDefinitions, loadUsers, type User } from "../mock-data";

function formatUsersCsv(rows: User[]): string {
	const headers = ["Name", "Email", "Role", "Status", "Department", "Created"];
	const csvRows = rows.map((u) =>
		[u.name, u.email, u.role, u.status, u.department, u.createdAt]
			.map((v) => `"${String(v).replace(/"/g, '""')}"`)
			.join(","),
	);
	return [headers.join(","), ...csvRows].join("\n");
}

export default function DataExportPage() {
	const columns = useMemo<ColumnDef<User, unknown>[]>(() => [createSelectColumn<User>(), ...baseColumns], []);

	return (
		<div className="space-y-4">
			<div>
				<h1 className="text-xl font-semibold">Data Export</h1>
				<p className="text-sm text-muted-foreground">
					Export data as CSV. Use the toolbar button to export the current page, or select specific rows for a targeted export.
				</p>
			</div>

			<DataTable onLoadRows={loadUsers} columns={columns} getRowId={(row) => row.id} pageSize={25}>
				<DataTableToolbar>
					<DataTableSearch placeholder="Search users..." />
					<div className="flex-1" />
					<DataTableFilters filters={userFilterDefinitions} />
					<DataTableExport<User>
						formatRows={formatUsersCsv}
						filename="users-page-export.csv"
						onExportAll={async () => {
							await new Promise((resolve) => setTimeout(resolve, 1500));
							alert("Server-side export triggered (demo). Use downloadFile() to call your export endpoint.");
						}}
					/>
				</DataTableToolbar>

				<DataTableRowSelection<User>>
					{(selectedRows) => (
						<Button
							variant="outline"
							size="sm"
							onClick={() => {
								const csv = formatUsersCsv(selectedRows.map((r) => r.original));
								const blob = new Blob([csv], { type: "text/csv" });
								const url = URL.createObjectURL(blob);
								const a = document.createElement("a");
								a.href = url;
								a.download = "users-selected-export.csv";
								a.click();
								URL.revokeObjectURL(url);
							}}
						>
							Export selected ({selectedRows.length})
						</Button>
					)}
				</DataTableRowSelection>

				<DataTableContent />
				<DataTablePagination pageSizeOptions={[10, 25, 50]} />
			</DataTable>
		</div>
	);
}
