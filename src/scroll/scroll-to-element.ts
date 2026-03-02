export function scrollToElement(
	el: Element,
	options?: ScrollIntoViewOptions,
): void {
	el.scrollIntoView(options ?? { behavior: "smooth" });
}
