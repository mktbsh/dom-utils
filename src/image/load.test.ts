import { describe, expect, it, vi } from "vitest";
import { loadImage } from "./index";

describe("loadImage", () => {
	it("resolves with an HTMLImageElement when decode succeeds", async () => {
		const decodeMock = vi.fn().mockResolvedValue(undefined);
		vi.spyOn(window, "Image").mockImplementation(() => {
			const img = document.createElement("img");
			img.decode = decodeMock;
			return img;
		});

		const img = await loadImage("test.png");
		expect(img).toBeInstanceOf(HTMLImageElement);
		expect(img.src).toContain("test.png");
		expect(decodeMock).toHaveBeenCalled();
	});

	it("rejects when decode fails", async () => {
		vi.spyOn(window, "Image").mockImplementation(() => {
			const img = document.createElement("img");
			img.decode = vi.fn().mockRejectedValue(new Error("decode error"));
			return img;
		});

		await expect(loadImage("bad.png")).rejects.toThrow("decode error");
	});
});
