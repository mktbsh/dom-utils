import { afterEach, describe, expect, it, vi } from "vitest";
import { canvasToImage, imageElementToBlob } from "./image";

function createMockCanvas(overrides?: {
	toBlob?: (cb: (b: Blob | null) => void) => void;
	toDataURL?: () => string;
	getContext?: () => CanvasRenderingContext2D | null;
}): HTMLCanvasElement {
	const canvas = document.createElement("canvas");
	canvas.width = 100;
	canvas.height = 100;

	if (overrides?.toBlob) {
		canvas.toBlob = overrides.toBlob as typeof canvas.toBlob;
	}
	if (overrides?.toDataURL) {
		canvas.toDataURL = overrides.toDataURL;
	}
	if (overrides?.getContext) {
		vi.spyOn(canvas, "getContext").mockImplementation(
			overrides.getContext as typeof canvas.getContext,
		);
	}
	return canvas;
}

describe("canvasToImage", () => {
	afterEach(() => {
		vi.restoreAllMocks();
	});

	it("resolves with a Blob when output is blob", async () => {
		const mockBlob = new Blob(["data"], { type: "image/png" });
		const canvas = createMockCanvas({
			toBlob: (cb) => cb(mockBlob),
		});

		const result = await canvasToImage(canvas, "blob");
		expect(result).toBe(mockBlob);
	});

	it("rejects when toBlob returns null", async () => {
		const canvas = createMockCanvas({
			toBlob: (cb) => cb(null),
		});

		await expect(canvasToImage(canvas, "blob")).rejects.toBe(
			"Failed to convert canvas to blob",
		);
	});

	it("resolves with a data URL when output is dataURL", async () => {
		const canvas = createMockCanvas({
			toDataURL: () => "data:image/png;base64,abc",
		});

		const result = await canvasToImage(canvas, "dataURL");
		expect(result).toBe("data:image/png;base64,abc");
	});

	it("passes type and quality options to toBlob", async () => {
		const mockBlob = new Blob([], { type: "image/jpeg" });
		const toBlobSpy = vi.fn((cb: (b: Blob | null) => void) => cb(mockBlob));
		const canvas = createMockCanvas({ toBlob: toBlobSpy });

		await canvasToImage(canvas, "blob", { type: "jpeg", quality: 0.8 });
		expect(toBlobSpy).toHaveBeenCalledWith(
			expect.any(Function),
			"image/jpeg",
			0.8,
		);
	});

	it("passes type and quality options to toDataURL", async () => {
		const toDataURLSpy = vi.fn(() => "data:image/webp;base64,xyz");
		const canvas = createMockCanvas({ toDataURL: toDataURLSpy });

		await canvasToImage(canvas, "dataURL", { type: "webp", quality: 0.9 });
		expect(toDataURLSpy).toHaveBeenCalledWith("image/webp", 0.9);
	});

	it("applies width resize option", async () => {
		const mockBlob = new Blob([], { type: "image/png" });
		const drawSpy = vi.fn();
		const ctxMock = {
			drawImage: drawSpy,
		} as unknown as CanvasRenderingContext2D;
		const canvas = createMockCanvas({
			toBlob: (cb) => cb(mockBlob),
			getContext: () => ctxMock,
		});
		canvas.width = 200;
		canvas.height = 100;

		await canvasToImage(canvas, "blob", {
			resize: { dimension: "width", size: 100 },
		});
		// ratio = 200/100 = 2; resizedWidth = 100, resizedHeight = 100/2 = 50
		expect(canvas.width).toBe(100);
		expect(canvas.height).toBe(50);
	});

	it("applies height resize option", async () => {
		const mockBlob = new Blob([], { type: "image/png" });
		const drawSpy = vi.fn();
		const ctxMock = {
			drawImage: drawSpy,
		} as unknown as CanvasRenderingContext2D;
		const canvas = createMockCanvas({
			toBlob: (cb) => cb(mockBlob),
			getContext: () => ctxMock,
		});
		canvas.width = 100;
		canvas.height = 200;

		await canvasToImage(canvas, "blob", {
			resize: { dimension: "height", size: 100 },
		});
		// ratio = 200/100 = 2; resizedHeight = 100, resizedWidth = 100/2 = 50
		expect(canvas.height).toBe(100);
		expect(canvas.width).toBe(50);
	});

	it("rejects when toBlob throws", async () => {
		const canvas = createMockCanvas({
			toBlob: () => {
				throw new Error("toBlob error");
			},
		});

		await expect(canvasToImage(canvas, "blob")).rejects.toThrow("toBlob error");
	});
});

describe("imageElementToBlob", () => {
	afterEach(() => {
		vi.restoreAllMocks();
	});

	it("converts an img element to a Blob", async () => {
		const img = document.createElement("img");
		Object.defineProperty(img, "naturalWidth", {
			value: 100,
			configurable: true,
		});
		Object.defineProperty(img, "naturalHeight", {
			value: 100,
			configurable: true,
		});

		const mockBlob = new Blob(["img"], { type: "image/png" });
		vi.spyOn(HTMLCanvasElement.prototype, "toBlob").mockImplementation((cb) =>
			cb(mockBlob),
		);
		vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue({
			drawImage: vi.fn(),
		} as unknown as CanvasRenderingContext2D);

		const result = await imageElementToBlob(img);
		expect(result).toBe(mockBlob);
	});
});
