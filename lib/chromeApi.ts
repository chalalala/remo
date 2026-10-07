export interface ActiveTabData {
  url: string;
  icon: string;
  title: string;
}

export const isExtension = () => {
  return typeof chrome !== 'undefined' && !!chrome.runtime && !!chrome.runtime.id;
};

export const getDataFromActiveTab = async (): Promise<ActiveTabData> => {
  if (!isExtension()) {
    return { url: '', icon: '', title: '' };
  }

  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  const url = tab?.url || '';
  const icon = tab?.favIconUrl || '';
  const title = tab?.title || '';

  return { url, icon, title };
};

/**
 * Returns the web pages open in the current window, in tab order.
 * Browser pages such as chrome://newtab are left out because they can't be reopened from a link.
 */
export const getOpenTabs = async (): Promise<ActiveTabData[]> => {
  if (!isExtension()) {
    return [];
  }

  const tabs = await chrome.tabs.query({ currentWindow: true });

  return tabs
    .filter((tab) => /^https?:\/\//.test(tab.url || ''))
    .map((tab) => ({ url: tab.url || '', icon: tab.favIconUrl || '', title: tab.title || '' }));
};

/**
 * Opens links in new tabs. Only the first one is focused.
 */
export const openUrls = async (urls: string[]) => {
  if (!isExtension()) {
    urls.forEach((url) => window.open(url, '_blank', 'noopener,noreferrer'));

    return;
  }

  await Promise.all(urls.map((url, index) => chrome.tabs.create({ url, active: index === 0 })));
};

// Keep in sync with public/background.js
export const PENDING_ITEM_KEY = 'remoPendingItem';

/**
 * Returns the page or link queued from the right-click menu or keyboard shortcut, if any.
 */
export const getPendingItem = async (): Promise<ActiveTabData | undefined> => {
  if (!isExtension() || !chrome.storage) {
    return undefined;
  }

  const result = await chrome.storage.local.get(PENDING_ITEM_KEY);

  return result[PENDING_ITEM_KEY];
};

export const clearPendingItem = async () => {
  if (!isExtension() || !chrome.storage) {
    return;
  }

  await chrome.storage.local.remove(PENDING_ITEM_KEY);
  await chrome.action.setBadgeText({ text: '' });
};
