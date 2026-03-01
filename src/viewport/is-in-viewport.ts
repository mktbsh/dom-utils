export function isInViewport(el: Element): boolean {
	const rect = el.getBoundingClientRect();
	return (
		rect.top < window.innerHeight &&
		rect.bottom > 0 &&
		rect.left < window.innerWidth &&
		rect.right > 0
	);
}
