import { DataTable, DataTableContent } from "@data-table";
import { baseColumns, loadUsers } from "../mock-data";

export default function BasicPage() {
	return (
		<div className="space-y-4">
			<div>
				<h1 className="text-xl font-semibold">Basic Table</h1>
				<p className="text-sm text-muted-foreground">Static data with columns and rows.</p>
			</div>

			<DataTable onLoadRows={loadUsers} columns={baseColumns} pageSize={5}>
				<DataTableContent />
			</DataTable>
		</div>
	);
}
