import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { DataTableInfiniteScroll } from "@/registry/default/data-table/components/pagination/infinite";
import { DataTableStateContext } from "@/registry/default/data-table/context";

type StateValue = Parameters<typeof DataTableStateContext.Provider>[0]["value"];

const baseState = {
	isLoading: false,
	loadNextPage: undefined,
	hasMore: true,
	enableColumnReordering: false,
	enableColumnResizing: false,
	error: null,
	retry: () => {},
	reloadPage: () => {},
	updateRow: () => {},
	removeRow: () => {},
} as unknown as NonNullable<StateValue>;

function renderScroll(overrides: Partial<NonNullable<StateValue>>, props: { onLoadMore?: () => void | Promise<void> }) {
	return render(
		<DataTableStateContext.Provider value={{ ...baseState, ...overrides }}>
			<DataTableInfiniteScroll hasMore {...props} />
		</DataTableStateContext.Provider>,
	);
}

/** jsdom has no IntersectionObserver; capture the callback so tests can drive intersection. */
let triggerIntersect: ((isIntersecting: boolean) => void) | undefined;

/**
 * A successful load that also scrolls the sentinel out of view. The component deliberately
 * keeps loading while the sentinel stays visible and hasMore is true, so a mock that always
 * succeeds without this would recurse forever.
 */
const loadThenLeaveView = () =>
	vi.fn().mockImplementation(async () => {
		triggerIntersect?.(false);
	});

beforeEach(() => {
	triggerIntersect = undefined;

	vi.stubGlobal(
		"IntersectionObserver",
		class {
			constructor(callback: (entries: { isIntersecting: boolean }[]) => void) {
				triggerIntersect = (isIntersecting) => callback([{ isIntersecting }]);
			}
			observe() {}
			disconnect() {}
			unobserve() {}
		},
	);
});

describe("DataTableInfiniteScroll error recovery", () => {
	it("loads more when the sentinel becomes visible", async () => {
		const onLoadMore = loadThenLeaveView();
		renderScroll({}, { onLoadMore });

		triggerIntersect?.(true);

		await waitFor(() => expect(onLoadMore).toHaveBeenCalledTimes(1));
	});

	it("shows a retry button after a failed load and does not keep firing", async () => {
		const onLoadMore = vi.fn().mockResolvedValue(false);
		renderScroll({}, { onLoadMore });

		triggerIntersect?.(true);

		await waitFor(() => expect(screen.getByText("Retry")).toBeInTheDocument());
		expect(onLoadMore).toHaveBeenCalledTimes(1);

		// Still intersecting, but the error gate must stop it re-firing.
		triggerIntersect?.(true);
		await new Promise((r) => setTimeout(r, 50));

		expect(onLoadMore).toHaveBeenCalledTimes(1);
	});

	it("retries when the user clicks Retry", async () => {
		const user = userEvent.setup();
		const onLoadMore = vi.fn().mockResolvedValueOnce(false).mockImplementation(async () => {
			triggerIntersect?.(false);
		});
		renderScroll({}, { onLoadMore });

		triggerIntersect?.(true);
		await waitFor(() => expect(screen.getByText("Retry")).toBeInTheDocument());

		await user.click(screen.getByText("Retry"));

		await waitFor(() => expect(onLoadMore).toHaveBeenCalledTimes(2));
	});

	/**
	 * The regression guard. Clearing the context error must reset BOTH the rendered error state
	 * and the synchronous errorRef gate; dropping the ref reset leaves loading permanently dead
	 * with no visible symptom.
	 */
	it("loads again once the context error clears", async () => {
		const onLoadMore = vi.fn().mockResolvedValueOnce(false).mockImplementation(async () => {
			triggerIntersect?.(false);
		});
		const { rerender } = render(
			<DataTableStateContext.Provider value={baseState}>
				<DataTableInfiniteScroll hasMore onLoadMore={onLoadMore} />
			</DataTableStateContext.Provider>,
		);

		triggerIntersect?.(true);
		await waitFor(() => expect(screen.getByText("Retry")).toBeInTheDocument());

		// A filter change surfaces an error, then a fresh primary load clears it.
		const errored = { ...baseState, error: { code: "E", message: "boom" } } as NonNullable<StateValue>;

		rerender(
			<DataTableStateContext.Provider value={errored}>
				<DataTableInfiniteScroll hasMore onLoadMore={onLoadMore} />
			</DataTableStateContext.Provider>,
		);

		rerender(
			<DataTableStateContext.Provider value={baseState}>
				<DataTableInfiniteScroll hasMore onLoadMore={onLoadMore} />
			</DataTableStateContext.Provider>,
		);

		await waitFor(() => expect(screen.queryByText("Retry")).not.toBeInTheDocument());

		triggerIntersect?.(true);

		await waitFor(() => expect(onLoadMore).toHaveBeenCalledTimes(2));
	});
});
