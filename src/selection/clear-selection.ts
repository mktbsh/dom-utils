export function clearSelection(): void {
	window.getSelection()?.removeAllRanges();
}
