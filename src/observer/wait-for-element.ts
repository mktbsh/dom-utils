import { WaitForElementOptions } from "./types";

export function waitForElement(selector: string, options?: WaitForElementOptions): Promise<Element> {
	return new Promise((resolve, reject) => {
		const root = options?.root ?? document.body;
		const existing = root.querySelector(selector);
		if (existing) {
			resolve(existing);
			return;
		}

		let timer: ReturnType<typeof setTimeout> | undefined;
		const observer = new MutationObserver(() => {
			const el = root.querySelector(selector);
			if (el) {
				if (timer !== undefined) clearTimeout(timer);
				observer.disconnect();
				resolve(el);
			}
		});

		if (options?.timeout !== undefined) {
			timer = setTimeout(() => {
				observer.disconnect();
				reject(new Error(`waitForElement: selector "${selector}" timed out after ${options.timeout}ms`));
			}, options.timeout);
		}

		observer.observe(root, { childList: true, subtree: true });
	});
}
