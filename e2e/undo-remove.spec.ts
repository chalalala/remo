import { expect, seedSpaces, test } from './fixtures';

test.describe('Undo after removing', () => {
  test.beforeEach(async ({ drive, openExtension }) => {
    drive.setSpaces(seedSpaces());
    await openExtension();
  });

  test('restores a removed item to the same position', async ({ page, drive }) => {
    const roadmap = page.getByRole('link', { name: 'Roadmap' });

    await roadmap.hover();
    await page.getByRole('button', { name: 'Remove', exact: true }).nth(1).click();

    await expect(roadmap).toBeHidden();
    await expect
      .poll(() => drive.spaces[0].sections[0].items.map(({ id }) => id))
      .toEqual(['spec']);

    await page.getByRole('button', { name: 'Undo' }).click();

    await expect(roadmap).toBeVisible();
    await expect
      .poll(() => drive.spaces[0].sections[0].items.map(({ id }) => id))
      .toEqual(['spec', 'roadmap']);
  });

  test('restores a removed section', async ({ page, drive }) => {
    await page.getByTitle('Remove section').first().click();

    await expect(page.getByText('Removed section "Docs"', { exact: true })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Design spec' })).toBeHidden();
    await expect
      .poll(() => drive.spaces[0].sections.map(({ id }) => id))
      .toEqual(['section_tools']);

    await page.getByRole('button', { name: 'Undo' }).click();

    await expect(page.getByRole('link', { name: 'Design spec' })).toBeVisible();
    await expect
      .poll(() => drive.spaces[0].sections.map(({ id }) => id))
      .toEqual(['section_docs', 'section_tools']);
  });

  test('restores a removed space and selects it again', async ({ page, drive }) => {
    await page.getByRole('button', { name: 'More options' }).click();
    await page.getByRole('menuitem', { name: 'Remove space' }).click();

    await expect(page.getByText('Removed space "Work"', { exact: true })).toBeVisible();
    await expect.poll(() => drive.spaces.map(({ id }) => id)).toEqual(['space_home']);

    await page.getByRole('button', { name: 'Undo' }).click();

    await expect.poll(() => drive.spaces.map(({ id }) => id)).toEqual(['space_work', 'space_home']);
    await expect(page.getByPlaceholder('Select a space')).toHaveValue('Work');
    await expect(page.getByRole('link', { name: 'Design spec' })).toBeVisible();
  });
});
