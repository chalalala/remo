import fs from 'fs';
import path from 'path';
import { expect, seedSpaces, test } from './fixtures';

const DRIVE_SCOPE = 'https://www.googleapis.com/auth/drive';

test.describe('Google Drive permission', () => {
  test('the extension asks for Drive access that can read existing backups', () => {
    const manifest = JSON.parse(
      fs.readFileSync(path.join(__dirname, '..', 'public', 'manifest.json'), 'utf8'),
    );

    expect(manifest.oauth2.scopes).toEqual([DRIVE_SCOPE]);
  });

  test('the web app asks for Drive access that can read existing backups', async ({
    page,
    openWeb,
  }) => {
    await openWeb({ signedIn: false });

    await expect(page.getByRole('button', { name: 'Sign in with Google' })).toBeVisible();
    await expect
      .poll(() => page.evaluate(() => (window as unknown as { __gsiScope?: string }).__gsiScope))
      .toBe(DRIVE_SCOPE);
  });
});

test('loads the original backup when a duplicate backup file exists', async ({
  page,
  drive,
  openExtension,
}) => {
  drive.setSpaces(seedSpaces());
  drive.addDuplicateBackup([{ id: 'space_empty', name: 'Empty duplicate', sections: [] }]);

  await openExtension();

  await expect(page.getByPlaceholder('Select a space')).toHaveValue('Work');
  await expect(page.getByRole('link', { name: 'Design spec' })).toBeVisible();
});
