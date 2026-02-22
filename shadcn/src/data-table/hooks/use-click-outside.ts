import { useEffect, useEffectEvent, type RefObject } from "react";

/**
 * Calls `handler` when a mousedown event occurs outside the referenced element.
 * Listener is only attached while `enabled` is true.
 */
export function useClickOutside(ref: RefObject<HTMLElement | null>, handler: () => void, enabled = true): void {
	const onMouseDown = useEffectEvent((event: MouseEvent) => {
		if (ref.current && !ref.current.contains(event.target as Node)) {
			handler();
		}
	});

	useEffect(() => {
		if (!enabled) {
			return;
		}

		document.addEventListener("mousedown", onMouseDown);

		return () => {
			document.removeEventListener("mousedown", onMouseDown);
		};
	}, [enabled]);
}
