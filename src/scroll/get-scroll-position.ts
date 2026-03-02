import type { ScrollPosition } from "./types";

export function getScrollPosition(): ScrollPosition {
	return { x: window.scrollX, y: window.scrollY };
}
