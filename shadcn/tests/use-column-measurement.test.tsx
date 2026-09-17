import { describe, expect, it, vi } from "vitest";
import { renderHook } from "@testing-library/react";

import { useColumnMeasurement } from "@/registry/default/data-table/hooks/use-column-measurement";
import type { HeaderGroup, Table } from "@tanstack/react-table";

interface Row {
	id: string;
}

/**
 * jsdom reports every element as 0x0, so the measured widths come from a stubbed
 * getBoundingClientRect. What these tests actually pin is *when* measurement runs.
 */
function mountTable(columnIds: string[], width = 120) {
	const table = document.createElement("table");
	const thead = document.createElement("thead");
	const tr = document.createElement("tr");

	for (const _id of columnIds) {
		const th = document.createElement("th");
		th.getBoundingClientRect = () => ({ width }) as DOMRect;
		tr.appendChild(th);
	}

	thead.appendChild(tr);
	table.appendChild(thead);
	document.body.appendChild(table);

	return table;
}

function makeHeaderGroups(columnIds: string[]): HeaderGroup<Row>[] {
	return [{ headers: columnIds.map((id) => ({ column: { id } })) }] as unknown as HeaderGroup<Row>[];
}

function makeTable(setColumnSizing: ReturnType<typeof vi.fn>, columnSizing: Record<string, number> = {}) {
	return { setColumnSizing, getState: () => ({ columnSizing }) } as unknown as Table<Row>;
}

/**
 * The gate that decides whether to measure used to live in the render body, reading and writing
 * refs while rendering. It now runs inside the layout effect. These tests pin the behaviour that
 * move had to preserve: measure once, and re-measure when the column set or the resizing flag
 * changes.
 */
describe("useColumnMeasurement", () => {
	const columnIds = ["name", "email"];

	function setup(initial: { enableColumnResizing: boolean; rowCount: number; columnCount: number }) {
		const setColumnSizing = vi.fn();
		const table = makeTable(setColumnSizing);
		const headerGroups = makeHeaderGroups(columnIds);
		const el = mountTable(columnIds);

		const rendered = renderHook(
			(props: { enableColumnResizing: boolean; rowCount: number; columnCount: number }) => {
				const result = useColumnMeasurement<Row>(
					table,
					headerGroups,
					props.enableColumnResizing,
					props.rowCount,
					props.columnCount,
				);
				// The hook only measures once its ref points at a real table element.
				result.tableRef.current = el;
				return result;
			},
			{ initialProps: initial },
		);

		return { ...rendered, setColumnSizing };
	}

	it("does not measure while column resizing is disabled", () => {
		const { setColumnSizing } = setup({ enableColumnResizing: false, rowCount: 10, columnCount: 2 });

		expect(setColumnSizing).not.toHaveBeenCalled();
	});

	it("does not measure before any rows have arrived", () => {
		const { setColumnSizing } = setup({ enableColumnResizing: true, rowCount: 0, columnCount: 2 });

		expect(setColumnSizing).not.toHaveBeenCalled();
	});

	it("measures once rows exist and does not repeat on an unrelated re-render", () => {
		const { rerender, setColumnSizing } = setup({ enableColumnResizing: true, rowCount: 10, columnCount: 2 });

		expect(setColumnSizing).toHaveBeenCalledTimes(1);
		expect(setColumnSizing).toHaveBeenCalledWith({ name: 120, email: 120 });

		rerender({ enableColumnResizing: true, rowCount: 10, columnCount: 2 });
		rerender({ enableColumnResizing: true, rowCount: 20, columnCount: 2 });

		expect(setColumnSizing).toHaveBeenCalledTimes(1);
	});

	it("re-measures when the column count changes (a column was hidden or shown)", () => {
		const { rerender, setColumnSizing } = setup({ enableColumnResizing: true, rowCount: 10, columnCount: 2 });

		expect(setColumnSizing).toHaveBeenCalledTimes(1);

		rerender({ enableColumnResizing: true, rowCount: 10, columnCount: 1 });

		expect(setColumnSizing).toHaveBeenCalledTimes(2);
	});

	it("re-measures after resizing is toggled off and back on", () => {
		const { rerender, setColumnSizing } = setup({ enableColumnResizing: true, rowCount: 10, columnCount: 2 });

		expect(setColumnSizing).toHaveBeenCalledTimes(1);

		rerender({ enableColumnResizing: false, rowCount: 10, columnCount: 2 });
		expect(setColumnSizing).toHaveBeenCalledTimes(1);

		rerender({ enableColumnResizing: true, rowCount: 10, columnCount: 2 });
		expect(setColumnSizing).toHaveBeenCalledTimes(2);
	});

	it("returns an explicit width only for columns already in columnSizing", () => {
		const table = makeTable(vi.fn(), { name: 200 });
		const { result } = renderHook(() =>
			useColumnMeasurement<Row>(table, makeHeaderGroups(columnIds), true, 10, 2),
		);

		expect(result.current.getColumnWidth("name", () => 200)).toEqual({
			width: 200,
			minWidth: 200,
			maxWidth: 200,
		});
		expect(result.current.getColumnWidth("email", () => 120)).toBeUndefined();
	});
});
