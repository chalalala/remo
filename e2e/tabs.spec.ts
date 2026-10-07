import { expect, getChromeState, seedSpaces, test } from './fixtures';

test.describe('Save open tabs and open a whole section', () => {
  test.beforeEach(async ({ drive }) => {
    drive.setSpaces(seedSpaces());
  });

  test('saves the web pages open in the window into a section', async ({
    page,
    drive,
    openExtension,
  }) => {
    await openExtension({
      tabs: [
        {
          url: 'https://news.example.com/',
          title: 'News',
          favIconUrl: 'https://news.example.com/i.png',
        },
        { url: 'chrome://newtab/', title: 'New Tab' },
        { url: 'https://ci.example.com/', title: 'CI dashboard (already saved)' },
        { url: 'https://mail.example.com/', title: 'Mail' },
      ],
    });

    await page.getByRole('button', { name: 'Save open tabs' }).nth(1).click();

    await expect(page.getByText('Saved 2 tabs to "Tools"', { exact: true })).toBeVisible();
    await expect(page.getByRole('link', { name: 'News' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Mail' })).toBeVisible();
    await expect
      .poll(() => drive.spaces[0].sections[1].items.map(({ url }) => url))
      .toEqual([
        'https://news.example.com/',
        'https://mail.example.com/',
        'https://ci.example.com/',
      ]);
    expect(drive.spaces[0].sections[1].items[0].icon).toBe('https://news.example.com/i.png');

    // Saving again adds nothing
    await page.getByRole('button', { name: 'Save open tabs' }).nth(1).click();
    await expect(
      page.getByText('All open tabs are already in "Tools"', { exact: true }),
    ).toBeVisible();
  });

  test('opens every link in a section', async ({ page, openExtension }) => {
    await openExtension();

    await page.getByRole('button', { name: 'Open all links' }).first().click();

    await expect
      .poll(async () => (await getChromeState(page)).openedTabs)
      .toEqual(['https://spec.example.com/', 'https://roadmap.example.com/']);
    // The section stays open
    await expect(page.getByRole('link', { name: 'Design spec' })).toBeVisible();
  });

  test('only offers saving tabs inside the extension', async ({ page, openWeb }) => {
    await openWeb();

    await expect(page.getByRole('button', { name: 'Open all links' }).first()).toBeVisible();
    await expect(page.getByRole('button', { name: 'Save open tabs' })).toHaveCount(0);
  });
});
