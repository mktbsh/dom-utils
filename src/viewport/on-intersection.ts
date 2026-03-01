export function onIntersection(
	el: Element,
	callback: (entry: IntersectionObserverEntry) => void,
	options?: IntersectionObserverInit,
): () => void {
	const observer = new IntersectionObserver(
		(entries) => entries.forEach((entry) => callback(entry)),
		options,
	);
	observer.observe(el);
	return () => observer.disconnect();
}
