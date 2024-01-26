
export function ctx2d(canvas: HTMLCanvasElement): CanvasRenderingContext2D | null {
	return canvas.getContext("2d");
}
