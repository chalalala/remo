import { expect, getChromeState, seedSpaces, test } from './fixtures';

test.describe('Search across spaces', () => {
  test.beforeEach(async ({ drive }) => {
    drive.setSpaces(seedSpaces());
  });

  test('finds a link in another space and opens it', async ({ page, openExtension }) => {
    await openExtension();
    await expect(page.getByPlaceholder('Select a space')).toHaveValue('Work');

    await page.getByRole('button', { name: 'Search links' }).click();
    await page.getByPlaceholder('Search links in all spaces').fill('pho');

    const result = page.getByRole('option', { name: /Pho recipe/ });

    await expect(result).toContainText('Home / Recipes');
    await expect(page.getByRole('option')).toHaveCount(1);

    await page.keyboard.press('Enter');

    await expect(page.getByRole('dialog')).toBeHidden();
    expect((await getChromeState(page)).openedTabs).toEqual(['https://food.example.com/pho']);
  });

  test('matches URLs and says when nothing is found', async ({ page, openExtension }) => {
    await openExtension();

    await page.keyboard.press('Control+k');

    const input = page.getByPlaceholder('Search links in all spaces');

    await input.fill('example.com');
    await expect(page.getByRole('option')).toHaveCount(4);

    await input.fill('nothing like this');
    await expect(page.getByText('No links found.')).toBeVisible();
  });

  test('opens with the slash key on the web app', async ({ page, openWeb }) => {
    await openWeb();
    await expect(page.getByRole('link', { name: 'Design spec' })).toBeVisible();

    // "/" only opens search when the focus is not in a text field
    await page.locator('main').click({ position: { x: 5, y: 5 } });
    await page.keyboard.press('/');
    await page.getByPlaceholder('Search links in all spaces').fill('roadmap');

    const popupPromise = page.waitForEvent('popup');

    await page.getByRole('option', { name: /Roadmap/ }).click();

    const popup = await popupPromise;

    expect(popup.url()).toBe('https://roadmap.example.com/');
  });
});
