export function getActiveElement(): Element | null {
	try {
		return document.activeElement;
	} catch {
		return null;
	}
}
