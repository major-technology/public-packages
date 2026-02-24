import { useEffect } from "react";

/**
 * Runs an effect only once on mount.
 * The cleanup function (if returned) runs on unmount.
 */
export function useEffectOnce(effect: () => void | (() => void)) {
	// eslint-disable-next-line react-hooks/exhaustive-deps
	useEffect(effect, []);
}
