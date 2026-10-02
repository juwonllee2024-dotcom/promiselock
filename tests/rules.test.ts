import { describe, expect, it } from "vitest";
import { inspectMessage } from "../src/rules.js";

describe("inspectMessage", () => {
  it("finds attachment claims when no attachment is visible", () => {
    const findings = inspectMessage("I attached the invoice for review.", {
      hasAttachment: false,
      hasUrl: false,
    });

    expect(findings.map((finding) => finding.kind)).toEqual(["missing-attachment"]);
  });

  it("does not warn about an attachment claim when an attachment is visible", () => {
    const findings = inspectMessage("I attached the invoice for review.", {
      hasAttachment: true,
      hasUrl: false,
    });

    expect(findings).toEqual([]);
  });

  it("finds link claims without a URL", () => {
    const findings = inspectMessage("Here is the link you requested.", {
      hasAttachment: false,
      hasUrl: false,
    });

    expect(findings.map((finding) => finding.kind)).toEqual(["missing-link"]);
  });

  it("finds unfinished insertion placeholders", () => {
    const findings = inspectMessage("Please review [insert final link] before sending.", {
      hasAttachment: false,
      hasUrl: false,
    });

    expect(findings.map((finding) => finding.kind)).toEqual(["placeholder"]);
  });

  it("leaves a complete message alone", () => {
    const findings = inspectMessage("The report is ready: https://example.com/report", {
      hasAttachment: false,
      hasUrl: true,
    });

    expect(findings).toEqual([]);
  });
});
