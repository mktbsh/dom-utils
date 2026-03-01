export function requestFullscreen(el?: Element): Promise<void> {
	return (el ?? document.documentElement).requestFullscreen();
}
