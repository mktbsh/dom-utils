import { afterEach, describe, expect, it, vi } from "vitest";
import { copyToClipboard } from "./copy-to-clipboard";
import { readFromClipboard } from "./read-from-clipboard";

describe("copyToClipboard", () => {
	afterEach(() => {
		vi.restoreAllMocks();
		vi.unstubAllGlobals();
	});

	it("uses navigator.clipboard.writeText when available", async () => {
		const writeTextSpy = vi.fn().mockResolvedValue(undefined);
		vi.stubGlobal("navigator", {
			clipboard: { writeText: writeTextSpy },
		});

		await copyToClipboard("hello");
		expect(writeTextSpy).toHaveBeenCalledWith("hello");
	});

	it("falls back to execCommand when clipboard API is not available", async () => {
		vi.stubGlobal("navigator", { clipboard: undefined });
		// happy-dom doesn't implement execCommand, so define it
		const execCommandSpy = vi.fn().mockReturnValue(true);
		Object.defineProperty(document, "execCommand", {
			value: execCommandSpy,
			configurable: true,
			writable: true,
		});

		await copyToClipboard("fallback text");
		expect(execCommandSpy).toHaveBeenCalledWith("copy");
	});

	it("throws when execCommand fails", async () => {
		vi.stubGlobal("navigator", { clipboard: undefined });
		Object.defineProperty(document, "execCommand", {
			value: vi.fn().mockReturnValue(false),
			configurable: true,
			writable: true,
		});

		await expect(copyToClipboard("fail")).rejects.toThrow("copyToClipboard: execCommand failed");
	});
});

describe("readFromClipboard", () => {
	afterEach(() => {
		vi.unstubAllGlobals();
	});

	it("reads text using navigator.clipboard.readText", async () => {
		const readTextSpy = vi.fn().mockResolvedValue("clipboard content");
		vi.stubGlobal("navigator", {
			clipboard: { readText: readTextSpy },
		});

		const result = await readFromClipboard();
		expect(result).toBe("clipboard content");
		expect(readTextSpy).toHaveBeenCalled();
	});

	it("throws when clipboard API is not available", async () => {
		vi.stubGlobal("navigator", { clipboard: undefined });

		await expect(readFromClipboard()).rejects.toThrow("readFromClipboard: Clipboard API not available");
	});
});
