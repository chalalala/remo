import { createFolder, findFiles, findFolders, updateFile, writeFile } from '@/lib/googleDrive';
import { backupData } from '../remoteData';

jest.mock('../../../lib/googleDrive', () => ({
  ...jest.requireActual('../../../lib/googleDrive'),
  findFiles: jest.fn(),
  updateFile: jest.fn(),
  findFolders: jest.fn(),
  createFolder: jest.fn(),
  writeFile: jest.fn(),
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
