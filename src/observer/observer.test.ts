import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { onElementResize } from "./on-element-resize";
import { waitForElement } from "./wait-for-element";

describe("onElementResize", () => {
	afterEach(() => {
		vi.restoreAllMocks();
		vi.unstubAllGlobals();
	});

	it("creates a ResizeObserver and observes the element", () => {
		const observeSpy = vi.fn();
		const disconnectSpy = vi.fn();
		vi.stubGlobal(
			"ResizeObserver",
			vi.fn().mockImplementation(() => ({
				observe: observeSpy,
				disconnect: disconnectSpy,
			})),
		);

		const el = document.createElement("div");
		onElementResize(el, vi.fn());

		expect(ResizeObserver).toHaveBeenCalled();
		expect(observeSpy).toHaveBeenCalledWith(el);
	});

	it("calls callback with each resize entry", () => {
		const callback = vi.fn();
		let capturedCallback:
			| ((entries: ResizeObserverEntry[]) => void)
			| undefined;

		vi.stubGlobal(
			"ResizeObserver",
			vi
				.fn()
				.mockImplementation((cb: (entries: ResizeObserverEntry[]) => void) => {
					capturedCallback = cb;
					return { observe: vi.fn(), disconnect: vi.fn() };
				}),
		);

		const el = document.createElement("div");
		onElementResize(el, callback);

		const entry = {
			contentRect: { width: 100, height: 100 },
		} as ResizeObserverEntry;
		capturedCallback?.([entry]);

		expect(callback).toHaveBeenCalledWith(entry);
	});

	it("returns a cleanup function that disconnects the observer", () => {
		const disconnectSpy = vi.fn();
		vi.stubGlobal(
			"ResizeObserver",
			vi.fn().mockImplementation(() => ({
				observe: vi.fn(),
				disconnect: disconnectSpy,
			})),
		);

		const el = document.createElement("div");
		const cleanup = onElementResize(el, vi.fn());
		cleanup();

		expect(disconnectSpy).toHaveBeenCalled();
	});
});

describe("waitForElement", () => {
	beforeEach(() => {
		document.body.innerHTML = "";
	});

	afterEach(() => {
		vi.restoreAllMocks();
		document.body.innerHTML = "";
	});

	it("resolves immediately if element already exists", async () => {
		const div = document.createElement("div");
		div.className = "target";
		document.body.appendChild(div);

		const result = await waitForElement(".target");
		expect(result).toBe(div);
	});

	it("resolves when element is added to the DOM", async () => {
		const promise = waitForElement(".dynamic");

		setTimeout(() => {
			const el = document.createElement("div");
			el.className = "dynamic";
			document.body.appendChild(el);
		}, 10);

		const result = await promise;
		expect(result.className).toBe("dynamic");
	});

	it("resolves using a custom root element", async () => {
		const container = document.createElement("div");
		document.body.appendChild(container);

		const promise = waitForElement(".inner", { root: container });

		setTimeout(() => {
			const el = document.createElement("span");
			el.className = "inner";
			container.appendChild(el);
		}, 10);

		const result = await promise;
		expect(result.className).toBe("inner");
	});

	it("rejects after timeout if element is not found", async () => {
		await expect(
			waitForElement(".never-exists", { timeout: 50 }),
		).rejects.toThrow(
			'waitForElement: selector ".never-exists" timed out after 50ms',
		);
	});

	it("resolves and clears the timer when element appears before timeout", async () => {
		const promise = waitForElement(".early", { timeout: 500 });

		setTimeout(() => {
			const el = document.createElement("div");
			el.className = "early";
			document.body.appendChild(el);
		}, 10);

		const result = await promise;
		expect(result.className).toBe("early");
	});
});
