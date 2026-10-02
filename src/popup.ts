const enable = document.querySelector<HTMLButtonElement>("#enable");
const statusElement = document.querySelector<HTMLElement>("#status");

enable?.addEventListener("click", async () => {
  if (!enable || !statusElement) return;
  enable.disabled = true;
  statusElement.textContent = "Enabling on this tab…";

  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab.id) throw new Error("No active tab found.");
    await chrome.scripting.executeScript({ target: { tabId: tab.id }, files: ["content.js"] });
    statusElement.textContent = "Enabled. PromiseLock will pause risky sends here.";
  } catch (error) {
    statusElement.textContent = error instanceof Error ? error.message : "Chrome rejected this tab.";
    enable.disabled = false;
  }
});

export {};
