// Service worker for the REMO extension: right-click menu and keyboard shortcut.
// Both queue the page or link in chrome.storage and open the popup, where the user picks a section.

// Keep in sync with PENDING_ITEM_KEY in lib/chromeApi.ts
const PENDING_ITEM_KEY = 'remoPendingItem';

const menuId = {
  SAVE_PAGE: 'remo-save-page',
  SAVE_LINK: 'remo-save-link',
};

const commandId = {
  SAVE_PAGE: 'save-page',
};

const createMenus = () => {
  chrome.contextMenus.removeAll(() => {
    chrome.contextMenus.create({
      id: menuId.SAVE_PAGE,
      title: 'Save page to Remo',
      contexts: ['page'],
    });

    chrome.contextMenus.create({
      id: menuId.SAVE_LINK,
      title: 'Save link to Remo',
      contexts: ['link'],
    });
  });
};

const queueItem = async (item) => {
  if (!item.url) {
    return;
  }

  await chrome.storage.local.set({ [PENDING_ITEM_KEY]: item });
  await chrome.action.setBadgeText({ text: '1' });

  try {
    await chrome.action.openPopup();
  } catch (error) {
    // The popup can't open without a focused window, the badge tells the user to open it
  }
};

const handleMenuClick = async (info, tab) => {
  if (info.menuItemId === menuId.SAVE_LINK) {
    return queueItem({
      url: info.linkUrl || '',
      title: info.selectionText || info.linkUrl || '',
      icon: '',
    });
  }

  if (info.menuItemId === menuId.SAVE_PAGE) {
    return queueItem({
      url: info.pageUrl || tab?.url || '',
      title: tab?.title || '',
      icon: tab?.favIconUrl || '',
    });
  }
};

const handleCommand = async (command, tab) => {
  if (command !== commandId.SAVE_PAGE) {
    return;
  }

  const activeTab = tab || (await chrome.tabs.query({ active: true, currentWindow: true }))[0];

  return queueItem({
    url: activeTab?.url || '',
    title: activeTab?.title || '',
    icon: activeTab?.favIconUrl || '',
  });
};

chrome.runtime.onInstalled.addListener(createMenus);
chrome.contextMenus.onClicked.addListener(handleMenuClick);
chrome.commands.onCommand.addListener(handleCommand);

// Exposed for the end-to-end tests, which can't click the browser's own menus
self.remoBackground = { handleMenuClick, handleCommand, PENDING_ITEM_KEY };
