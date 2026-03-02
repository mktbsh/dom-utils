import { afterEach, describe, expect, it, vi } from "vitest";
import { exitFullscreen } from "./exit-fullscreen";
import { isFullscreen } from "./is-fullscreen";
import { onFullscreenChange } from "./on-fullscreen-change";
import { requestFullscreen } from "./request-fullscreen";

describe("requestFullscreen", () => {
	afterEach(() => {
		vi.restoreAllMocks();
	});

	it("calls requestFullscreen on documentElement by default", async () => {
		const spy = vi.fn().mockResolvedValue(undefined);
		Object.defineProperty(document.documentElement, "requestFullscreen", {
			value: spy,
			configurable: true,
			writable: true,
		});
		await requestFullscreen();
		expect(spy).toHaveBeenCalled();
	});

	it("calls requestFullscreen on the provided element", async () => {
		const el = document.createElement("div");
		const spy = vi.fn().mockResolvedValue(undefined);
		Object.defineProperty(el, "requestFullscreen", {
			value: spy,
			configurable: true,
			writable: true,
		});
		await requestFullscreen(el);
		expect(spy).toHaveBeenCalled();
	});
});

describe("exitFullscreen", () => {
	afterEach(() => {
		vi.restoreAllMocks();
	});

	it("calls document.exitFullscreen", async () => {
		const spy = vi.fn().mockResolvedValue(undefined);
		Object.defineProperty(document, "exitFullscreen", {
			value: spy,
			configurable: true,
			writable: true,
		});
		await exitFullscreen();
		expect(spy).toHaveBeenCalled();
	});
});

describe("isFullscreen", () => {
	afterEach(() => {
		vi.restoreAllMocks();
	});

	it("returns true when document.fullscreenElement is set", () => {
		const el = document.createElement("div");
		Object.defineProperty(document, "fullscreenElement", {
			value: el,
			configurable: true,
		});
		expect(isFullscreen()).toBe(true);
	});

	it("returns false when document.fullscreenElement is null", () => {
		Object.defineProperty(document, "fullscreenElement", {
			value: null,
			configurable: true,
		});
		expect(isFullscreen()).toBe(false);
	});
});

describe("onFullscreenChange", () => {
	afterEach(() => {
		vi.restoreAllMocks();
	});

	it("adds a fullscreenchange event listener", () => {
		const addSpy = vi.spyOn(document, "addEventListener");
		const callback = vi.fn();
		onFullscreenChange(callback);
		expect(addSpy).toHaveBeenCalledWith(
			"fullscreenchange",
			expect.any(Function),
		);
	});

	it("calls callback with true when entering fullscreen", () => {
		const el = document.createElement("div");
		Object.defineProperty(document, "fullscreenElement", {
			value: el,
			configurable: true,
		});

		const callback = vi.fn();
		onFullscreenChange(callback);
		document.dispatchEvent(new Event("fullscreenchange"));

		expect(callback).toHaveBeenCalledWith(true);
	});

	it("calls callback with false when exiting fullscreen", () => {
		Object.defineProperty(document, "fullscreenElement", {
			value: null,
			configurable: true,
		});

		const callback = vi.fn();
		onFullscreenChange(callback);
		document.dispatchEvent(new Event("fullscreenchange"));

		expect(callback).toHaveBeenCalledWith(false);
	});

	it("removes the event listener when cleanup is called", () => {
		const removeSpy = vi.spyOn(document, "removeEventListener");
		const callback = vi.fn();
		const cleanup = onFullscreenChange(callback);
		cleanup();

		expect(removeSpy).toHaveBeenCalledWith(
			"fullscreenchange",
			expect.any(Function),
		);
		document.dispatchEvent(new Event("fullscreenchange"));
		expect(callback).not.toHaveBeenCalled();
	});
});
