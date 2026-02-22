import { DataTable, DataTableContent, DataTablePagination } from "@data-table";
import { baseColumns, loadUsers } from "../mock-data";

export default function SortablePage() {
	return (
		<div className="space-y-4">
			<div>
				<h1 className="text-xl font-semibold">Sortable</h1>
				<p className="text-sm text-muted-foreground">Click column headers to sort.</p>
			</div>

			<DataTable onLoadRows={loadUsers} columns={baseColumns} pageSize={50}>
				<DataTableContent />
				<DataTablePagination pageSizeOptions={[10, 25, 50]} />
			</DataTable>
		</div>
	);
}
