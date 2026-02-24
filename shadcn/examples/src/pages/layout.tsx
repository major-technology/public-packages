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
	return `block rounded px-3 py-1.5 text-sm hover:bg-accent ${isActive ? "bg-accent font-medium" : ""}`;
}

export default function Layout() {
	return (
		<div className="flex h-screen">
			<nav className="w-56 shrink-0 border-r p-4 space-y-1 overflow-y-auto">
				<NavLink to="/" end className={({ isActive }) => `block rounded px-3 py-1.5 text-sm font-semibold hover:bg-accent ${isActive ? "bg-accent" : ""}`}>
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
