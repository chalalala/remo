import { expect, seedSpaces, test } from './fixtures';

test.describe('Protection against overwriting another device', () => {
  test('keeps the other device’s data and offers a reload', async ({
    page,
    drive,
    openExtension,
  }) => {
    drive.setSpaces(seedSpaces());
    await openExtension();
    await expect(page.getByRole('link', { name: 'Design spec' })).toBeVisible();

    // Another device saves while this popup is open
    const otherDevice = seedSpaces();

    otherDevice[0].sections[0].name = 'Docs (edited elsewhere)';
    drive.setSpaces(otherDevice);

    const writesBefore = drive.writeCount;

    await page.getByTitle('Remove section').nth(1).click();

    await expect(
      page.getByText('Remo was updated on another device', { exact: true }),
    ).toBeVisible();
    // Nothing was written and the local change was rolled back
    expect(drive.writeCount).toBe(writesBefore);
    expect(drive.spaces).toEqual(otherDevice);
    await expect(page.getByRole('link', { name: 'CI dashboard' })).toBeVisible();

    await page.getByRole('button', { name: 'Reload', exact: true }).last().click();

    await expect(page.getByText('Docs (edited elsewhere)')).toBeVisible();

    // After reloading, saving works again
    await page.getByTitle('Remove section').nth(1).click();
    await expect.poll(() => drive.spaces[0].sections.map(({ id }) => id)).toEqual(['section_docs']);
  });

  test('saves normally when nothing changed elsewhere', async ({ page, drive, openExtension }) => {
    drive.setSpaces(seedSpaces());
    await openExtension();

    await page.getByTitle('Remove section').nth(1).click();
    await page.getByTitle('Remove section').first().click();

    await expect.poll(() => drive.spaces[0].sections).toEqual([]);
    await expect(page.getByText('Remo was updated on another device')).toHaveCount(0);
  });
});
