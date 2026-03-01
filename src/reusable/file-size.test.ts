import { describe, expect, it } from "vitest";
import { fileSize } from "./file-size";

describe("fileSize", () => {
	it("formats bytes", () => {
		expect(fileSize({ source: 500 })).toBe("500.00 B");
	});

	it("formats kilobytes", () => {
		expect(fileSize({ source: 1024 })).toBe("1.00 KB");
	});

	it("formats megabytes", () => {
		expect(fileSize({ source: 1024 * 1024 })).toBe("1.00 MB");
	});

	it("formats gigabytes", () => {
		expect(fileSize({ source: 1024 ** 3 })).toBe("1.00 GB");
	});

	it("formats terabytes", () => {
		expect(fileSize({ source: 1024 ** 4 })).toBe("1.00 TB");
	});

	it("formats petabytes", () => {
		expect(fileSize({ source: 1024 ** 5 })).toBe("1.00 PB");
	});

	it("accepts a Blob as source", () => {
		const blob = new Blob(["hello"], { type: "text/plain" });
		expect(fileSize({ source: blob })).toBe("5.00 B");
	});

	it("respects the digit option", () => {
		expect(fileSize({ source: 1500, digit: 0 })).toBe("1 KB");
	});

	it("uses digit=2 by default", () => {
		expect(fileSize({ source: 0 })).toBe("0.00 B");
	});
});
