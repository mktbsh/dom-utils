type QueryParamValue = string | number | boolean;

export function buildQueryString(
	params: Record<string, QueryParamValue>,
): string {
	return new URLSearchParams(
		Object.entries(params).map(([k, v]) => [k, String(v)]),
	).toString();
}
