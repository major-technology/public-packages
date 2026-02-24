import { useCallback, useEffect, useRef } from "react";
import { useLatestValue } from "./use-latest-value";

interface UseDebouncedCallbackOptions {
	/** When true (default), the pending callback is flushed on unmount. */
	flushOnUnmount?: boolean;
}

/**
 * Returns a debounced version of `callback` and a `cancel` function.
 *
 * - The debounced function delays invocation by `delay` ms, cancelling any pending call.
 * - `cancel()` discards the pending call without executing it.
 * - On unmount, the pending call is flushed by default (set `flushOnUnmount: false` to discard).
 */
export function useDebouncedCallback<Args extends unknown[]>(
	callback: (...args: Args) => void,
	delay: number,
	{ flushOnUnmount = true }: UseDebouncedCallbackOptions = {},
): [debounced: (...args: Args) => void, cancel: () => void] {
	const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const flushRef = useRef<(() => void) | null>(null);
	const callbackRef = useLatestValue(callback);

	const cancel = useCallback(() => {
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current);
			timeoutRef.current = null;
		}

		flushRef.current = null;
	}, []);

	useEffect(() => {
		return () => {
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
			}

			if (flushOnUnmount) {
				flushRef.current?.();
			}
		};
	}, [flushOnUnmount]);

	const debounced = useCallback(
		(...args: Args) => {
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
			}

			const flush = () => {
				callbackRef.current(...args);
			};

			flushRef.current = flush;

			timeoutRef.current = setTimeout(() => {
				flush();
				flushRef.current = null;
			}, delay);
		},
		[delay, callbackRef],
	);

	return [debounced, cancel];
}
