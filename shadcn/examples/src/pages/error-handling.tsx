import { DataTable, DataTableContent, DataTableInfiniteScroll, DataTablePagination } from "@data-table";
import { baseColumns, loadUsersWithErrorOnPage3, loadUsersWithErrorOnFirstPage } from "../mock-data";

export default function ErrorHandlingPage() {
	return (
		<div className="space-y-8">
			<div>
				<h1 className="text-xl font-semibold">Error Handling</h1>
				<p className="text-sm text-muted-foreground">Demonstrates error states during data loading.</p>
			</div>

			<div className="space-y-4">
				<div>
					<h2 className="text-lg font-medium">First Page Error</h2>
					<p className="text-sm text-muted-foreground">
						The first page fails to load. An error state is shown with a retry button.
					</p>
				</div>

				<DataTable
					onLoadRows={loadUsersWithErrorOnFirstPage}
					columns={baseColumns}
					pageSize={50}
					onError={(error) => alert(error.message)}
				>
					<DataTableContent />
					<DataTablePagination />
				</DataTable>
			</div>

			<div className="space-y-4">
				<div>
					<h2 className="text-lg font-medium">Mid-Stream Error (Infinite Scroll)</h2>
					<p className="text-sm text-muted-foreground">
						Pages 0-2 load successfully, page 3 fails. The table keeps existing data.
					</p>
				</div>

				<DataTable
					onLoadRows={loadUsersWithErrorOnPage3}
					columns={baseColumns}
					pageSize={50}
					onError={(error) => alert(error.message)}
				>
					<DataTableContent />
					<DataTableInfiniteScroll />
				</DataTable>
			</div>
		</div>
	);
}
