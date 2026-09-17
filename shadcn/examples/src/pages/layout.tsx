import clsx from "clsx";
import { NavLink, Outlet } from "react-router-dom";

const demos = [
	{ to: "/basic", label: "Client-Side" },
	{ to: "/sortable", label: "Sortable" },
	{ to: "/searchable", label: "Search & Filter" },
	{ to: "/paginated", label: "Paginated" },
	{ to: "/infinite-scroll", label: "Infinite Scroll" },
	{ to: "/row-selection", label: "Row Selection" },
	{ to: "/row-actions", label: "Row Actions" },
	{ to: "/data-export", label: "Data Export" },
	{ to: "/expandable", label: "Expandable" },
	{ to: "/column-visibility", label: "Column Visibility" },
	{ to: "/column-reordering", label: "Column Reordering" },
	{ to: "/error-handling", label: "Error Handling" },
	{ to: "/virtualized", label: "Virtualized" },
	{ to: "/kitchen-sink", label: "Kitchen Sink" },
];

function linkClass({ isActive }: { isActive: boolean }) {
	return clsx("block rounded px-3 py-1.5 text-sm hover:bg-accent", isActive && "bg-accent font-medium");
}

// Set by vite.config.ts. "installed" means the demos are running against examples/consumer —
// the copy `shadcn add` produced from the built registry — rather than the registry source.
const dataTableSource = import.meta.env.VITE_DATA_TABLE_SOURCE ?? "source";

function SourceBadge() {
	const installed = dataTableSource === "installed";

	return (
		<div
			className={clsx("mb-3 rounded px-2 py-1 text-xs font-medium", installed ? "bg-emerald-100 text-emerald-900" : "bg-muted text-muted-foreground")}
			title={
				installed
					? "Running the copy shadcn add installed from registry/output"
					: "Running registry/default/data-table directly. Use pnpm dev:installed for the consumer build."
			}
		>
			{installed ? "installed from registry" : "registry source"}
		</div>
	);
}

export default function Layout() {
	return (
		<div className="flex h-screen">
			<nav className="w-56 shrink-0 border-r p-4 space-y-1 overflow-y-auto">
				<SourceBadge />
				<NavLink
					to="/"
					end
					className={({ isActive }) => clsx("block rounded px-3 py-1.5 text-sm font-semibold hover:bg-accent", isActive && "bg-accent")}
				>
					Overview
				</NavLink>
				<div className="pt-2">
					{demos.map((demo) => (
						<NavLink key={demo.to} to={demo.to} className={linkClass}>
							{demo.label}
						</NavLink>
					))}
				</div>
			</nav>
			<main className="flex-1 overflow-y-auto p-8">
				<div className="mx-auto max-w-5xl">
					<Outlet />
				</div>
			</main>
		</div>
	);
}
