import { findComposerForSendButton, isComposer, isSendButton, readComposer } from "./composer.js";
import { type Finding, inspectMessage } from "./rules.js";

interface PendingReview {
  button: HTMLElement;
  composer: HTMLElement;
  findings: Finding[];
}

let host: HTMLElement | null = null;
let shadow: ShadowRoot | null = null;
let pending: PendingReview | null = null;
const approvedButtons = new WeakSet<HTMLElement>();

function element<T extends Element>(selector: string): T {
  const match = shadow?.querySelector<T>(selector);
  if (!match) throw new Error(`PromiseLock UI element not found: ${selector}`);
  return match;
}

function hidePanel(): void {
  if (host) host.hidden = true;
  pending = null;
}

function render(findings: Finding[], review: PendingReview | null, composer: HTMLElement | null): void {
  if (!host || !shadow) return;
  const title = element<HTMLElement>('[data-role="title"]');
  const intro = element<HTMLElement>('[data-role="intro"]');
  const list = element<HTMLUListElement>('[data-role="list"]');
  const approve = element<HTMLButtonElement>('[data-role="approve"]');
  const edit = element<HTMLButtonElement>('[data-role="edit"]');

  title.textContent = review ? "PromiseLock paused send" : "Check before sending";
  intro.textContent = review
    ? "This message makes a claim that the page cannot prove yet."
    : "PromiseLock found a claim worth checking before you send.";
  list.replaceChildren();
  for (const finding of findings) {
    const item = document.createElement("li");
    item.textContent = finding.title;
    list.append(item);
  }

  approve.hidden = !review;
  edit.textContent = review ? "Keep editing" : "Dismiss";
  host.hidden = false;
  pending = review;

  if (review) {
    approve.focus();
  } else if (composer) {
    composer.setAttribute("data-promiselock-warned", "true");
  }
}

function createUi(): void {
  if (!document.body || host) return;
  host = document.createElement("div");
  host.dataset.promiselockUi = "true";
  host.hidden = true;
  shadow = host.attachShadow({ mode: "closed" });
  shadow.innerHTML = `
    <style>
      :host { all: initial; }
      .card { position: fixed; z-index: 2147483647; right: 20px; bottom: 20px; width: min(360px, calc(100vw - 40px)); box-sizing: border-box; padding: 16px; border: 1px solid #dfef71; border-radius: 14px; background: #11130f; color: #f5f4e9; box-shadow: 0 18px 54px rgba(0,0,0,.4); font: 14px/1.4 system-ui, sans-serif; }
      h2 { margin: 0 0 5px; color: #e4fa74; font-size: 16px; }
      p { margin: 0 0 10px; color: #c5cbbd; }
      ul { margin: 0 0 14px; padding-left: 20px; }
      li { margin: 4px 0; }
      .actions { display: flex; gap: 8px; flex-wrap: wrap; }
      button { border: 1px solid #6f7a4a; border-radius: 8px; padding: 8px 11px; background: #202519; color: #f5f4e9; cursor: pointer; font: inherit; }
      button[data-role="approve"] { border-color: #e4fa74; background: #e4fa74; color: #11130f; font-weight: 700; }
      button:focus-visible { outline: 2px solid #fff; outline-offset: 2px; }
    </style>
    <section class="card" role="alertdialog" aria-live="polite" aria-labelledby="promise-lock-title">
      <h2 id="promise-lock-title" data-role="title"></h2>
      <p data-role="intro"></p>
      <ul data-role="list"></ul>
      <div class="actions">
        <button type="button" data-role="approve" hidden>Send anyway once</button>
        <button type="button" data-role="edit">Keep editing</button>
      </div>
    </section>`;

  element<HTMLButtonElement>('[data-role="approve"]').addEventListener("click", () => {
    if (!pending) return;
    const approved = pending;
    pending = null;
    approvedButtons.add(approved.button);
    hidePanel();
    approved.button.click();
  });

  element<HTMLButtonElement>('[data-role="edit"]').addEventListener("click", () => {
    const composer = pending?.composer;
    hidePanel();
    composer?.focus();
  });

  document.body.append(host);
}

function inspectComposer(composer: HTMLElement): Finding[] {
  const snapshot = readComposer(composer);
  return inspectMessage(snapshot.text, snapshot);
}

function handleInput(event: Event): void {
  const target = event.target;
  if (!(target instanceof Element)) return;
  const composer = isComposer(target) ? target : target.closest<HTMLElement>("textarea, input, [contenteditable='true'], [role='textbox']");
  if (!composer || !isComposer(composer)) return;
  const findings = inspectComposer(composer);
  if (findings.length) render(findings, null, composer);
  else if (!pending) hidePanel();
}

function handleSendClick(event: MouseEvent): void {
  const target = event.target;
  if (!(target instanceof Element) || target.closest("[data-promiselock-ui]")) return;
  const button = target.closest<HTMLElement>("button, [role='button']");
  if (!button || !isSendButton(button)) return;
  if (approvedButtons.has(button)) {
    approvedButtons.delete(button);
    return;
  }

  const composer = findComposerForSendButton(button);
  if (!composer) return;
  const findings = inspectComposer(composer);
  if (!findings.length) return;

  event.preventDefault();
  event.stopPropagation();
  event.stopImmediatePropagation();
  render(findings, { button, composer, findings }, composer);
}

function init(): void {
  if (!document.body || document.documentElement.dataset.promiselockInstalled) return;
  document.documentElement.dataset.promiselockInstalled = "true";
  createUi();
  document.addEventListener("input", handleInput, true);
  document.addEventListener("click", handleSendClick, true);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init, { once: true });
} else {
  init();
}
