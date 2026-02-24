import {
	DataTable,
	DataTableContent,
	DataTablePagination,
	DataTableToolbar,
	DataTableSearch,
	DataTableFilters,
} from "@data-table";
import { baseColumns, userFilterDefinitions, ALL_USERS } from "../mock-data";

export default function BasicPage() {
	return (
		<div className="space-y-4">
			<div>
				<h1 className="text-xl font-semibold">Client-Side</h1>
				<p className="text-sm text-muted-foreground">
					All sorting, filtering, search, and pagination happen in the browser. No server requests.
				</p>
			</div>

			<DataTable data={ALL_USERS} columns={baseColumns} pageSize={25}>
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
