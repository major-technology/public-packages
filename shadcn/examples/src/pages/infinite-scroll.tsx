import { DataTable, DataTableContent, DataTableInfiniteScroll } from "@data-table";
import { baseColumns, loadUsers } from "../mock-data";

export default function InfiniteScrollPage() {
	return (
		<div className="space-y-4">
			<div>
				<h1 className="text-xl font-semibold">Infinite Scroll</h1>
				<p className="text-sm text-muted-foreground">
					Page-based infinite loading fetching 50 rows at a time. Scroll to the bottom to load more.
				</p>
			</div>

			<DataTable onLoadRows={loadUsers} columns={baseColumns} pageSize={50}>
				<DataTableContent />
				<DataTableInfiniteScroll />
			</DataTable>
		</div>
	);
}
