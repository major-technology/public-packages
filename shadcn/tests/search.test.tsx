import { describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";

import { DataTable } from "@/registry/default/data-table/data-table";
import { DataTableSearch } from "@/registry/default/data-table/components/toolbar/search";
import type { ColumnDef } from "@tanstack/react-table";

interface Row {
	id: string;
	name: string;
}

const rows: Row[] = [
	{ id: "1", name: "Alice" },
	{ id: "2", name: "Bob" },
];

const columns: ColumnDef<Row, unknown>[] = [{ accessorKey: "name", header: "Name" }];

/** Renders the search box inside a table whose globalFilter the test can drive from outside. */
function Harness({ debounceMs = 0 }: { debounceMs?: number }) {
	const [globalFilter, setGlobalFilter] = useState("");

	return (
		<>
			<button type="button" onClick={() => setGlobalFilter("")}>
				reset filters
			</button>
			<button type="button" onClick={() => setGlobalFilter("external")}>
				set externally
			</button>
			<DataTable data={rows} columns={columns} globalFilter={globalFilter} onGlobalFilterChange={setGlobalFilter}>
				<DataTableSearch debounceMs={debounceMs} />
			</DataTable>
		</>
	);
}

/**
 * search.tsx used to mirror globalFilter into local state inside an effect. That is now derived
 * during render. These tests pin the observable behaviour that change had to keep.
 */
describe("DataTableSearch external sync", () => {
	it("shows what the user types", async () => {
		const user = userEvent.setup();
		render(<Harness />);

		const input = screen.getByPlaceholderText("Search...");
		await user.type(input, "Ali");

		expect(input).toHaveValue("Ali");
	});

	it("adopts a globalFilter set from outside the component", async () => {
		const user = userEvent.setup();
		render(<Harness />);

		const input = screen.getByPlaceholderText("Search...");
		expect(input).toHaveValue("");

		await user.click(screen.getByText("set externally"));

		expect(input).toHaveValue("external");
	});

	it("clears the box when a filters reset clears globalFilter", async () => {
		const user = userEvent.setup();
		render(<Harness />);

		const input = screen.getByPlaceholderText("Search...");

		await user.click(screen.getByText("set externally"));
		expect(input).toHaveValue("external");

		await user.click(screen.getByText("reset filters"));

		expect(input).toHaveValue("");
	});

	it("pushes the typed value into globalFilter after the debounce", async () => {
		const user = userEvent.setup();
		const onGlobalFilterChange = vi.fn();

		render(
			<DataTable data={rows} columns={columns} globalFilter="" onGlobalFilterChange={onGlobalFilterChange}>
				<DataTableSearch debounceMs={50} />
			</DataTable>,
		);

		await user.type(screen.getByPlaceholderText("Search..."), "Bob");

		await waitFor(() => expect(onGlobalFilterChange).toHaveBeenCalled());
	});
});
