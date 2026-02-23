import {
	DataTable,
	DataTableContent,
	DataTablePagination,
	DataTableToolbar,
	DataTableColumnToggle,
} from "@data-table";
import { baseColumns, loadUsers } from "../mock-data";

export default function ColumnVisibilityPage() {
	return (
		<div className="space-y-4">
			<div>
				<h1 className="text-xl font-semibold">Column Visibility</h1>
				<p className="text-sm text-muted-foreground">Toggle columns on and off using the Columns dropdown.</p>
			</div>

			<DataTable onLoadRows={loadUsers} columns={baseColumns} pageSize={50}>
				<DataTableToolbar>
					<div className="flex-1" />
					<DataTableColumnToggle />
				</DataTableToolbar>
				<DataTableContent />
				<DataTablePagination pageSizeOptions={[10, 25, 50]} />
			</DataTable>
		</div>
	);
}
