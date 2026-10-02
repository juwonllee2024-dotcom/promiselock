import { describe, expect, it } from "vitest";
import { isLikelySendLabel } from "../src/composer.js";

describe("isLikelySendLabel", () => {
  it("recognizes explicit send controls", () => {
    expect(isLikelySendLabel("Send message")).toBe(true);
    expect(isLikelySendLabel("submit reply")).toBe(true);
  });

  it("does not claim unrelated controls", () => {
    expect(isLikelySendLabel("Save draft")).toBe(false);
    expect(isLikelySendLabel("Attach file")).toBe(false);
  });
});
