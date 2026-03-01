export function onOutsideClick(el: Element, callback: (e: MouseEvent) => void): () => void {
	const handler = (e: MouseEvent) => {
		if (!el.contains(e.target as Node)) {
			callback(e);
		}
	};
	document.addEventListener("mousedown", handler);
	return () => document.removeEventListener("mousedown", handler);
}
