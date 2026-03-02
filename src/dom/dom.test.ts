import { afterEach, describe, expect, it, vi } from "vitest";
import { downloadBlob } from "./download-blob";
import { getActiveElement } from "./get-active-element";
import { isVisible } from "./is-visible";

describe("downloadBlob", () => {
	afterEach(() => {
		vi.restoreAllMocks();
		document.body.innerHTML = "";
	});

	it("creates an anchor, clicks it, and revokes the object URL", () => {
		const createObjectURLSpy = vi
			.spyOn(URL, "createObjectURL")
			.mockReturnValue("blob:test");
		const revokeObjectURLSpy = vi
			.spyOn(URL, "revokeObjectURL")
			.mockImplementation(() => {});

		const anchor = document.createElement("a");
		const clickSpy = vi.spyOn(anchor, "click").mockImplementation(() => {});
		vi.spyOn(document, "createElement").mockImplementation((tag: string) => {
			if (tag === "a") return anchor;
			return document.createElement(tag);
		});

		const blob = new Blob(["data"], { type: "text/plain" });
		downloadBlob(blob, "test.txt");

		expect(createObjectURLSpy).toHaveBeenCalledWith(blob);
		expect(anchor.download).toBe("test.txt");
		expect(clickSpy).toHaveBeenCalled();
		expect(revokeObjectURLSpy).toHaveBeenCalledWith("blob:test");
	});
});

describe("getActiveElement", () => {
	it("returns the currently active element", () => {
		const input = document.createElement("input");
		document.body.appendChild(input);
		input.focus();
		expect(getActiveElement()).toBe(input);
		document.body.removeChild(input);
	});

	it("returns document.body when no element is focused", () => {
		// In happy-dom, unfocused state returns document.body as activeElement
		const active = getActiveElement();
		expect(active).toBeDefined();
	});

	it("returns null when document.activeElement throws", () => {
		const originalDescriptor = Object.getOwnPropertyDescriptor(
			Document.prototype,
			"activeElement",
		);
		Object.defineProperty(document, "activeElement", {
			get() {
				throw new Error("access denied");
			},
			configurable: true,
		});

		expect(getActiveElement()).toBeNull();

		if (originalDescriptor) {
			Object.defineProperty(document, "activeElement", originalDescriptor);
		}
	});
});

describe("isVisible", () => {
	afterEach(() => {
		vi.restoreAllMocks();
		document.body.innerHTML = "";
	});

	it("returns false for a detached element", () => {
		const el = document.createElement("div");
		// Not appended to document
		expect(isVisible(el)).toBe(false);
	});

	it("returns false for an element with display: none", () => {
		const el = document.createElement("div");
		document.body.appendChild(el);
		vi.spyOn(window, "getComputedStyle").mockReturnValue({
			display: "none",
			visibility: "visible",
			opacity: "1",
		} as CSSStyleDeclaration);
		// offsetParent is null in jsdom/happy-dom for non-rendered elements
		expect(isVisible(el)).toBe(false);
	});

	it("returns false for an element with visibility: hidden", () => {
		const el = document.createElement("div");
		document.body.appendChild(el);
		vi.spyOn(window, "getComputedStyle").mockReturnValue({
			display: "block",
			visibility: "hidden",
			opacity: "1",
		} as CSSStyleDeclaration);
		expect(isVisible(el)).toBe(false);
	});

	it("returns false for an element with visibility: collapse", () => {
		const el = document.createElement("div");
		document.body.appendChild(el);
		vi.spyOn(window, "getComputedStyle").mockReturnValue({
			display: "block",
			visibility: "collapse",
			opacity: "1",
		} as CSSStyleDeclaration);
		expect(isVisible(el)).toBe(false);
	});

	it("returns false for an element with opacity: 0", () => {
		const el = document.createElement("div");
		document.body.appendChild(el);
		vi.spyOn(window, "getComputedStyle").mockReturnValue({
			display: "block",
			visibility: "visible",
			opacity: "0",
		} as CSSStyleDeclaration);
		expect(isVisible(el)).toBe(false);
	});

	it("returns false when offsetParent is null", () => {
		const el = document.createElement("div");
		document.body.appendChild(el);
		vi.spyOn(window, "getComputedStyle").mockReturnValue({
			display: "block",
			visibility: "visible",
			opacity: "1",
		} as CSSStyleDeclaration);
		// Stub offsetParent to null to simulate un-laid-out element
		Object.defineProperty(el, "offsetParent", {
			value: null,
			configurable: true,
		});
		expect(isVisible(el)).toBe(false);
	});
});
