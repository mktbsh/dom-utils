import { describe, expect, it } from "vitest";
import { buildQueryString } from "./build-query-string";
import { getQueryParams } from "./get-query-params";

describe("getQueryParams", () => {
	it("parses query params from the current URL when no argument is given", () => {
		// happy-dom default URL is about:blank, so no params
		const params = getQueryParams("https://example.com/?foo=bar&baz=qux");
		expect(params).toEqual({ foo: "bar", baz: "qux" });
	});

	it("returns an empty object when there are no query params", () => {
		expect(getQueryParams("https://example.com/")).toEqual({});
	});

	it("parses a relative URL using the current page as base", () => {
		// With happy-dom, window.location.href is 'about:blank'
		// Relative URLs like '?foo=1' aren't valid with 'about:blank' base,
		// so we pass an absolute URL
		const params = getQueryParams("https://example.com/page?name=test");
		expect(params).toEqual({ name: "test" });
	});

	it("handles duplicate keys (last value wins due to forEach iteration)", () => {
		const params = getQueryParams("https://example.com/?a=1&a=2");
		// URLSearchParams.forEach iterates all entries; last occurrence wins in Record assignment
		expect(params.a).toBe("2");
	});

	it("parses params from window.location.href when no argument given", () => {
		// This path hits the else branch; default URL is about:blank with no params
		const params = getQueryParams();
		expect(params).toEqual({});
	});
});

describe("buildQueryString", () => {
	it("builds a query string from string values", () => {
		const qs = buildQueryString({ foo: "bar", baz: "qux" });
		expect(qs).toContain("foo=bar");
		expect(qs).toContain("baz=qux");
	});

	it("stringifies number values", () => {
		expect(buildQueryString({ count: 42 })).toBe("count=42");
	});

	it("stringifies boolean values", () => {
		expect(buildQueryString({ active: true })).toBe("active=true");
	});

	it("returns empty string for empty object", () => {
		expect(buildQueryString({})).toBe("");
	});
});
