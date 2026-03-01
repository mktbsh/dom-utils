import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { isDarkMode } from "./theme";

describe("isDarkMode", () => {
	beforeEach(() => {
		vi.stubGlobal("matchMedia", vi.fn());
	});

	afterEach(() => {
		vi.unstubAllGlobals();
	});

	it("returns true when prefers-color-scheme is dark", () => {
		vi.mocked(window.matchMedia).mockReturnValue({ matches: true } as MediaQueryList);
		expect(isDarkMode()).toBe(true);
	});

	it("returns false when prefers-color-scheme is not dark", () => {
		vi.mocked(window.matchMedia).mockReturnValue({ matches: false } as MediaQueryList);
		expect(isDarkMode()).toBe(false);
	});
});
