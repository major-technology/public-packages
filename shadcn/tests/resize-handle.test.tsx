import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { ResizeHandle } from "@/registry/default/data-table/components/resize-handle";

const noop = () => {};

/**
 * The handle became a real <button> so keyboard users can resize. Body cells render the same
 * handle purely as a drag affordance, so those must stay out of the tab order — otherwise a
 * 50-row table adds hundreds of tab stops.
 */
describe("ResizeHandle", () => {
	it("is focusable and labelled when keyboard resizing is wired up", () => {
		render(<ResizeHandle columnId="name" isActive={false} onHoverChange={noop} onResize={noop} onResizeBy={noop} />);

		const handle = screen.getByRole("button", { name: "Resize column" });

		expect(handle).toHaveAttribute("tabindex", "0");
		expect(handle).not.toHaveAttribute("aria-hidden");
	});

	it("is hidden from assistive tech and the tab order without onResizeBy", () => {
		const { container } = render(
			<ResizeHandle columnId="name" isActive={false} onHoverChange={noop} onResize={noop} />,
		);

		const handle = container.querySelector("button");

		expect(handle).toHaveAttribute("aria-hidden", "true");
		expect(handle).toHaveAttribute("tabindex", "-1");
		expect(screen.queryByRole("button", { name: "Resize column" })).not.toBeInTheDocument();
	});

	it("widens on ArrowRight and narrows on ArrowLeft", async () => {
		const user = userEvent.setup();
		const onResizeBy = vi.fn();

		render(
			<ResizeHandle columnId="email" isActive={false} onHoverChange={noop} onResize={noop} onResizeBy={onResizeBy} />,
		);

		const handle = screen.getByRole("button", { name: "Resize column" });
		handle.focus();

		await user.keyboard("{ArrowRight}");
		expect(onResizeBy).toHaveBeenLastCalledWith("email", 8);

		await user.keyboard("{ArrowLeft}");
		expect(onResizeBy).toHaveBeenLastCalledWith("email", -8);
	});

	it("takes a larger step with Shift held", async () => {
		const user = userEvent.setup();
		const onResizeBy = vi.fn();

		render(
			<ResizeHandle columnId="email" isActive={false} onHoverChange={noop} onResize={noop} onResizeBy={onResizeBy} />,
		);

		screen.getByRole("button", { name: "Resize column" }).focus();

		await user.keyboard("{Shift>}{ArrowRight}{/Shift}");

		expect(onResizeBy).toHaveBeenLastCalledWith("email", 40);
	});

	it("ignores keys that are not horizontal arrows", async () => {
		const user = userEvent.setup();
		const onResizeBy = vi.fn();

		render(
			<ResizeHandle columnId="email" isActive={false} onHoverChange={noop} onResize={noop} onResizeBy={onResizeBy} />,
		);

		screen.getByRole("button", { name: "Resize column" }).focus();

		await user.keyboard("{Enter}{ArrowUp}{a}");

		expect(onResizeBy).not.toHaveBeenCalled();
	});
});
