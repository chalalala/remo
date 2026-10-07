import { test as base, expect, Page, Route } from '@playwright/test';
import { Space } from '@/types/Resource';

const FILE_NAME = 'remo_backup.json';
const FOLDER_MIME_TYPE = 'application/vnd.google-apps.folder';

interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  modifiedTime: string;
  content?: unknown;
}

/**
 * In-memory stand-in for the parts of the Google Drive API Remo uses.
 */
export class FakeDrive {
  files: DriveFile[] = [];
  writeCount = 0;
  private clock = 0;

  private nextTime() {
    this.clock += 1;

    return new Date(Date.UTC(2026, 0, 1, 0, 0, this.clock)).toISOString();
  }

  get backup() {
    return this.files.find((file) => file.name === FILE_NAME);
  }

  /** The spaces currently saved in Drive. */
  get spaces() {
    return (this.backup?.content || []) as Space[];
  }

  /** Writes the backup file as if another device had saved it. */
  setSpaces(spaces: Space[]) {
    const file = this.backup;

    if (file) {
      file.content = spaces;
      file.modifiedTime = this.nextTime();

      return;
    }

    this.files.push({
      id: `file_${this.files.length + 1}`,
      name: FILE_NAME,
      mimeType: 'application/json',
      modifiedTime: this.nextTime(),
      content: spaces,
    });
  }

  /** Adds a second backup file, like the one an app with narrower access would create. */
  addDuplicateBackup(spaces: Space[]) {
    this.files.push({
      id: `file_${this.files.length + 1}`,
      name: FILE_NAME,
      mimeType: 'application/json',
      modifiedTime: this.nextTime(),
      content: spaces,
    });
  }

  private parseMultipart(route: Route) {
    const request = route.request();
    const boundary = /boundary=(.+)$/.exec(request.headers()['content-type'] || '')?.[1] || '';
    const body = request.postDataBuffer()?.toString('utf8') || '';
    const parts = body
      .split(`--${boundary}`)
      .map((part) => part.split('\r\n\r\n').slice(1).join('\r\n\r\n').trim())
      .filter(Boolean);

    return {
      metadata: JSON.parse(parts[0] || '{}'),
      content: parts[1] ? JSON.parse(parts[1]) : undefined,
    };
  }

  async handle(route: Route) {
    const request = route.request();
    const url = new URL(request.url());
    const method = request.method();
    const fileIdMatch = /\/files\/([^/?]+)$/.exec(url.pathname);
    const fileId = fileIdMatch?.[1];

    // List files by name and type
    if (method === 'GET' && !fileId) {
      const q = url.searchParams.get('q') || '';
      const name = /name = '([^']+)'/.exec(q)?.[1];
      const mimeType = /mimeType = '([^']+)'/.exec(q)?.[1];
      const matches = this.files.filter((file) => file.name === name && file.mimeType === mimeType);
      // Without orderBy, list the newest first so code relying on the default order is caught
      const ordered =
        url.searchParams.get('orderBy') === 'createdTime' ? matches : [...matches].reverse();
      const files = ordered.map(({ id, name, modifiedTime }) => ({ id, name, modifiedTime }));

      return route.fulfill({ json: { files } });
    }

    // Download file content
    if (method === 'GET' && fileId) {
      const file = this.files.find(({ id }) => id === fileId);

      return file
        ? route.fulfill({ json: file.content ?? null })
        : route.fulfill({ status: 404, json: { error: { code: 404 } } });
    }

    // Create file or folder
    if (method === 'POST') {
      const { metadata, content } = this.parseMultipart(route);
      const file: DriveFile = {
        id: `file_${this.files.length + 1}`,
        name: metadata.name,
        mimeType: metadata.mimeType,
        modifiedTime: this.nextTime(),
        content,
      };

      this.files.push(file);

      if (file.mimeType !== FOLDER_MIME_TYPE) {
        this.writeCount += 1;
      }

      return route.fulfill({ json: { id: file.id, modifiedTime: file.modifiedTime } });
    }

    // Update file content
    if (method === 'PATCH' && fileId) {
      const file = this.files.find(({ id }) => id === fileId);

      if (!file) {
        return route.fulfill({ status: 404, json: { error: { code: 404 } } });
      }

      file.content = this.parseMultipart(route).content;
      file.modifiedTime = this.nextTime();
      this.writeCount += 1;

      return route.fulfill({ json: { id: file.id, modifiedTime: file.modifiedTime } });
    }

    return route.fulfill({ status: 400, json: { error: { code: 400 } } });
  }
}

export interface FakeTab {
  url: string;
  title: string;
  favIconUrl?: string;
}

export interface ExtensionOptions {
  tabs?: FakeTab[];
  pendingItem?: { url: string; title: string; icon: string };
}

/**
 * Makes the web build behave like the extension popup by providing the chrome.* APIs it calls.
 * Opened tabs, storage and the badge are recorded on `window.__remo` for assertions.
 */
const installFakeChrome = ({
  tabs,
  pendingItem,
}: {
  tabs: FakeTab[];
  pendingItem: ExtensionOptions['pendingItem'] | null;
}) => {
  const storage: Record<string, unknown> = pendingItem ? { remoPendingItem: pendingItem } : {};
  const state = { openedTabs: [] as string[], badgeText: pendingItem ? '1' : '', storage };

  Object.assign(window, { __remo: state });

  Object.defineProperty(window, 'chrome', {
    configurable: true,
    value: {
      runtime: { id: 'remo-e2e' },
      identity: {
        getAuthToken: (_options: unknown, callback: (token: string) => void) =>
          callback('e2e-token'),
        removeCachedAuthToken: (_options: unknown, callback?: () => void) => callback?.(),
      },
      tabs: {
        query: async (query: { active?: boolean }) => (query.active ? tabs.slice(0, 1) : tabs),
        create: async ({ url }: { url: string }) => {
          state.openedTabs.push(url);

          return { url };
        },
      },
      storage: {
        local: {
          get: async (key: string) => (key in storage ? { [key]: storage[key] } : {}),
          set: async (items: Record<string, unknown>) => Object.assign(storage, items),
          remove: async (key: string) => {
            delete storage[key];
          },
        },
      },
      action: {
        setBadgeText: async ({ text }: { text: string }) => {
          state.badgeText = text;
        },
      },
    },
  });
};

/**
 * Stands in for Google Identity Services on the web build and records the requested scope.
 */
const FAKE_GSI_SCRIPT = `
  window.google = {
    accounts: {
      oauth2: {
        initTokenClient: (config) => {
          window.__gsiScope = config.scope;
          return { requestAccessToken: () => {} };
        },
        revoke: (token, callback) => callback && callback(),
      },
    },
  };
`;

interface Fixtures {
  drive: FakeDrive;
  /** Opens Remo as the extension popup, signed in. */
  openExtension: (options?: ExtensionOptions) => Promise<void>;
  /** Opens Remo as the web app, signed in unless `signedIn` is false. */
  openWeb: (options?: { signedIn?: boolean }) => Promise<void>;
}

export const test = base.extend<Fixtures>({
  drive: async ({ page }, use) => {
    const drive = new FakeDrive();

    // Keep tests offline: no favicon lookups or other third-party requests
    await page.context().route(
      (url) => url.hostname !== 'localhost',
      (route) => route.fulfill({ status: 404, body: '' }),
    );
    await page
      .context()
      .route('https://accounts.google.com/gsi/client', (route) =>
        route.fulfill({ contentType: 'text/javascript', body: FAKE_GSI_SCRIPT }),
      );
    await page.context().route('https://www.googleapis.com/**', (route) => drive.handle(route));

    await use(drive);
  },

  // Depends on drive so Drive is mocked before the page loads
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  openExtension: async ({ page, drive }, use) => {
    await use(async ({ tabs = [], pendingItem } = {}) => {
      await page.addInitScript(installFakeChrome, { tabs, pendingItem: pendingItem ?? null });
      await page.goto('/');
      await expect(page.getByLabel('Search links')).toBeVisible();
    });
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  openWeb: async ({ page, drive }, use) => {
    await use(async ({ signedIn = true } = {}) => {
      if (signedIn) {
        await page
          .context()
          .addCookies([{ name: 'gapi_token', value: 'e2e-token', url: 'http://localhost:3100' }]);
      }

      await page.goto('/');
    });
  },
});

export { expect };

/** Reads what the fake chrome APIs recorded in the page. */
export const getChromeState = (page: Page) =>
  page.evaluate(
    () => (window as unknown as { __remo: { openedTabs: string[]; badgeText: string } }).__remo,
  );

export const item = (id: string, name: string, url = `https://${id}.example.com/`) => ({
  id,
  name,
  url,
  icon: '',
});

/** Two spaces with a couple of sections, enough for every scenario. */
export const seedSpaces = (): Space[] => [
  {
    id: 'space_work',
    name: 'Work',
    sections: [
      {
        id: 'section_docs',
        name: 'Docs',
        items: [item('spec', 'Design spec'), item('roadmap', 'Roadmap')],
      },
      {
        id: 'section_tools',
        name: 'Tools',
        items: [item('ci', 'CI dashboard')],
      },
    ],
  },
  {
    id: 'space_home',
    name: 'Home',
    sections: [
      {
        id: 'section_recipes',
        name: 'Recipes',
        items: [item('pho', 'Pho recipe', 'https://food.example.com/pho')],
      },
    ],
  },
];
