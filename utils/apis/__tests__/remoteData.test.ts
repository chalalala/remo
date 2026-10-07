import {
  createFolder,
  findFiles,
  findFolders,
  getFileContent,
  updateFile,
  writeFile,
} from '@/lib/googleDrive';
import { Space } from '@/types/Resource';
import { RemoteConflictError, backupData, readBackupData, resetRemoteState } from '../remoteData';

jest.mock('../../../lib/googleDrive', () => ({
  ...jest.requireActual('../../../lib/googleDrive'),
  findFiles: jest.fn(),
  updateFile: jest.fn(),
  findFolders: jest.fn(),
  createFolder: jest.fn(),
  writeFile: jest.fn(),
  getFileContent: jest.fn(),
}));

describe('backupData', () => {
  const mockData = [
    { id: '1', name: 'Space 1', sections: [] },
    { id: '2', name: 'Space 2', sections: [] },
  ];
  const mockFileRes = { files: [{ id: 'fileId' }] };
  const mockFolderRes = { files: [{ id: 'folderId' }] };

  beforeEach(() => {
    jest.clearAllMocks();
    resetRemoteState();
  });

  it('should update file content if file exists', async () => {
    (findFiles as jest.Mock).mockResolvedValue(mockFileRes);

    await backupData(mockData);

    expect(findFiles).toHaveBeenCalled();
    expect(updateFile).toHaveBeenCalled();
    expect(createFolder).not.toHaveBeenCalled();
    expect(writeFile).not.toHaveBeenCalled();
  });

  it('should create new file if no file exists and no parent folder exists', async () => {
    (findFiles as jest.Mock).mockResolvedValue(undefined);
    (findFolders as jest.Mock).mockResolvedValue(undefined);

    await backupData(mockData);

    expect(findFiles).toHaveBeenCalled();
    expect(findFolders).toHaveBeenCalled();
    expect(createFolder).toHaveBeenCalled();
    expect(writeFile).toHaveBeenCalled();
    expect(updateFile).not.toHaveBeenCalled();
  });

  it('should create new file if no file exists and parent folder exists', async () => {
    (findFiles as jest.Mock).mockResolvedValue({});
    (findFolders as jest.Mock).mockResolvedValue(mockFolderRes);

    await backupData(mockData);

    expect(findFiles).toHaveBeenCalled();
    expect(findFolders).toHaveBeenCalled();
    expect(createFolder).not.toHaveBeenCalled();
    expect(writeFile).toHaveBeenCalled();
    expect(updateFile).not.toHaveBeenCalled();
  });

  it('should pass the abort signal to every Google Drive request', async () => {
    const { signal } = new AbortController();

    (findFiles as jest.Mock).mockResolvedValue({});
    (findFolders as jest.Mock).mockResolvedValue(undefined);
    (createFolder as jest.Mock).mockResolvedValue({ id: 'folderId' });

    await backupData(mockData, signal);

    expect(findFiles).toHaveBeenCalledWith(expect.any(String), expect.any(String), { signal });
    expect(findFolders).toHaveBeenCalledWith(expect.any(String), { signal });
    expect(createFolder).toHaveBeenCalledWith(expect.any(String), { signal });
    expect(writeFile).toHaveBeenCalledWith(
      expect.any(String),
      mockData,
      expect.objectContaining({ parents: ['folderId'], signal }),
    );
  });

  it('should pass the abort signal when updating an existing file', async () => {
    const { signal } = new AbortController();

    (findFiles as jest.Mock).mockResolvedValue(mockFileRes);

    await backupData(mockData, signal);

    expect(updateFile).toHaveBeenCalledWith('fileId', mockData, { signal });
  });
});

describe('backupData conflict protection', () => {
  const localData: Space[] = [{ id: 'space1', name: 'Local', sections: [] }];
  const remoteData: Space[] = [{ id: 'space1', name: 'Remote', sections: [] }];
  const fileAt = (modifiedTime: string) => ({ files: [{ id: 'fileId', modifiedTime }] });

  beforeEach(() => {
    jest.clearAllMocks();
    resetRemoteState();
    (getFileContent as jest.Mock).mockResolvedValue(remoteData);
  });

  it('should save when the file has not changed since it was read', async () => {
    (findFiles as jest.Mock).mockResolvedValue(fileAt('t1'));
    (updateFile as jest.Mock).mockResolvedValue({ id: 'fileId', modifiedTime: 't2' });

    await readBackupData();
    await backupData(localData);

    // The next save compares with the time of our own write
    (findFiles as jest.Mock).mockResolvedValue(fileAt('t2'));
    await backupData(localData);

    expect(updateFile).toHaveBeenCalledTimes(2);
  });

  it('should refuse to save when another device changed the file', async () => {
    (findFiles as jest.Mock).mockResolvedValue(fileAt('t1'));
    await readBackupData();

    (findFiles as jest.Mock).mockResolvedValue(fileAt('t9'));

    await expect(backupData(localData)).rejects.toBeInstanceOf(RemoteConflictError);
    expect(updateFile).not.toHaveBeenCalled();
  });

  it('should refuse to save when another device created the file after an empty read', async () => {
    (findFiles as jest.Mock).mockResolvedValue({ files: [] });
    await readBackupData();

    (findFiles as jest.Mock).mockResolvedValue(fileAt('t1'));

    await expect(backupData(localData)).rejects.toBeInstanceOf(RemoteConflictError);
  });

  it('should save when the file was deleted remotely', async () => {
    (findFiles as jest.Mock).mockResolvedValue(fileAt('t1'));
    await readBackupData();

    (findFiles as jest.Mock).mockResolvedValue({ files: [] });
    (findFolders as jest.Mock).mockResolvedValue({ files: [{ id: 'folderId' }] });
    (writeFile as jest.Mock).mockResolvedValue({ id: 'fileId', modifiedTime: 't2' });

    await backupData(localData);

    expect(writeFile).toHaveBeenCalled();
  });

  it('should not treat an aborted write of ours that still landed as a conflict', async () => {
    const abortError = new DOMException('The operation was aborted.', 'AbortError');

    (findFiles as jest.Mock).mockResolvedValue(fileAt('t1'));
    await readBackupData();

    // Drive applies the first write but the response never arrives
    (updateFile as jest.Mock).mockRejectedValueOnce(abortError);
    await expect(backupData(localData)).rejects.toBe(abortError);

    (findFiles as jest.Mock).mockResolvedValue(fileAt('t2'));
    (getFileContent as jest.Mock).mockResolvedValue(localData);
    (updateFile as jest.Mock).mockResolvedValue({ id: 'fileId', modifiedTime: 't3' });

    await backupData(localData);

    expect(updateFile).toHaveBeenCalledTimes(2);
  });

  it('should still detect a conflict after an aborted write when the content differs', async () => {
    (findFiles as jest.Mock).mockResolvedValue(fileAt('t1'));
    await readBackupData();

    (updateFile as jest.Mock).mockRejectedValueOnce(new DOMException('Aborted', 'AbortError'));
    await expect(backupData(localData)).rejects.toThrow();

    (findFiles as jest.Mock).mockResolvedValue(fileAt('t2'));

    await expect(backupData(localData)).rejects.toBeInstanceOf(RemoteConflictError);
  });
});
