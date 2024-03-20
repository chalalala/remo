import { cookieKey } from '@/constants/cookies';
import { getCookie } from '@/utils/cookies';
import { isExtension } from '@/utils/env';

export const getAccessToken = () => {
  return new Promise<string>((resolve, reject) => {
    if (isExtension()) {
      chrome.identity.getAuthToken({ interactive: true }, (token) => {
        if (token) {
          resolve(token);
        } else {
          reject('Failed to get token!');
        }
      });

      return;
    }

    const token = getCookie(cookieKey.GAPI_TOKEN);

    if (token) {
      resolve(token);
    } else {
      reject('Failed to get token!');
    }
  });
};

export const createFolder = async (folderName: string) => {
  const accessToken = await getAccessToken();
  const metadata = {
    name: folderName,
    mimeType: 'application/vnd.google-apps.folder',
  };

  const form = new FormData();

  form.append(
    'metadata',
    new Blob([JSON.stringify(metadata)], {
      type: 'application/json',
    }),
  );

  const res = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + accessToken,
    },
    body: form,
  });

  const json = await res.json();

  if (!res.ok) {
    throw json.error;
  }

  return json;
};

export const findFiles = async (fileName: string, fileType: string) => {
  const accessToken = await getAccessToken();
  const queryParams = new URLSearchParams({
    q: `name = '${fileName}' and mimeType = '${fileType}' and trashed = false`,
    spaces: 'drive',
  });

  const res = await fetch(`https://www.googleapis.com/drive/v3/files?${queryParams.toString()}`, {
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + accessToken,
    },
  });

  const json = await res.json();

  if (!res.ok) {
    throw json.error;
  }

  return json;
};

export const findFolders = async (folderName: string) => {
  const accessToken = await getAccessToken();
  const queryParams = new URLSearchParams({
    q: `name = '${folderName}' and mimeType = 'application/vnd.google-apps.folder' and trashed = false`,
  });

  const res = await fetch(`https://www.googleapis.com/drive/v3/files?${queryParams.toString()}`, {
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + accessToken,
    },
  });

  const json = await res.json();

  if (!res.ok) {
    throw json.error;
  }

  return json;
};

export const getFileContent = async (fileId: string) => {
  const accessToken = await getAccessToken();

  const res = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`, {
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + accessToken,
    },
  });

  const json = await res.json();

  if (!res.ok) {
    throw json.error;
  }

  return json;
};

export const writeFile = async (
  fileName: string,
  content: unknown,
  options?: {
    contentType?: string;
    parents?: string[];
    signal?: AbortSignal;
  },
) => {
  const accessToken = await getAccessToken();
  const fileType = options?.contentType || 'application/json';

  const file = new Blob([JSON.stringify(content)], {
    type: fileType,
  });

  const metadata = {
    name: fileName,
    mimeType: fileType,
  };

  // Folder ID at Google Drive
  if (options?.parents) {
    Object.assign(metadata, {
      parents: options.parents,
    });
  }

  const form = new FormData();

  form.append(
    'metadata',
    new Blob([JSON.stringify(metadata)], {
      type: 'application/json',
    }),
  );

  form.append('file', file);

  const res = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + accessToken,
    },
    body: form,
    signal: options?.signal,
  });

  const json = await res.json();

  if (!res.ok) {
    throw json.error;
  }

  return json;
};

export const updateFile = async (
  fileId: string,
  content: unknown,
  options?: {
    contentType?: string;
    signal?: AbortSignal;
  },
) => {
  const accessToken = await getAccessToken();
  const fileType = options?.contentType || 'application/json';

  const metadata = {
    mimeType: fileType,
  };

  const file = new Blob([JSON.stringify(content)], {
    type: fileType,
  });

  const form = new FormData();

  form.append(
    'metadata',
    new Blob([JSON.stringify(metadata)], {
      type: 'application/json',
    }),
  );

  form.append('file', file);

  const res = await fetch(
    `https://www.googleapis.com/upload/drive/v3/files/${fileId}?uploadType=multipart`,
    {
      method: 'PATCH',
      headers: {
        Authorization: 'Bearer ' + accessToken,
      },
      body: form,
      signal: options?.signal,
    },
  );

  const json = await res.json();

  if (!res.ok) {
    throw json.error;
  }

  return json;
};
