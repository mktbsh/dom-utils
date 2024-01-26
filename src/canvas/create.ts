import { ctx2d } from "./_internal";

export function createCanvasElement(ref?: HTMLImageElement | HTMLVideoElement): HTMLCanvasElement {
	const canvas = document.createElement("canvas");

	if (!ref) return canvas;

	const isImg = ref instanceof HTMLImageElement;
	canvas.height = isImg ? ref.naturalHeight : ref.videoHeight;
	canvas.width = isImg ? ref.naturalWidth : ref.videoWidth;
	ctx2d(canvas)?.drawImage(ref, 0, 0, canvas.width, canvas.height);

	return canvas;
}
