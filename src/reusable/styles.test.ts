import { describe, expect, it } from "vitest";
import { SIZE_FULL } from "./styles";

describe("SIZE_FULL", () => {
	it('equals "100%"', () => {
		expect(SIZE_FULL).toBe("100%");
	});
});
