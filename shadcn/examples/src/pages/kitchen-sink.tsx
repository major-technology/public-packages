import { useState, useMemo, useCallback } from "react";
import type { ColumnDef, Row } from "@tanstack/react-table";
import {
	DataTable,
	DataTableContent,
	DataTablePagination,
	DataTableToolbar,
	DataTableSearch,
	DataTableFilters,
	DataTableColumnToggle,
	DataTableRowSelection,
	createSelectColumn,
	createExpandColumn,
	createActionsColumn,
	Button,
	DataTableExport,
	type ActionDefinition,
} from "@data-table";
import { baseColumns, userFilterDefinitions, loadUsers, type User } from "../mock-data";

function formatUsersCsv(rows: User[]): string {
	const headers = ["Name", "Email", "Role", "Status", "Department"];
	const csvRows = rows.map((u) =>
		[u.name, u.email, u.role, u.status, u.department].map((v) => `"${String(v).replace(/"/g, '""')}"`).join(","),
	);
	return [headers.join(","), ...csvRows].join("\n");
}

/** Simulates a 300ms backend call */
async function mockApiCall<T>(result: T): Promise<T> {
	await new Promise((resolve) => setTimeout(resolve, 300));
	return result;
}

const NEXT_STATUSES: Record<User["status"], User["status"]> = {
	active: "inactive",
	inactive: "pending",
	pending: "active",
};

function ExpandedRowDetail({ row }: { row: Row<User> }) {
	const user = row.original;

	return (
		<div className="p-4 bg-muted/30 space-y-2">
			<p className="text-sm font-medium">{user.name} - Expanded Detail</p>
			<div className="grid grid-cols-3 gap-4 text-sm text-muted-foreground">
				<div><span className="font-medium text-foreground">Email:</span> {user.email}</div>
				<div><span className="font-medium text-foreground">Department:</span> {user.department}</div>
				<div><span className="font-medium text-foreground">Status:</span> {user.status}</div>
			</div>
		</div>
	);
}

interface FeatureFlags {
	rowSelection: boolean;
	rowActions: boolean;
	expandableRows: boolean;
	export: boolean;
	search: boolean;
	filters: boolean;
	columnVisibility: boolean;
	columnReordering: boolean;
	columnResizing: boolean;
	stickyHeader: boolean;
	pagination: boolean;
}

const defaultFlags: FeatureFlags = {
	rowSelection: true,
	rowActions: true,
	export: true,
	expandableRows: true,
	search: true,
	filters: true,
	columnVisibility: true,
	columnReordering: true,
	columnResizing: true,
	stickyHeader: true,
	pagination: true,
};

const featureLabels: Record<keyof FeatureFlags, string> = {
	rowSelection: "Row Selection",
	rowActions: "Row Actions",
	expandableRows: "Expandable Rows",
	export: "Export data",
	search: "Search",
	filters: "Filters",
	columnVisibility: "Column Visibility",
	columnReordering: "Column Reordering",
	columnResizing: "Column Resizing",
	stickyHeader: "Sticky Header",
	pagination: "Pagination",
};

export default function KitchenSinkPage() {
	const [flags, setFlags] = useState<FeatureFlags>(defaultFlags);

	function toggle(key: keyof FeatureFlags) {
		setFlags((prev) => ({ ...prev, [key]: !prev[key] }));
	}

	const getRowActions = useCallback(
		(row: User): ActionDefinition<User>[] => [
			{ label: "View profile", onSelect: () => alert(`Viewing ${row.name}`) },
			{ label: "Copy email", onSelect: (r) => navigator.clipboard.writeText(r.email) },
			{
				label: "Toggle status",
				onSelect: async (r, { updateRow }) => {
					const newStatus = NEXT_STATUSES[r.status];
					const updated = await mockApiCall({ ...r, status: newStatus });
					updateRow(r.id, () => updated);
				},
			},
			{ type: "separator" },
			{
				label: "Delete",
				variant: "destructive",
				onSelect: async (r, { removeRow }) => {
					await mockApiCall(null);
					removeRow(r.id);
				},
			},
		],
		[],
	);

	const tableKey = `${flags.rowSelection}-${flags.expandableRows}-${flags.rowActions}`;

	const columns = useMemo<ColumnDef<User, unknown>[]>(() => {
		const cols: ColumnDef<User, unknown>[] = [];

		if (flags.rowSelection) {
			cols.push(createSelectColumn<User>());
		}

		if (flags.expandableRows) {
			cols.push(createExpandColumn<User>());
		}

		cols.push(...baseColumns);

		if (flags.rowActions) {
			cols.push(createActionsColumn<User>(getRowActions));
		}

		return cols;
	}, [flags.rowSelection, flags.expandableRows, flags.rowActions, getRowActions]);

	const hasToolbar = flags.search || flags.filters || flags.columnVisibility || flags.export;

	return (
		<div className="space-y-4">
			<div>
				<h1 className="text-xl font-semibold">Kitchen Sink</h1>
				<p className="text-sm text-muted-foreground">Toggle features on/off.</p>
			</div>

			<div className="flex flex-wrap gap-x-4 gap-y-2">
				{(Object.keys(featureLabels) as (keyof FeatureFlags)[]).map((key) => (
					<label key={key} className="inline-flex cursor-pointer items-center gap-1.5 text-sm">
						<input
							type="checkbox"
							checked={flags[key]}
							onChange={() => toggle(key)}
							className="h-3.5 w-3.5 cursor-pointer rounded border-gray-300"
						/>
						{featureLabels[key]}
					</label>
				))}
			</div>

			<DataTable
				key={tableKey}
				onLoadRows={loadUsers}
				columns={columns}
				getRowId={(row) => row.id}
				pageSize={50}
				enableColumnReordering={flags.columnReordering}
				enableColumnResizing={flags.columnResizing}
			>
				{hasToolbar && (
					<DataTableToolbar>
						{flags.search && <DataTableSearch placeholder="Search all columns..." />}
						<div className="flex-1" />
						{flags.filters && <DataTableFilters filters={userFilterDefinitions} />}
						{flags.columnVisibility && <DataTableColumnToggle />}
						{flags.export && (
							<DataTableExport<User>
								formatRows={formatUsersCsv}
								filename="users-export.csv"
								onExportAll={async () => {
									await new Promise((resolve) => setTimeout(resolve, 1500));
									alert("Server-side export triggered (demo)");
								}}
							/>
						)}
					</DataTableToolbar>
				)}

				{flags.rowSelection && (
					<DataTableRowSelection<User>>
						{(selectedRows) => (
							<>
								<Button
									variant="outline"
									size="sm"
									onClick={() => {
										const headers = ["Name", "Email", "Role", "Status", "Department"];
										const csvRows = selectedRows.map((r) => {
											const u = r.original;
											return [u.name, u.email, u.role, u.status, u.department]
												.map((v) => `"${String(v).replace(/"/g, '""')}"`)
												.join(",");
										});
										const csv = [headers.join(","), ...csvRows].join("\n");
										const blob = new Blob([csv], { type: "text/csv" });
										const url = URL.createObjectURL(blob);
										const a = document.createElement("a");
										a.href = url;
										a.download = "users-export.csv";
										a.click();
										URL.revokeObjectURL(url);
									}}
								>
									Export CSV
								</Button>
								<Button variant="destructive" size="sm" onClick={() => alert(`Deleting ${selectedRows.length} row(s)`)}>
									Delete
								</Button>
							</>
						)}
					</DataTableRowSelection>
				)}

				<DataTableContent<User>
					renderExpandedRow={flags.expandableRows ? (row) => <ExpandedRowDetail row={row} /> : undefined}
					stickyHeader={flags.stickyHeader}
					maxHeight={flags.stickyHeader ? 500 : undefined}
				/>

				{flags.pagination && <DataTablePagination pageSizeOptions={[10, 25, 50]} />}
			</DataTable>
		</div>
	);
}
