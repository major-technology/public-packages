import { Link } from "react-router-dom";

const demos = [
	{ to: "/basic", label: "Basic Table", description: "Static data with columns and rows." },
	{ to: "/sortable", label: "Sortable", description: "Click column headers to sort." },
	{ to: "/searchable", label: "Search & Filter", description: "Global search and faceted column filters." },
	{ to: "/paginated", label: "Paginated", description: "Offset pagination with page size selector." },
	{ to: "/infinite-scroll", label: "Infinite Scroll", description: "Loads more rows as you scroll." },
	{ to: "/row-selection", label: "Row Selection", description: "Checkboxes with bulk action bar." },
	{ to: "/row-actions", label: "Row Actions", description: "Three-dot dropdown menu with contextual actions per row." },
	{ to: "/data-export", label: "Data Export", description: "Export current page or selected rows as CSV." },
	{ to: "/expandable", label: "Expandable Rows", description: "Click to reveal row detail panels." },
	{ to: "/column-visibility", label: "Column Visibility", description: "Toggle columns on/off." },
	{ to: "/column-reordering", label: "Column Reordering", description: "Drag column headers to rearrange order." },
	{ to: "/server-side", label: "Server-Side", description: "Sorting, filtering, and pagination via mock API." },
	{ to: "/error-handling", label: "Error Handling", description: "Simulated server error on page 3." },
	{ to: "/virtualized", label: "Virtualized", description: "Row virtualization for large datasets." },
	{ to: "/kitchen-sink", label: "Kitchen Sink", description: "All features combined." },
];

export default function OverviewPage() {
	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-2xl font-bold">DataTable Showcase</h1>
				<p className="text-muted-foreground mt-1">
					All configurations of the DataTable component. Select a demo from the sidebar.
				</p>
			</div>

			<div className="grid gap-3 sm:grid-cols-2">
				{demos.map((demo) => (
					<Link key={demo.to} to={demo.to} className="rounded-md border p-4 hover:bg-accent transition-colors">
						<p className="font-medium text-sm">{demo.label}</p>
						<p className="text-xs text-muted-foreground mt-0.5">{demo.description}</p>
					</Link>
				))}
			</div>
		</div>
	);
}
