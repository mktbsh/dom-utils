export function onElementResize(
	el: Element,
	callback: (entry: ResizeObserverEntry) => void,
): () => void {
	const observer = new ResizeObserver((entries) =>
		entries.forEach((entry) => void callback(entry)),
	);
	observer.observe(el);
	return () => observer.disconnect();
}
