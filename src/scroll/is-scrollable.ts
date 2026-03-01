export function isScrollable(el: Element): boolean {
	const style = window.getComputedStyle(el);
	const overflowY = style.overflowY;
	const overflowX = style.overflowX;
	const canScrollY = (overflowY === "auto" || overflowY === "scroll") && el.scrollHeight > el.clientHeight;
	const canScrollX = (overflowX === "auto" || overflowX === "scroll") && el.scrollWidth > el.clientWidth;
	return canScrollY || canScrollX;
}
