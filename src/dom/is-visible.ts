export function isVisible(el: HTMLElement): boolean {
	if (!el.isConnected) return false;
	const style = window.getComputedStyle(el);
	return (
		style.display !== "none" &&
		style.visibility !== "hidden" &&
		style.visibility !== "collapse" &&
		style.opacity !== "0" &&
		el.offsetParent !== null
	);
}
