import {
	DataTable,
	DataTableContent,
	DataTablePagination,
	DataTableToolbar,
	DataTableSearch,
	DataTableFilters,
} from "@data-table";
import { baseColumns, userFilterDefinitions, loadUsers } from "../mock-data";

export default function ServerSidePage() {
	return (
		<div className="space-y-4">
			<div>
				<h1 className="text-xl font-semibold">Server-Side</h1>
				<p className="text-sm text-muted-foreground">
					Sorting, filtering, search, and pagination all happen server-side. 50 rows per page with 300ms simulated latency.
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
