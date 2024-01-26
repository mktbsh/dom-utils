import { ctx2d } from "./_internal";
import { createCanvasElement } from "./create";
import { ImageOptions, ResizeOption } from "./types";

export async function imageElementToBlob(img: HTMLImageElement, options?: ImageOptions) {
	const canvas = createCanvasElement(img);
	return canvasToImage(canvas, "blob", options);
}

export async function canvasToImage<T extends "blob" | "dataURL">(
	canvas: HTMLCanvasElement,
	output: T,
	options?: ImageOptions,
): Promise<T extends "blob" ? Blob : string> {
	const type = options?.type ? `image/${options.type}` : undefined;
	const quality = options?.quality;

	if (options?.resize) {
		canvasResize(canvas, options.resize);
	}

	return new Promise<T extends "blob" ? Blob : string>((resolve, reject) => {
		try {
			if (output === "blob") {
				canvas.toBlob(
					(b) => (b ? resolve(b as T extends "blob" ? Blob : string) : reject("Failed to convert canvas to blob")),
					type,
					quality,
				);
			}
			if (output === "dataURL") {
				const dataURL = canvas.toDataURL(type, quality);
				resolve(dataURL as T extends "blob" ? Blob : string);
			}
		} catch (e) {
			reject(e);
		}
	});
}

function canvasResize(canvas: HTMLCanvasElement, resize: ResizeOption): void {
	const { dimension, size } = resize;

	const isWidth = dimension === "width";

	const oldWidth = canvas.width;
	const oldHeight = canvas.height;

	const ratio = (isWidth ? oldWidth : oldHeight) / size;

	const resizedWidth = isWidth ? size : oldWidth / ratio;
	const resizedHeight = !isWidth ? size : oldHeight / ratio;

	canvas.height = resizedHeight;
	canvas.width = resizedWidth;

	ctx2d(canvas)?.drawImage(canvas, 0, 0, oldWidth, oldHeight, 0, 0, resizedWidth, resizedHeight);
}
