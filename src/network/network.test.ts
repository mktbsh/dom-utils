import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { isOnline } from "./is-online";
import { onNetworkChange } from "./on-network-change";

describe("isOnline", () => {
	afterEach(() => {
		vi.unstubAllGlobals();
	});

	it("returns true when navigator.onLine is true", () => {
		vi.stubGlobal("navigator", { onLine: true });
		expect(isOnline()).toBe(true);
	});

	it("returns false when navigator.onLine is false", () => {
		vi.stubGlobal("navigator", { onLine: false });
		expect(isOnline()).toBe(false);
	});
});

describe("onNetworkChange", () => {
	beforeEach(() => {
		vi.spyOn(window, "addEventListener");
		vi.spyOn(window, "removeEventListener");
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	it("adds online and offline event listeners", () => {
		const callback = vi.fn();
		onNetworkChange(callback);
		expect(window.addEventListener).toHaveBeenCalledWith(
			"online",
			expect.any(Function),
		);
		expect(window.addEventListener).toHaveBeenCalledWith(
			"offline",
			expect.any(Function),
		);
	});

	it("calls callback with true when online event fires", () => {
		const callback = vi.fn();
		onNetworkChange(callback);
		window.dispatchEvent(new Event("online"));
		expect(callback).toHaveBeenCalledWith(true);
	});

	it("calls callback with false when offline event fires", () => {
		const callback = vi.fn();
		onNetworkChange(callback);
		window.dispatchEvent(new Event("offline"));
		expect(callback).toHaveBeenCalledWith(false);
	});

	it("removes event listeners when cleanup is called", () => {
		const callback = vi.fn();
		const cleanup = onNetworkChange(callback);
		cleanup();
		expect(window.removeEventListener).toHaveBeenCalledWith(
			"online",
			expect.any(Function),
		);
		expect(window.removeEventListener).toHaveBeenCalledWith(
			"offline",
			expect.any(Function),
		);
	});
});
