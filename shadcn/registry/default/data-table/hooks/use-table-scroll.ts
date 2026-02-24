"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export interface UseTableScrollOptions {
	hasActionsColumn: boolean;
	virtualized: boolean;
	hasMore: boolean;
	loadNextPage: (() => Promise<boolean>) | undefined;
}

export interface UseTableScrollReturn {
	containerRef: React.RefObject<HTMLDivElement | null>;
	isScrolledToEnd: boolean;
}

export function useTableScroll({
	hasActionsColumn,
	virtualized,
	hasMore,
	loadNextPage,
}: UseTableScrollOptions): UseTableScrollReturn {
	const containerRef = useRef<HTMLDivElement>(null);
	const loadingRef = useRef(false);
	const [isScrolledToEnd, setIsScrolledToEnd] = useState(true);

	const handleScroll = useCallback(() => {
		const el = containerRef.current;

		if (!el) {
			return;
		}

		// Horizontal scroll tracking for sticky actions shadow
		if (hasActionsColumn) {
			const atEnd = el.scrollWidth - el.scrollLeft - el.clientWidth < 1;
			setIsScrolledToEnd(atEnd);
		}

		// Vertical infinite scroll for virtualized mode
		if (virtualized && hasMore && loadNextPage && !loadingRef.current) {
			const nearBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 200;

			if (nearBottom) {
				loadingRef.current = true;
				void loadNextPage().finally(() => {
					loadingRef.current = false;
				});
			}
		}
	}, [virtualized, hasMore, loadNextPage, hasActionsColumn]);

	useEffect(() => {
		const el = containerRef.current;

		if (!el) {
			return;
		}

		// Check initial scroll state
		if (hasActionsColumn) {
			const atEnd = el.scrollWidth - el.scrollLeft - el.clientWidth < 1;
			setIsScrolledToEnd(atEnd);
		}

		el.addEventListener("scroll", handleScroll, { passive: true });

		return () => {
			el.removeEventListener("scroll", handleScroll);
		};
	}, [handleScroll, hasActionsColumn]);

	return { containerRef, isScrolledToEnd };
}
