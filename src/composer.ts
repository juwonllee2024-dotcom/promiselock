export interface ComposerSnapshot {
  text: string;
  hasAttachment: boolean;
  hasUrl: boolean;
}

const urlPattern = /https?:\/\/[^\s<]+/i;

export function isLikelySendLabel(label: string): boolean {
  return /\b(?:send|submit|post|reply)\b/i.test(label) && !/\b(?:save|attach|upload)\b/i.test(label);
}

export function isComposer(element: Element): element is HTMLElement {
  if (!(element instanceof HTMLElement)) return false;
  return element.matches("textarea, input:not([type]), input[type='text'], [contenteditable='true'], [role='textbox']");
}

export function findComposerForSendButton(button: Element): HTMLElement | null {
  const form = button.closest("form");
  if (!form) return null;

  const candidates = Array.from(form.querySelectorAll<HTMLElement>(
    "textarea, input:not([type]), input[type='text'], [contenteditable='true'], [role='textbox']",
  ));
  return candidates.find(isComposer) ?? null;
}

function composerText(composer: HTMLElement): string {
  if (composer instanceof HTMLTextAreaElement || composer instanceof HTMLInputElement) {
    return composer.value;
  }
  return composer.innerText || composer.textContent || "";
}

function hasVisibleAttachment(composer: HTMLElement): boolean {
  const scope = composer.closest("form") ?? composer.parentElement ?? composer;
  const fileInputs = Array.from(scope.querySelectorAll<HTMLInputElement>("input[type='file']"));
  if (fileInputs.some((input) => Boolean(input.files?.length))) return true;

  return Boolean(scope.querySelector("[data-promiselock-attachment], .promiselock-attachment"));
}

export function readComposer(composer: HTMLElement): ComposerSnapshot {
  const text = composerText(composer);
  return {
    text,
    hasAttachment: hasVisibleAttachment(composer),
    hasUrl: urlPattern.test(text),
  };
}

export function sendLabel(element: Element): string {
  return [
    element.textContent,
    element.getAttribute("aria-label"),
    element.getAttribute("title"),
    element.getAttribute("data-testid"),
  ]
    .filter(Boolean)
    .join(" ")
    .trim();
}

export function isSendButton(element: Element): element is HTMLElement {
  const button = element.closest("button, [role='button']");
  return Boolean(button && isLikelySendLabel(sendLabel(button)));
}
