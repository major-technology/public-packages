import type { ColumnDef } from "@tanstack/react-table";
import type { DataTableLoadRowsFn, DataTableFilterDefinition } from "@data-table";
import { buildRequestSearchParams } from "@data-table";

export interface User {
	id: string;
	name: string;
	email: string;
	role: "admin" | "editor" | "viewer";
	status: "active" | "inactive" | "pending";
	createdAt: string;
	department: string;
	score: number;
	verified: boolean;
}

export const baseColumns: ColumnDef<User, unknown>[] = [
	{ accessorKey: "name", header: "Name" },
	{ accessorKey: "email", header: "Email" },
	{ accessorKey: "role", header: "Role" },
	{ accessorKey: "status", header: "Status" },
	{ accessorKey: "department", header: "Department" },
	{ accessorKey: "score", header: "Score" },
	{
		accessorKey: "verified",
		header: "Verified",
		cell: ({ getValue }) => ((getValue() as boolean) ? "Yes" : "No"),
	},
	{ accessorKey: "createdAt", header: "Created" },
];

export const roleFilterOptions = [
	{ label: "Admin", value: "admin" },
	{ label: "Editor", value: "editor" },
	{ label: "Viewer", value: "viewer" },
];

export const statusFilterOptions = [
	{ label: "Active", value: "active" },
	{ label: "Inactive", value: "inactive" },
	{ label: "Pending", value: "pending" },
];

export const departmentFilterOptions = [
	{ label: "Engineering", value: "Engineering" },
	{ label: "Marketing", value: "Marketing" },
	{ label: "Sales", value: "Sales" },
	{ label: "Design", value: "Design" },
	{ label: "Product", value: "Product" },
	{ label: "Support", value: "Support" },
];

export const userFilterDefinitions: DataTableFilterDefinition[] = [
	{ columnId: "role", title: "Role", type: "select", options: roleFilterOptions },
	{ columnId: "status", title: "Status", type: "select", options: statusFilterOptions },
	{ columnId: "department", title: "Department", type: "select", options: departmentFilterOptions },
	{ columnId: "name", title: "Name", type: "text" },
	{ columnId: "score", title: "Score", type: "number" },
	{ columnId: "createdAt", title: "Created", type: "date" },
	{ columnId: "verified", title: "Verified", type: "boolean" },
];

// ---------------------------------------------------------------------------
// In-memory mock data (500 users)
// ---------------------------------------------------------------------------

const firstNames = [
	"Alice", "Bob", "Charlie", "Diana", "Eve", "Frank", "Grace", "Hank", "Ivy", "Jack",
	"Karen", "Leo", "Mona", "Nate", "Olivia", "Paul", "Quinn", "Rosa", "Sam", "Tina",
];

const lastNames = [
	"Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Wilson", "Moore",
	"Taylor", "Anderson", "Thomas", "Jackson", "White", "Harris", "Martin", "Clark", "Lewis", "Walker",
];

const roles: User["role"][] = ["admin", "editor", "viewer"];
const statuses: User["status"][] = ["active", "inactive", "pending"];
const departments = ["Engineering", "Design", "Marketing", "Sales", "Support", "Product"];

const ALL_USERS: User[] = Array.from({ length: 500 }, (_, i) => {
	const firstName = firstNames[i % firstNames.length]!;
	const lastName = lastNames[Math.floor(i / firstNames.length) % lastNames.length]!;
	const suffix = i >= firstNames.length * lastNames.length ? `${Math.floor(i / (firstNames.length * lastNames.length)) + 1}` : "";

	return {
		id: `user-${i + 1}`,
		name: `${firstName} ${lastName}${suffix ? ` ${suffix}` : ""}`,
		email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${suffix}@example.com`,
		role: roles[i % roles.length]!,
		status: statuses[i % statuses.length]!,
		createdAt: new Date(2024, 0, 1 + (i % 365)).toISOString().split("T")[0]!,
		department: departments[i % departments.length]!,
		score: Math.round((i * 7 + 13) % 100),
		verified: i % 3 !== 0,
	};
});

// ---------------------------------------------------------------------------
// Filter helpers (mirrors the server-side route logic)
// ---------------------------------------------------------------------------

function applyTextFilter(rows: User[], field: keyof User, params: URLSearchParams, paramName: string): User[] {
	const value = params.get(paramName);
	if (!value) { return rows; }

	const op = params.get(`${paramName}_op`) ?? "contains";
	const q = value.toLowerCase();

	switch (op) {
		case "equals": return rows.filter((u) => String(u[field]).toLowerCase() === q);
		case "contains": return rows.filter((u) => String(u[field]).toLowerCase().includes(q));
		case "starts_with": return rows.filter((u) => String(u[field]).toLowerCase().startsWith(q));
		case "ends_with": return rows.filter((u) => String(u[field]).toLowerCase().endsWith(q));
		case "not_equals": return rows.filter((u) => String(u[field]).toLowerCase() !== q);
		default: return rows;
	}
}

function applySelectFilter(rows: User[], field: keyof User, params: URLSearchParams, paramName: string): User[] {
	const value = params.get(paramName);
	if (!value) { return rows; }

	const values = value.split(",");
	return rows.filter((u) => values.includes(String(u[field])));
}

function applyNumberFilter(rows: User[], field: keyof User, params: URLSearchParams, paramName: string): User[] {
	const op = params.get(`${paramName}_op`) ?? "eq";

	if (op === "range") {
		const min = params.get(`${paramName}_min`);
		const max = params.get(`${paramName}_max`);
		let filtered = rows;
		if (min) { filtered = filtered.filter((u) => (u[field] as number) >= Number(min)); }
		if (max) { filtered = filtered.filter((u) => (u[field] as number) <= Number(max)); }
		return filtered;
	}

	const value = params.get(paramName);
	if (!value) { return rows; }
	const num = Number(value);

	switch (op) {
		case "eq": return rows.filter((u) => (u[field] as number) === num);
		case "lt": return rows.filter((u) => (u[field] as number) < num);
		case "gt": return rows.filter((u) => (u[field] as number) > num);
		case "neq": return rows.filter((u) => (u[field] as number) !== num);
		default: return rows;
	}
}

function applyDateFilter(rows: User[], field: keyof User, params: URLSearchParams, paramName: string): User[] {
	const op = params.get(`${paramName}_op`) ?? "eq";

	if (op === "range") {
		const from = params.get(`${paramName}_from`);
		const to = params.get(`${paramName}_to`);
		let filtered = rows;
		if (from) { filtered = filtered.filter((u) => String(u[field]) >= from); }
		if (to) { filtered = filtered.filter((u) => String(u[field]) <= to); }
		return filtered;
	}

	const value = params.get(paramName);
	if (!value) { return rows; }

	switch (op) {
		case "eq": return rows.filter((u) => String(u[field]) === value);
		case "before": return rows.filter((u) => String(u[field]) < value);
		case "after": return rows.filter((u) => String(u[field]) > value);
		case "neq": return rows.filter((u) => String(u[field]) !== value);
		default: return rows;
	}
}

function applyBooleanFilter(rows: User[], field: keyof User, params: URLSearchParams, paramName: string): User[] {
	const value = params.get(paramName);
	if (value === null) { return rows; }
	return rows.filter((u) => u[field] === (value === "true"));
}

/** In-memory mock that simulates server-side filtering, sorting, and pagination. */
function mockFetch(searchParams: URLSearchParams, errorOnPage?: string) {
	const page = parseInt(searchParams.get("page") ?? "0", 10);
	const pageSize = parseInt(searchParams.get("pageSize") ?? "50", 10);
	const sortBy = searchParams.get("sortBy");
	const sortDesc = searchParams.get("sortDesc") === "true";
	const search = searchParams.get("search") ?? "";

	if (errorOnPage && page === parseInt(errorOnPage, 10)) {
		return { success: false as const, error: { code: "SIMULATED_ERROR", message: `Server error loading page ${page}. Please try again.` } };
	}

	let result = [...ALL_USERS];

	if (search) {
		const q = search.toLowerCase();
		result = result.filter(
			(u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.department.toLowerCase().includes(q),
		);
	}

	result = applySelectFilter(result, "role", searchParams, "role");
	result = applySelectFilter(result, "status", searchParams, "status");
	result = applySelectFilter(result, "department", searchParams, "department");
	result = applyTextFilter(result, "name", searchParams, "name");
	result = applyNumberFilter(result, "score", searchParams, "score");
	result = applyDateFilter(result, "createdAt", searchParams, "createdAt");
	result = applyBooleanFilter(result, "verified", searchParams, "verified");

	if (sortBy) {
		result.sort((a, b) => {
			const aVal = a[sortBy as keyof User];
			const bVal = b[sortBy as keyof User];

			if (typeof aVal === "number" && typeof bVal === "number") {
				return sortDesc ? bVal - aVal : aVal - bVal;
			}

			if (typeof aVal === "boolean" && typeof bVal === "boolean") {
				return sortDesc ? Number(bVal) - Number(aVal) : Number(aVal) - Number(bVal);
			}

			return sortDesc ? String(bVal).localeCompare(String(aVal)) : String(aVal).localeCompare(String(bVal));
		});
	}

	const totalCount = result.length;
	const totalPages = Math.ceil(totalCount / pageSize);
	const start = page * pageSize;
	const items = result.slice(start, start + pageSize);

	return { success: true as const, items, page, totalPages, totalCount };
}

// ---------------------------------------------------------------------------
// Exported load functions (simulate 300ms latency)
// ---------------------------------------------------------------------------

export const loadUsers: DataTableLoadRowsFn<User> = async (params) => {
	await new Promise((resolve) => setTimeout(resolve, 300));
	return mockFetch(buildRequestSearchParams(params));
};

export const loadUsersWithErrorOnPage3: DataTableLoadRowsFn<User> = async (params) => {
	await new Promise((resolve) => setTimeout(resolve, 300));
	return mockFetch(buildRequestSearchParams(params), "3");
};

export const loadUsersWithErrorOnFirstPage: DataTableLoadRowsFn<User> = async (params) => {
	await new Promise((resolve) => setTimeout(resolve, 300));
	return mockFetch(buildRequestSearchParams(params), "0");
};
