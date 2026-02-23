import { DataTable, DataTableContent, DataTablePagination } from "@data-table";
import { baseColumns, loadUsers } from "../mock-data";

export default function ColumnReorderingPage() {
	return (
		<div className="space-y-4">
			<div>
				<h1 className="text-xl font-semibold">Column Reordering</h1>
				<p className="text-sm text-muted-foreground">
					Drag column headers to reorder them. The grip icon indicates draggable columns.
				</p>
			</div>

			<DataTable onLoadRows={loadUsers} columns={baseColumns} enableColumnReordering pageSize={50}>
				<DataTableContent />
				<DataTablePagination pageSizeOptions={[10, 25, 50]} />
			</DataTable>
		</div>
	);
}
