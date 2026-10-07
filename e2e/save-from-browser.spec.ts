import path from 'path';
import { BrowserContext, chromium, Worker } from '@playwright/test';
import { expect, getChromeState, seedSpaces, test } from './fixtures';

test.describe('Saving from the right-click menu or keyboard shortcut', () => {
  test('the popup saves the queued page into the chosen section', async ({
    page,
    drive,
    openExtension,
  }) => {
    drive.setSpaces(seedSpaces());
    await openExtension({
      pendingItem: {
        url: 'https://blog.example.com/post',
        title: 'Interesting post',
        icon: 'https://blog.example.com/icon.png',
      },
    });

    const banner = page.getByRole('region', { name: 'Save to Remo' });

    await expect(banner).toContainText('Interesting post');
    await banner.getByLabel('Section').selectOption({ label: 'Tools' });
    await banner.getByRole('button', { name: 'Save' }).click();

    await expect(banner).toBeHidden();
    await expect(page.getByRole('link', { name: 'Interesting post' })).toBeVisible();
    await expect
      .poll(() => drive.spaces[0].sections[1].items[0])
      .toMatchObject({
        name: 'Interesting post',
        url: 'https://blog.example.com/post',
        icon: 'https://blog.example.com/icon.png',
      });
    expect((await getChromeState(page)).badgeText).toBe('');
  });

  test('dismissing clears the queued page', async ({ page, drive, openExtension }) => {
    drive.setSpaces(seedSpaces());
    await openExtension({
      pendingItem: { url: 'https://blog.example.com/post', title: 'Interesting post', icon: '' },
    });

    await page.getByRole('button', { name: 'Dismiss' }).click();

    await expect(page.getByRole('region', { name: 'Save to Remo' })).toBeHidden();
    expect((await getChromeState(page)).badgeText).toBe('');
    expect(drive.spaces).toEqual(seedSpaces());
  });
});

test.describe('Extension service worker', () => {
  let context: BrowserContext;
  let worker: Worker;

  test.beforeAll(async () => {
    // Load the real extension. The popup isn't built here, the service worker is all this needs.
    const extensionPath = path.join(__dirname, '..', 'public');

    context = await chromium.launchPersistentContext('', {
      channel: 'chromium',
      args: [`--disable-extensions-except=${extensionPath}`, `--load-extension=${extensionPath}`],
    });
    worker = context.serviceWorkers()[0] || (await context.waitForEvent('serviceworker'));
  });

  test.afterAll(async () => {
    await context.close();
  });

  // Calls a handler the service worker exposes for tests
  const callBackground = (handler: 'handleMenuClick' | 'handleCommand', ...args: unknown[]) =>
    worker.evaluate(
      ([name, handlerArgs]) => {
        type Handler = (...handlerArgs: unknown[]) => Promise<void>;
        const background = (self as unknown as { remoBackground: Record<string, Handler> })
          .remoBackground;

        return background[name as string](...(handlerArgs as unknown[]));
      },
      [handler, args] as const,
    );

  const readQueue = () =>
    worker.evaluate(async () => ({
      item: (await chrome.storage.local.get('remoPendingItem')).remoPendingItem,
      badge: await chrome.action.getBadgeText({}),
    }));

  test.beforeEach(async () => {
    await worker.evaluate(async () => {
      await chrome.storage.local.clear();
      await chrome.action.setBadgeText({ text: '' });
    });
  });

  test('declares the menu permissions and keyboard shortcuts', async () => {
    const manifest = await worker.evaluate(() => chrome.runtime.getManifest());

    expect(manifest.permissions).toEqual(expect.arrayContaining(['contextMenus', 'storage']));
    expect(manifest.commands).toMatchObject({
      _execute_action: { suggested_key: { default: 'Alt+Shift+R' } },
      'save-page': { suggested_key: { default: 'Alt+Shift+S' } },
    });
  });

  test('"Save link to Remo" queues the link and marks the icon', async () => {
    await callBackground(
      'handleMenuClick',
      {
        menuItemId: 'remo-save-link',
        linkUrl: 'https://docs.example.com/guide',
        selectionText: 'The guide',
      },
      { url: 'https://other.example.com/', title: 'Other page' },
    );

    expect(await readQueue()).toEqual({
      item: { url: 'https://docs.example.com/guide', title: 'The guide', icon: '' },
      badge: '1',
    });
  });

  test('"Save page to Remo" queues the page', async () => {
    await callBackground(
      'handleMenuClick',
      { menuItemId: 'remo-save-page', pageUrl: 'https://news.example.com/story' },
      {
        url: 'https://news.example.com/story',
        title: 'Story',
        favIconUrl: 'https://news.example.com/i.png',
      },
    );

    expect((await readQueue()).item).toEqual({
      url: 'https://news.example.com/story',
      title: 'Story',
      icon: 'https://news.example.com/i.png',
    });
  });

  test('the save shortcut queues the active tab', async () => {
    await callBackground('handleCommand', 'save-page', {
      url: 'https://shop.example.com/',
      title: 'Shop',
      favIconUrl: '',
    });

    expect(await readQueue()).toEqual({
      item: { url: 'https://shop.example.com/', title: 'Shop', icon: '' },
      badge: '1',
    });
  });
});
