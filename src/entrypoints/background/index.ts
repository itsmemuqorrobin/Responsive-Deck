const DASHBOARD_TAB_IDS_KEY = "responsiveDeck.dashboardTabIds";

function getOptionsUrl() {
  const path = getRegisteredOptionsPath();
  return path ? browser.runtime.getURL(path) : "";
}

export default defineBackground(() => {
  browser.runtime.onInstalled.addListener(async () => {
    const RULE_ID = 1;

    await browser.declarativeNetRequest.updateDynamicRules({
      removeRuleIds: [RULE_ID],
    });

    await browser.declarativeNetRequest.updateDynamicRules({
      addRules: [
        {
          id: RULE_ID,
          priority: 1,
          action: {
            type: browser.declarativeNetRequest.RuleActionType.MODIFY_HEADERS,
            responseHeaders: [
              {
                header: "x-frame-options",
                operation: browser.declarativeNetRequest.HeaderOperation.REMOVE,
              },
              {
                header: "content-security-policy",
                operation: browser.declarativeNetRequest.HeaderOperation.REMOVE,
              },
              {
                header: "content-security-policy-report-only",
                operation: browser.declarativeNetRequest.HeaderOperation.REMOVE,
              },
              {
                header: "frame-options",
                operation: browser.declarativeNetRequest.HeaderOperation.REMOVE,
              },
            ],
          },
          condition: {
            urlFilter: "*",
            resourceTypes: [
              browser.declarativeNetRequest.ResourceType.SUB_FRAME,
            ],
            initiatorDomains: [browser.runtime.id],
          },
        },
      ],
    });
  });

  browser.runtime.onConnect.addListener((port) => {
    if (port.name !== EXTENSION_PORTS.DECK_CONNECTION) return;

    const optionsUrl = getOptionsUrl();
    const senderUrl = port.sender?.url ?? "";
    const senderTabId = port.sender?.tab?.id;

    if (!optionsUrl) return;
    if (!isSameExtensionPage(senderUrl, optionsUrl)) return;
    if (senderTabId == null) return;

    port.onDisconnect.addListener(() => {
      console.log("Dashboard port disconnected");
    });
  });

  browser.tabs.onRemoved.addListener((tabId) => {
    void (async () => {
      await browser.storage.local.remove(EXTENSION_VARIABLES.STORAGE_KEY);
    })();
  });
});
