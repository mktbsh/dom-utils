import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { headlessFilePicker } from "./headless-file-picker";

describe("headlessFilePicker", () => {
	let clickSpy: ReturnType<typeof vi.spyOn>;
	let inputElement: HTMLInputElement;

	beforeEach(() => {
		inputElement = document.createElement("input");
		vi.spyOn(document, "createElement").mockImplementation((tag: string) => {
			if (tag === "input") return inputElement;
			return document.createElement(tag);
		});
		clickSpy = vi.spyOn(inputElement, "click").mockImplementation(() => {});
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	it("resolves with the FileList when files are selected", async () => {
		const promise = headlessFilePicker({ accept: "image/*", multiple: false });

		// Simulate file selection
		const file = new File(["content"], "test.txt", { type: "text/plain" });
		const dataTransfer = new DataTransfer();
		dataTransfer.items.add(file);
		Object.defineProperty(inputElement, "files", { value: dataTransfer.files, configurable: true });

		inputElement.dispatchEvent(new Event("change"));

		const result = await promise;
		expect(result).toBeDefined();
		expect(result[0].name).toBe("test.txt");
		expect(clickSpy).toHaveBeenCalled();
	});

	it("rejects when no files are available", async () => {
		const promise = headlessFilePicker({ accept: "*", multiple: true });

		// Simulate change event with no files
		Object.defineProperty(inputElement, "files", { value: null, configurable: true });
		inputElement.dispatchEvent(new Event("change"));

		await expect(promise).rejects.toBe("No files selected");
	});

	it("sets accept and multiple from options", async () => {
		headlessFilePicker({ accept: "image/*", multiple: true });
		expect(inputElement.accept).toBe("image/*");
		expect(inputElement.multiple).toBe(true);
	});

	it("uses default values when accept and multiple are not provided", async () => {
		headlessFilePicker({ accept: "*", multiple: false });
		expect(inputElement.accept).toBe("*");
		expect(inputElement.multiple).toBe(false);
	});
});
