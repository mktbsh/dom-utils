export function getQueryParams(url?: string): Record<string, string> {
	const target = url !== undefined ? new URL(url, window.location.href) : new URL(window.location.href);
	const result: Record<string, string> = {};
	target.searchParams.forEach((value, key) => {
		result[key] = value;
	});
	return result;
}
