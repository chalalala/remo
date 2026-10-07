import {
  createFolder,
  findFiles,
  findFolders,
  getFileContent,
  updateFile,
  writeFile,
} from '@/lib/googleDrive';
import { Space } from '@/types/Resource';

const config = {
  FOLDER_NAME: 'REMO - Resource Manager App',
  FILE_NAME: 'remo_backup.json',
  FILE_TYPE: 'application/json',
};

export class RemoteConflictError extends Error {
  constructor() {
    super('The backup file was changed on another device');
    this.name = 'RemoteConflictError';
  }
}

interface RemoteState {
  // Drive's modifiedTime of the backup file this device last read or wrote.
  // `null` means the file didn't exist, `undefined` means nothing has been read yet.
  modifiedTime: string | null | undefined;
  // Contents of writes that were sent but never confirmed (e.g. aborted by a newer backup).
  // Drive may still have applied them, so finding one of them remotely is not a conflict.
  unconfirmedWrites: Set<string>;
}

const remoteState: RemoteState = {
  modifiedTime: undefined,
  unconfirmedWrites: new Set(),
};

export const resetRemoteState = () => {
  remoteState.modifiedTime = undefined;
  remoteState.unconfirmedWrites.clear();
};

const confirmWrite = (modifiedTime: string | undefined) => {
  remoteState.modifiedTime = modifiedTime ?? null;
  remoteState.unconfirmedWrites.clear();
};

export const readBackupData = async () => {
  const res = await findFiles(config.FILE_NAME, config.FILE_TYPE);

  if (res.files?.length) {
    const file = res.files[0];

    const fileContent = await getFileContent(file.id);

    confirmWrite(file.modifiedTime);

    if (!fileContent) {
      return [];
    }

    return fileContent as Space[];
  }

  confirmWrite(undefined);

  return [];
};

/**
 * Throws `RemoteConflictError` when the backup file changed since this device last read or wrote it,
 * so a save never silently replaces edits made on another device.
 */
const assertNoConflict = async (file: { id: string; modifiedTime?: string } | undefined) => {
  const { modifiedTime } = remoteState;

  // Nothing has been read yet, so there is nothing to compare with
  if (modifiedTime === undefined) {
    return;
  }

  const remoteModifiedTime = file?.modifiedTime ?? null;

  if (remoteModifiedTime === modifiedTime) {
    return;
  }

  // The file was deleted remotely, writing it again loses nothing
  if (!file) {
    return;
  }

  if (remoteState.unconfirmedWrites.size) {
    const remoteContent = await getFileContent(file.id);

    if (remoteState.unconfirmedWrites.has(JSON.stringify(remoteContent))) {
      return;
    }
  }

  throw new RemoteConflictError();
};

export const backupData = async (data: Space[], signal?: AbortSignal) => {
  const fileRes = await findFiles(config.FILE_NAME, config.FILE_TYPE, { signal });
  const existingFile = fileRes?.files?.[0];

  await assertNoConflict(existingFile);

  const content = JSON.stringify(data);

  remoteState.unconfirmedWrites.add(content);

  // If file exists, update file content by fileId
  if (existingFile) {
    const res = await updateFile(existingFile.id, data, { signal });

    confirmWrite(res?.modifiedTime);
  }
  // If no file exists, create new file
  else {
    const folderRes = await findFolders(config.FOLDER_NAME, { signal });
    let folderId;

    // If no parent folder exsits, create new folder
    if (!folderRes?.files?.length) {
      const createFolderRes = await createFolder(config.FOLDER_NAME, { signal });

      folderId = createFolderRes?.id;
    }
    // If parent folder exists, get parent folder ID
    else {
      folderId = folderRes.files[0].id;
    }

    // Add file to parent folder
    const res = await writeFile(config.FILE_NAME, data, {
      parents: [folderId],
      signal,
    });

    confirmWrite(res?.modifiedTime);
  }

  return data;
};
