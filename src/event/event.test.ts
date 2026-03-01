import { afterEach, describe, expect, it, vi } from "vitest";
import { onOutsideClick } from "./on-outside-click";
import { once } from "./once";

describe("once", () => {
	afterEach(() => {
		vi.restoreAllMocks();
	});

	it("calls the handler exactly once on the first event", () => {
		const el = document.createElement("button");
		document.body.appendChild(el);
		const handler = vi.fn();

		once(el, "click", handler);
		el.dispatchEvent(new MouseEvent("click"));
		el.dispatchEvent(new MouseEvent("click"));

		expect(handler).toHaveBeenCalledTimes(1);
		document.body.removeChild(el);
	});

	it("uses addEventListener with once: true", () => {
		const el = document.createElement("div");
		const addSpy = vi.spyOn(el, "addEventListener");
		const handler = vi.fn();

		once(el, "click", handler);

		expect(addSpy).toHaveBeenCalledWith("click", expect.any(Function), { once: true });
	});
});

describe("onOutsideClick", () => {
	afterEach(() => {
		vi.restoreAllMocks();
		document.body.innerHTML = "";
	});

	it("calls callback when clicking outside the element", () => {
		const el = document.createElement("div");
		document.body.appendChild(el);
		const outside = document.createElement("button");
		document.body.appendChild(outside);

		const callback = vi.fn();
		onOutsideClick(el, callback);

		outside.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
		expect(callback).toHaveBeenCalled();
	});

	it("does not call callback when clicking inside the element", () => {
		const el = document.createElement("div");
		const inner = document.createElement("span");
		el.appendChild(inner);
		document.body.appendChild(el);

		const callback = vi.fn();
		onOutsideClick(el, callback);

		inner.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
		expect(callback).not.toHaveBeenCalled();
	});

	it("removes the event listener when cleanup is called", () => {
		const el = document.createElement("div");
		document.body.appendChild(el);
		const outside = document.createElement("button");
		document.body.appendChild(outside);

		const callback = vi.fn();
		const cleanup = onOutsideClick(el, callback);
		cleanup();

		outside.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
		expect(callback).not.toHaveBeenCalled();
	});
});
