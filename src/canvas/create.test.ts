import { afterEach, describe, expect, it, vi } from "vitest";
import { createCanvasElement } from "./create";

describe("createCanvasElement", () => {
	afterEach(() => {
		vi.restoreAllMocks();
	});

	it("returns a canvas element when called with no argument", () => {
		const canvas = createCanvasElement();
		expect(canvas).toBeInstanceOf(HTMLCanvasElement);
		// Default canvas dimensions per HTML spec are 300×150
		expect(canvas.width).toBe(300);
		expect(canvas.height).toBe(150);
	});

	it("sets canvas dimensions from an img element's natural size and draws it", () => {
		const img = document.createElement("img");
		Object.defineProperty(img, "naturalWidth", {
			value: 800,
			configurable: true,
		});
		Object.defineProperty(img, "naturalHeight", {
			value: 600,
			configurable: true,
		});

		const drawSpy = vi.fn();
		const ctxMock = {
			drawImage: drawSpy,
		} as unknown as CanvasRenderingContext2D;
		vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(
			ctxMock as never,
		);

		const canvas = createCanvasElement(img);
		expect(canvas.width).toBe(800);
		expect(canvas.height).toBe(600);
		expect(drawSpy).toHaveBeenCalledWith(img, 0, 0, 800, 600);
	});

	it("sets canvas dimensions from a video element's video size and draws it", () => {
		const video = document.createElement("video");
		Object.defineProperty(video, "videoWidth", {
			value: 1920,
			configurable: true,
		});
		Object.defineProperty(video, "videoHeight", {
			value: 1080,
			configurable: true,
		});

		const drawSpy = vi.fn();
		const ctxMock = {
			drawImage: drawSpy,
		} as unknown as CanvasRenderingContext2D;
		vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(
			ctxMock as never,
		);

		const canvas = createCanvasElement(video);
		expect(canvas.width).toBe(1920);
		expect(canvas.height).toBe(1080);
		expect(drawSpy).toHaveBeenCalledWith(video, 0, 0, 1920, 1080);
	});

	it("handles null context (getContext returns null)", () => {
		const img = document.createElement("img");
		Object.defineProperty(img, "naturalWidth", {
			value: 100,
			configurable: true,
		});
		Object.defineProperty(img, "naturalHeight", {
			value: 100,
			configurable: true,
		});

		vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(null);

		// Should not throw even when ctx2d returns null
		expect(() => createCanvasElement(img)).not.toThrow();
	});
});
