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
// Static data for client-side examples
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

export const ALL_USERS: User[] = Array.from({ length: 500 }, (_, i) => {
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
// Server-side load functions (real HTTP requests to /api/users)
// ---------------------------------------------------------------------------

async function fetchUsers(params: URLSearchParams): Promise<Response> {
	return fetch(`/api/users?${params.toString()}`);
}

export const loadUsers: DataTableLoadRowsFn<User> = async (params) => {
	const response = await fetchUsers(buildRequestSearchParams(params));
	return response.json();
};

export const loadUsersWithErrorOnPage3: DataTableLoadRowsFn<User> = async (params) => {
	const searchParams = buildRequestSearchParams(params);
	searchParams.set("errorOnPage", "3");
	const response = await fetchUsers(searchParams);
	return response.json();
};

export const loadUsersWithErrorOnFirstPage: DataTableLoadRowsFn<User> = async (params) => {
	const searchParams = buildRequestSearchParams(params);
	searchParams.set("errorOnPage", "0");
	const response = await fetchUsers(searchParams);
	return response.json();
};
