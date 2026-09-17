import type { KeyboardEvent } from "react";

import { cn } from "@/registry/default/lib/utils";

export interface ResizeHandleProps {
	columnId: string;
	isActive: boolean;
	onHoverChange: (columnId: string | null) => void;
	onResize: (e: unknown) => void;
	/**
	 * Nudge the column width by `delta` px, driving keyboard resizing. Omit it for the
	 * decorative handles rendered in body cells: they duplicate the header's drag affordance,
	 * and making each one focusable would put a tab stop in every cell of every row.
	 */
	onResizeBy?: (columnId: string, delta: number) => void;
}

/** px added or removed per arrow key press; Shift multiplies it. */
const KEYBOARD_RESIZE_STEP = 8;
const KEYBOARD_RESIZE_STEP_LARGE = 40;

export function ResizeHandle({ columnId, isActive, onHoverChange, onResize, onResizeBy }: ResizeHandleProps) {
	const keyboardResizable = onResizeBy !== undefined;

	const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
		if (!onResizeBy || (event.key !== "ArrowLeft" && event.key !== "ArrowRight")) {
			return;
		}

		// Stop the key from also moving focus or scrolling the table container.
		event.preventDefault();
		event.stopPropagation();

		const step = event.shiftKey ? KEYBOARD_RESIZE_STEP_LARGE : KEYBOARD_RESIZE_STEP;
		onResizeBy(columnId, event.key === "ArrowLeft" ? -step : step);
	};

	return (
		// A real button rather than a div with a role: natively focusable and keyboard-operable,
		// so arrow-key resizing works without reimplementing focus handling.
		<button
			type="button"
			aria-label={keyboardResizable ? "Resize column" : undefined}
			aria-hidden={keyboardResizable ? undefined : true}
			tabIndex={keyboardResizable ? 0 : -1}
			onMouseEnter={() => onHoverChange(columnId)}
			onMouseLeave={() => onHoverChange(null)}
			onFocus={() => onHoverChange(columnId)}
			onBlur={() => onHoverChange(null)}
			onMouseDown={onResize}
			onTouchStart={onResize}
			onKeyDown={handleKeyDown}
			onClick={(e) => e.stopPropagation()}
			className={cn(
				"absolute right-0 top-0 z-20 h-full w-2 cursor-col-resize select-none touch-none",
				isActive && "bg-primary",
			)}
		/>
	);
}
