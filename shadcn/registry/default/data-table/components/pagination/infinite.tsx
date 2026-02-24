"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { RefreshCwIcon } from "lucide-react";

import { useEffectOnce } from "../../hooks/use-effect-once";
import { useLatestValue } from "../../hooks/use-latest-value";
import { Button } from "@/registry/default/ui/button";
import { useDataTableState } from "../../context";

const INFINITE_SCROLL_THRESHOLD = 0.1;

export interface DataTableInfiniteScrollProps {
	/** Required when onLoadRows is NOT used on the parent DataTable */
	onLoadMore?: () => void | Promise<void>;
	/** Required when onLoadRows is NOT used on the parent DataTable */
	hasMore?: boolean;
}

export function DataTableInfiniteScroll({
	onLoadMore: onLoadMoreProp,
	hasMore: hasMoreProp,
}: DataTableInfiniteScrollProps) {
	"use no memo";
	const { loadNextPage, hasMore: contextHasMore, error } = useDataTableState();

	// Use context values (auto mode) or props (manual mode)
	const onLoadMore = loadNextPage ?? onLoadMoreProp;
	const hasMore = loadNextPage ? contextHasMore : (hasMoreProp ?? false);

	const sentinelRef = useRef<HTMLDivElement>(null);
	const loadingRef = useRef(false);
	const isIntersectingRef = useRef(false);
	const mountedRef = useRef(true);
	// Ref is checked synchronously in triggerLoad to prevent re-fire before React re-renders
	const errorRef = useRef(false);
	const [isLoading, setIsLoading] = useState(false);
	const [hasError, setHasError] = useState(false);

	// Keep latest values in refs so the stable triggerLoad can access them
	const hasMoreRef = useLatestValue(hasMore);
	const onLoadMoreRef = useLatestValue(onLoadMore);

	const triggerLoad = useCallback(async () => {
		if (
			loadingRef.current ||
			!hasMoreRef.current ||
			!onLoadMoreRef.current ||
			!mountedRef.current ||
			errorRef.current
		) {
			return;
		}

		loadingRef.current = true;
		setIsLoading(true);

		try {
			const result = await onLoadMoreRef.current();

			if (!mountedRef.current) {
				return;
			}

			const succeeded = result !== false;

			if (!succeeded) {
				errorRef.current = true;
				setHasError(true);
				return;
			}

			// After a successful load, if sentinel is still visible and there's more data,
			// keep loading without flashing the non-loading state.
			if (isIntersectingRef.current && hasMoreRef.current) {
				loadingRef.current = false;
				void triggerLoad();
				return;
			}
		} finally {
			loadingRef.current = false;

			if (mountedRef.current) {
				setIsLoading(false);
			}
		}
	}, [hasMoreRef, onLoadMoreRef]);

	const handleRetry = () => {
		errorRef.current = false;
		setHasError(false);
		void triggerLoad();
	};

	useEffectOnce(() => {
		mountedRef.current = true;

		return () => {
			mountedRef.current = false;
		};
	});

	// Reset local error when context error clears (e.g. after a filter change triggers a fresh primary load)
	useEffect(() => {
		if (!error && hasError) {
			errorRef.current = false;
			setHasError(false);
		}
	}, [error, hasError]);

	useEffect(() => {
		const sentinel = sentinelRef.current;

		if (!sentinel) {
			return;
		}

		const observer = new IntersectionObserver(
			(entries) => {
				isIntersectingRef.current = entries[0]?.isIntersecting ?? false;

				if (isIntersectingRef.current) {
					void triggerLoad();
				}
			},
			{ threshold: INFINITE_SCROLL_THRESHOLD },
		);

		observer.observe(sentinel);

		return () => {
			observer.disconnect();
		};
	}, [triggerLoad, hasMore]);

	if (!hasMore && !isLoading && !hasError) {
		return null;
	}

	return (
		<div ref={sentinelRef} className="flex items-center justify-center py-4">
			{hasError ? (
				<div className="flex flex-col items-center justify-center py-4 text-center">
					<p className="text-sm text-muted-foreground">An error occurred while loading this page.</p>
					<Button variant="outline" size="sm" className="mt-3" onClick={handleRetry}>
						<RefreshCwIcon className="size-3.5" />
						Retry
					</Button>
				</div>
			) : isLoading ? (
				<div className="flex items-center gap-2 text-sm text-muted-foreground">
					<div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
					<span>Loading more...</span>
				</div>
			) : null}
		</div>
	);
}
