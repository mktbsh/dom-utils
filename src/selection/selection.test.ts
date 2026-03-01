import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { clearSelection } from "./clear-selection";
import { getSelectedText } from "./get-selected-text";

describe("getSelectedText", () => {
	afterEach(() => {
		vi.restoreAllMocks();
	});

	it("returns the selected text", () => {
		const selectionMock = { toString: () => "hello world" } as Selection;
		vi.spyOn(window, "getSelection").mockReturnValue(selectionMock);
		expect(getSelectedText()).toBe("hello world");
	});

	it("returns empty string when getSelection returns null", () => {
		vi.spyOn(window, "getSelection").mockReturnValue(null);
		expect(getSelectedText()).toBe("");
	});
});

describe("clearSelection", () => {
	afterEach(() => {
		vi.restoreAllMocks();
	});

	it("calls removeAllRanges on the selection", () => {
		const removeAllRangesSpy = vi.fn();
		const selectionMock = { removeAllRanges: removeAllRangesSpy } as unknown as Selection;
		vi.spyOn(window, "getSelection").mockReturnValue(selectionMock);
		clearSelection();
		expect(removeAllRangesSpy).toHaveBeenCalled();
	});

	it("does not throw when getSelection returns null", () => {
		vi.spyOn(window, "getSelection").mockReturnValue(null);
		expect(() => clearSelection()).not.toThrow();
	});
});
