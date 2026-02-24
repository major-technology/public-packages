"use client";

import { useVirtualizer, type VirtualItem } from "@tanstack/react-virtual";
export type { VirtualItem } from "@tanstack/react-virtual";
import type { RefObject } from "react";

export interface UseRowVirtualizerOptions {
	enabled: boolean;
	scrollContainerRef: RefObject<HTMLDivElement | null>;
	rowCount: number;
	/** Estimated height of a single row in px (used for initial layout before measurement) */
	estimateRowHeight: number;
	/** Number of rows to render outside the visible area @default 5 */
	overscan?: number;
}

export interface UseRowVirtualizerReturn {
	virtualItems: VirtualItem[];
	totalSize: number;
	measureElement: (el: Element | null) => void;
}

const NOOP_RETURN: UseRowVirtualizerReturn = {
	virtualItems: [],
	totalSize: 0,
	measureElement: () => {},
};

export function useRowVirtualizer({
	enabled,
	scrollContainerRef,
	rowCount,
	estimateRowHeight,
	overscan = 5,
}: UseRowVirtualizerOptions): UseRowVirtualizerReturn {
	"use no memo";

	const virtualizer = useVirtualizer({
		count: rowCount,
		getScrollElement: () => scrollContainerRef.current,
		estimateSize: () => estimateRowHeight,
		overscan,
		enabled,
	});

	if (!enabled) {
		return NOOP_RETURN;
	}

	return {
		virtualItems: virtualizer.getVirtualItems(),
		totalSize: virtualizer.getTotalSize(),
		measureElement: virtualizer.measureElement,
	};
}
