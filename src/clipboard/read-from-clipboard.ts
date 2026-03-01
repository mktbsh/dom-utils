export async function readFromClipboard(): Promise<string> {
	if (!navigator.clipboard) {
		throw new Error("readFromClipboard: Clipboard API not available");
	}
	return navigator.clipboard.readText();
}
