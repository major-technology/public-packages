import { cn } from "../../lib/utils";

export interface ResizeHandleProps {
	columnId: string;
	isActive: boolean;
	onHoverChange: (columnId: string | null) => void;
	onResize: (e: unknown) => void;
}

export function ResizeHandle({ columnId, isActive, onHoverChange, onResize }: ResizeHandleProps) {
	return (
		<div
			onMouseEnter={() => onHoverChange(columnId)}
			onMouseLeave={() => onHoverChange(null)}
			onMouseDown={onResize}
			onTouchStart={onResize}
			onClick={(e) => e.stopPropagation()}
			className={cn(
				"absolute right-0 top-0 z-20 h-full w-2 cursor-col-resize select-none touch-none",
				isActive && "bg-primary",
			)}
		/>
	);
}
