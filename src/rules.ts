export type FindingKind = "missing-attachment" | "missing-link" | "placeholder";

export interface InspectionEvidence {
  hasAttachment: boolean;
  hasUrl: boolean;
}

export interface Finding {
  kind: FindingKind;
  title: string;
  detail: string;
}

const attachmentClaim = /\b(?:attached|attachment|enclosed|see\s+(?:the\s+)?(?:file|document))\b/i;
const linkClaim = /\b(?:here(?:'s|\s+is)|see)\s+(?:the\s+)?(?:link|url)\b/i;
const urlPattern = /https?:\/\/[^\s<]+/i;
const placeholder = /\[(?:[^\]]*(?:insert|attach|link|todo|tbd)[^\]]*)\]|<(?:[^>]*(?:insert|attach|link|todo|tbd)[^>]*)>|\{\{[^}]+\}\}|\b(?:TODO|TBD)\b/i;

export function inspectMessage(text: string, evidence: InspectionEvidence): Finding[] {
  const findings: Finding[] = [];
  const hasUrl = evidence.hasUrl || urlPattern.test(text);

  if (attachmentClaim.test(text) && !evidence.hasAttachment) {
    findings.push({
      kind: "missing-attachment",
      title: "Attachment claim has no visible file",
      detail: "This message sounds like it includes a file, but PromiseLock cannot see one in the composer.",
    });
  }

  if (linkClaim.test(text) && !hasUrl) {
    findings.push({
      kind: "missing-link",
      title: "Link claim has no visible URL",
      detail: "This message refers to a link, but no URL is present in the message.",
    });
  }

  if (placeholder.test(text)) {
    findings.push({
      kind: "placeholder",
      title: "Unfinished placeholder remains",
      detail: "Replace the placeholder before sending, or choose Send anyway if it is intentional.",
    });
  }

  return findings;
}
