import { describe, expect, it, vi } from "vitest";
import { act, renderHook, waitFor } from "@testing-library/react";

import { useAutoModeLoader } from "@/registry/default/data-table/hooks/use-auto-mode-loader";
import type { DataTableResponse, PaginatedResponse } from "@/registry/default/data-table/types";

interface Row {
	id: string;
}

/** What the caller seeds the table with: a bare page, no envelope. */
const seed = (items: Row[]): PaginatedResponse<Row> => ({
	items,
	totalCount: items.length,
	totalPages: 1,
	page: 0,
});

/** What onLoadRows resolves to: the same page inside the success envelope. */
const loaded = (items: Row[]): DataTableResponse<Row> => ({ success: true, ...seed(items) });

/**
 * The `initialData` decision moved into the ref's initial value so the load effect no longer
 * reads the prop. These tests pin the behaviour that change had to preserve.
 */
describe("useAutoModeLoader initialData", () => {
	it("skips the first fetch when initialData seeds the table", async () => {
		const onLoadRows = vi.fn().mockResolvedValue(loaded([{ id: "server" }]));

		const { result } = renderHook(() =>
			useAutoModeLoader<Row>(onLoadRows, 50, seed([{ id: "seed" }]), undefined, undefined),
		);

		expect(result.current.data).toEqual([{ id: "seed" }]);
		expect(result.current.isLoading).toBe(false);

		// Give the load effect a chance to fire before asserting it did not.
		await act(async () => {
			await Promise.resolve();
		});

		expect(onLoadRows).not.toHaveBeenCalled();
	});

	it("fetches on mount when no initialData is given", async () => {
		const onLoadRows = vi.fn().mockResolvedValue(loaded([{ id: "server" }]));

		const { result } = renderHook(() => useAutoModeLoader<Row>(onLoadRows, 50, undefined, undefined, undefined));

		await waitFor(() => expect(onLoadRows).toHaveBeenCalledTimes(1));
		await waitFor(() => expect(result.current.data).toEqual([{ id: "server" }]));
	});

	it("still fetches on a sort change after initialData seeded the first render", async () => {
		const onLoadRows = vi.fn().mockResolvedValue(loaded([{ id: "sorted" }]));

		const { result } = renderHook(() =>
			useAutoModeLoader<Row>(onLoadRows, 50, seed([{ id: "seed" }]), undefined, undefined),
		);

		expect(onLoadRows).not.toHaveBeenCalled();

		act(() => {
			result.current.onSortingChange([{ id: "id", desc: false }]);
		});

		await waitFor(() => expect(onLoadRows).toHaveBeenCalledTimes(1));
		await waitFor(() => expect(result.current.data).toEqual([{ id: "sorted" }]));
	});

	it("does not re-fetch when the caller passes a fresh initialData object on every render", async () => {
		const onLoadRows = vi.fn().mockResolvedValue(loaded([{ id: "server" }]));

		// The exact hazard that made the old code exclude initialData from the dep array.
		const { rerender } = renderHook(() =>
			useAutoModeLoader<Row>(onLoadRows, 50, seed([{ id: "seed" }]), undefined, undefined),
		);

		rerender();
		rerender();

		await act(async () => {
			await Promise.resolve();
		});

		expect(onLoadRows).not.toHaveBeenCalled();
	});

	it("is inert when onLoadRows is undefined", async () => {
		const { result } = renderHook(() => useAutoModeLoader<Row>(undefined, 50, undefined, undefined, undefined));

		expect(result.current.isActive).toBe(false);
		expect(result.current.data).toEqual([]);
		expect(result.current.isLoading).toBe(false);
	});
});
