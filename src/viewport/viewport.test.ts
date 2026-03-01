import { afterEach, describe, expect, it, vi } from "vitest";
import { isInViewport } from "./is-in-viewport";
import { onIntersection } from "./on-intersection";

describe("isInViewport", () => {
	afterEach(() => {
		vi.restoreAllMocks();
	});

	it("returns true when element is fully in the viewport", () => {
		const el = document.createElement("div");
		vi.spyOn(el, "getBoundingClientRect").mockReturnValue({
			top: 10,
			bottom: 100,
			left: 10,
			right: 100,
			width: 90,
			height: 90,
			x: 10,
			y: 10,
			toJSON: () => {},
		});
		Object.defineProperty(window, "innerHeight", { value: 768, configurable: true });
		Object.defineProperty(window, "innerWidth", { value: 1024, configurable: true });

		expect(isInViewport(el)).toBe(true);
	});

	it("returns false when element is above the viewport", () => {
		const el = document.createElement("div");
		vi.spyOn(el, "getBoundingClientRect").mockReturnValue({
			top: -200,
			bottom: -100,
			left: 10,
			right: 100,
			width: 90,
			height: 100,
			x: 10,
			y: -200,
			toJSON: () => {},
		});
		expect(isInViewport(el)).toBe(false);
	});

	it("returns false when element is below the viewport", () => {
		const el = document.createElement("div");
		Object.defineProperty(window, "innerHeight", { value: 768, configurable: true });
		vi.spyOn(el, "getBoundingClientRect").mockReturnValue({
			top: 800,
			bottom: 900,
			left: 10,
			right: 100,
			width: 90,
			height: 100,
			x: 10,
			y: 800,
			toJSON: () => {},
		});
		expect(isInViewport(el)).toBe(false);
	});

	it("returns false when element is to the left of the viewport", () => {
		const el = document.createElement("div");
		Object.defineProperty(window, "innerWidth", { value: 1024, configurable: true });
		vi.spyOn(el, "getBoundingClientRect").mockReturnValue({
			top: 10,
			bottom: 100,
			left: -200,
			right: -100,
			width: 100,
			height: 90,
			x: -200,
			y: 10,
			toJSON: () => {},
		});
		expect(isInViewport(el)).toBe(false);
	});

	it("returns false when element is to the right of the viewport", () => {
		const el = document.createElement("div");
		Object.defineProperty(window, "innerWidth", { value: 1024, configurable: true });
		vi.spyOn(el, "getBoundingClientRect").mockReturnValue({
			top: 10,
			bottom: 100,
			left: 1100,
			right: 1200,
			width: 100,
			height: 90,
			x: 1100,
			y: 10,
			toJSON: () => {},
		});
		expect(isInViewport(el)).toBe(false);
	});
});

describe("onIntersection", () => {
	afterEach(() => {
		vi.restoreAllMocks();
	});

	it("creates an IntersectionObserver and observes the element", () => {
		const observeSpy = vi.fn();
		const disconnectSpy = vi.fn();
		vi.stubGlobal(
			"IntersectionObserver",
			vi.fn().mockImplementation(() => ({ observe: observeSpy, disconnect: disconnectSpy })),
		);

		const el = document.createElement("div");
		const callback = vi.fn();
		onIntersection(el, callback);

		expect(IntersectionObserver).toHaveBeenCalled();
		expect(observeSpy).toHaveBeenCalledWith(el);
		vi.unstubAllGlobals();
	});

	it("calls callback with each entry when intersection changes", () => {
		const callback = vi.fn();
		let capturedCallback: ((entries: IntersectionObserverEntry[]) => void) | undefined;

		vi.stubGlobal(
			"IntersectionObserver",
			vi.fn().mockImplementation((cb: (entries: IntersectionObserverEntry[]) => void) => {
				capturedCallback = cb;
				return { observe: vi.fn(), disconnect: vi.fn() };
			}),
		);

		const el = document.createElement("div");
		onIntersection(el, callback);

		const entry = { isIntersecting: true } as IntersectionObserverEntry;
		capturedCallback?.([entry]);

		expect(callback).toHaveBeenCalledWith(entry);
		vi.unstubAllGlobals();
	});

	it("returns a cleanup function that disconnects the observer", () => {
		const disconnectSpy = vi.fn();
		vi.stubGlobal(
			"IntersectionObserver",
			vi.fn().mockImplementation(() => ({ observe: vi.fn(), disconnect: disconnectSpy })),
		);

		const el = document.createElement("div");
		const cleanup = onIntersection(el, vi.fn());
		cleanup();

		expect(disconnectSpy).toHaveBeenCalled();
		vi.unstubAllGlobals();
	});

	it("passes options to IntersectionObserver", () => {
		vi.stubGlobal(
			"IntersectionObserver",
			vi.fn().mockImplementation(() => ({ observe: vi.fn(), disconnect: vi.fn() })),
		);

		const el = document.createElement("div");
		const options: IntersectionObserverInit = { threshold: 0.5 };
		onIntersection(el, vi.fn(), options);

		expect(IntersectionObserver).toHaveBeenCalledWith(expect.any(Function), options);
		vi.unstubAllGlobals();
	});
});
