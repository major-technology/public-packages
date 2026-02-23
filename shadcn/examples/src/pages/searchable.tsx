import {
	DataTable,
	DataTableContent,
	DataTablePagination,
	DataTableToolbar,
	DataTableSearch,
	DataTableFilters,
} from "@data-table";
import { baseColumns, userFilterDefinitions, loadUsers } from "../mock-data";

export default function SearchablePage() {
	return (
		<div className="space-y-4">
			<div>
				<h1 className="text-xl font-semibold">Search & Filter</h1>
				<p className="text-sm text-muted-foreground">
					Global search and dynamic column filters. Click &quot;Filters&quot; to add filters by column type:
					select, text, number range, date range, and boolean.
				</p>
			</div>

			<DataTable onLoadRows={loadUsers} columns={baseColumns} pageSize={50}>
				<DataTableToolbar>
					<DataTableSearch placeholder="Search users..." />
					<DataTableFilters filters={userFilterDefinitions} />
				</DataTableToolbar>
				<DataTableContent />
				<DataTablePagination pageSizeOptions={[10, 25, 50]} />
			</DataTable>
		</div>
	);
}
