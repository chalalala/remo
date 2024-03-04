import {
  createFolder,
  findFiles,
  findFolders,
  getFileContent,
  updateFile,
  writeFile,
} from '@/lib/googleDrive';
import { Section } from '@/types/Resource';

const config = {
  FOLDER_NAME: 'REMO - Resource Manager App',
  FILE_NAME: 'remo_backup.json',
  FILE_TYPE: 'application/json',
};

export const readBackupData = async () => {
  const res = await findFiles(config.FILE_NAME, config.FILE_TYPE);

  if (res.files?.length) {
    const file = res.files[0];

    const fileContent = await getFileContent(file.id);

    if (!fileContent) {
      return [];
    }

    return fileContent;
  }

  return [];
};

export const backupData = async (data: Section[]) => {
  const fileRes = await findFiles(config.FILE_NAME, config.FILE_TYPE);

  // If file exists, update file content by fileId
  if (fileRes.files?.length) {
    const file = fileRes.files[0];

    await updateFile(file.id, data);
  }
  // If no file exists, create new file
  else {
    const folderRes = await findFolders(config.FOLDER_NAME);
    let folderId;

    // If no parent folder exsits, create new folder
    if (!folderRes.files?.length) {
      const createFolderRes = await createFolder(config.FOLDER_NAME);

      folderId = createFolderRes.id;
    }
    // If parent folder exists, get parent folder ID
    else {
      folderId = folderRes.files[0].id;
    }

    // Add file to parent folder
    await writeFile(config.FILE_NAME, data, {
      parents: [folderId],
    });
  }

  return data;
};
