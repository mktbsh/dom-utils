import { afterEach, describe, expect, it, vi } from "vitest";
import { getScrollPosition } from "./get-scroll-position";
import { isScrollable } from "./is-scrollable";
import { scrollToElement } from "./scroll-to-element";

describe("scrollToElement", () => {
	afterEach(() => {
		vi.restoreAllMocks();
	});

	it("calls scrollIntoView with smooth behavior by default", () => {
		const el = document.createElement("div");
		const spy = vi.spyOn(el, "scrollIntoView").mockImplementation(() => {});
		scrollToElement(el);
		expect(spy).toHaveBeenCalledWith({ behavior: "smooth" });
	});

	it("forwards custom options to scrollIntoView", () => {
		const el = document.createElement("div");
		const spy = vi.spyOn(el, "scrollIntoView").mockImplementation(() => {});
		scrollToElement(el, { behavior: "instant", block: "start" });
		expect(spy).toHaveBeenCalledWith({ behavior: "instant", block: "start" });
	});
});

describe("getScrollPosition", () => {
	afterEach(() => {
		vi.unstubAllGlobals();
	});

	it("returns the current scroll position from window", () => {
		Object.defineProperty(window, "scrollX", { value: 100, configurable: true });
		Object.defineProperty(window, "scrollY", { value: 200, configurable: true });
		const pos = getScrollPosition();
		expect(pos).toEqual({ x: 100, y: 200 });
	});
});

describe("isScrollable", () => {
	afterEach(() => {
		vi.restoreAllMocks();
	});

	it("returns true for a vertically scrollable element", () => {
		const el = document.createElement("div");
		vi.spyOn(window, "getComputedStyle").mockReturnValue({
			overflowY: "auto",
			overflowX: "visible",
		} as CSSStyleDeclaration);
		Object.defineProperty(el, "scrollHeight", { value: 500, configurable: true });
		Object.defineProperty(el, "clientHeight", { value: 200, configurable: true });
		Object.defineProperty(el, "scrollWidth", { value: 100, configurable: true });
		Object.defineProperty(el, "clientWidth", { value: 100, configurable: true });

		expect(isScrollable(el)).toBe(true);
	});

	it("returns true for a horizontally scrollable element", () => {
		const el = document.createElement("div");
		vi.spyOn(window, "getComputedStyle").mockReturnValue({
			overflowY: "visible",
			overflowX: "scroll",
		} as CSSStyleDeclaration);
		Object.defineProperty(el, "scrollHeight", { value: 100, configurable: true });
		Object.defineProperty(el, "clientHeight", { value: 100, configurable: true });
		Object.defineProperty(el, "scrollWidth", { value: 500, configurable: true });
		Object.defineProperty(el, "clientWidth", { value: 200, configurable: true });

		expect(isScrollable(el)).toBe(true);
	});

	it("returns false for a non-scrollable element", () => {
		const el = document.createElement("div");
		vi.spyOn(window, "getComputedStyle").mockReturnValue({
			overflowY: "visible",
			overflowX: "visible",
		} as CSSStyleDeclaration);
		Object.defineProperty(el, "scrollHeight", { value: 100, configurable: true });
		Object.defineProperty(el, "clientHeight", { value: 100, configurable: true });
		Object.defineProperty(el, "scrollWidth", { value: 100, configurable: true });
		Object.defineProperty(el, "clientWidth", { value: 100, configurable: true });

		expect(isScrollable(el)).toBe(false);
	});

	it("returns false when overflow is auto but content fits", () => {
		const el = document.createElement("div");
		vi.spyOn(window, "getComputedStyle").mockReturnValue({
			overflowY: "auto",
			overflowX: "auto",
		} as CSSStyleDeclaration);
		Object.defineProperty(el, "scrollHeight", { value: 100, configurable: true });
		Object.defineProperty(el, "clientHeight", { value: 100, configurable: true });
		Object.defineProperty(el, "scrollWidth", { value: 100, configurable: true });
		Object.defineProperty(el, "clientWidth", { value: 100, configurable: true });

		expect(isScrollable(el)).toBe(false);
	});
});
