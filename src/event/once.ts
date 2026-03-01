export function once<K extends keyof HTMLElementEventMap>(
	el: EventTarget,
	event: K,
	handler: (e: HTMLElementEventMap[K]) => void,
): void {
	el.addEventListener(event, handler as EventListener, { once: true });
}
