import { useEffect, useRef } from "react";

/**
 * Keeps a ref always in sync with the latest committed value.
 * Useful for accessing current props/state inside stable callbacks
 * without adding them to dependency arrays.
 *
 * Updates in useEffect so the ref only reflects committed renders,
 * avoiding stale values from abandoned concurrent renders.
 */
export function useLatestValue<T>(value: T) {
	const ref = useRef(value);

	useEffect(() => {
		ref.current = value;
	}, [value]);

	return ref;
}
