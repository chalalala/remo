import fs from 'fs';
import path from 'path';
import { expect, test } from './fixtures';

const DRIVE_FILE_SCOPE = 'https://www.googleapis.com/auth/drive.file';

test.describe('Google Drive permission', () => {
  test('the extension only asks for files Remo creates', () => {
    const manifest = JSON.parse(
      fs.readFileSync(path.join(__dirname, '..', 'public', 'manifest.json'), 'utf8'),
    );

    expect(manifest.oauth2.scopes).toEqual([DRIVE_FILE_SCOPE]);
  });

  test('the web app only asks for files Remo creates', async ({ page, openWeb }) => {
    await openWeb({ signedIn: false });

    await expect(page.getByRole('button', { name: 'Sign in with Google' })).toBeVisible();
    await expect
      .poll(() => page.evaluate(() => (window as unknown as { __gsiScope?: string }).__gsiScope))
      .toBe(DRIVE_FILE_SCOPE);
  });
});
