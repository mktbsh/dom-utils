export function onFullscreenChange(callback: (isFullscreen: boolean) => void): () => void {
	const handler = () => callback(document.fullscreenElement !== null);
	document.addEventListener("fullscreenchange", handler);
	return () => document.removeEventListener("fullscreenchange", handler);
}
