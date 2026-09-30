import { act, renderHook, waitFor } from '@testing-library/react';
import { toast } from '@/components/ui/use-toast';
import { localStorageKey } from '@/constants/local-storage';
import { useResources } from '@/stores/resources';
import { Space } from '@/types/Resource';
import { backupData, readBackupData } from '@/utils/apis/remoteData';
import { useRemoteData } from '../useRemoteData';

jest.mock('../../utils/apis/remoteData', () => ({
  readBackupData: jest.fn(),
  backupData: jest.fn(),
}));

jest.mock('../../components/ui/use-toast', () => ({
  toast: jest.fn(),
}));

const flush = () => new Promise((resolve) => setTimeout(resolve, 0));

// Resolves when called, or rejects with an AbortError once the signal is aborted
const deferredBackup = () => {
  let resolve: () => void = () => {};

  (backupData as jest.Mock).mockImplementationOnce(
    (data: Space[], signal: AbortSignal) =>
      new Promise((res, rej) => {
        resolve = () => res(data);
        signal.addEventListener('abort', () =>
          rej(new DOMException('The operation was aborted.', 'AbortError')),
        );
      }),
  );

  return () => resolve();
};

describe('useRemoteData', () => {
  const space = (id: string): Space => ({ id, name: `Space ${id}`, sections: [] });

  beforeEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    localStorage.clear();
    useResources.setState({ isBackingUp: false });
    (readBackupData as jest.Mock).mockResolvedValue([]);
  });

  let tokenCount = 0;

  // Each test gets its own SWR cache key
  const renderRemoteData = async (token = `token-${++tokenCount}`) => {
    const hook = renderHook(() => useRemoteData(token));

    await act(flush);
    expect(hook.result.current.isLoading).toBe(false);

    return hook;
  };

  it('should save data and stop backing up when the backup succeeds', async () => {
    const { result } = await renderRemoteData();
    const data = [space('1')];

    (backupData as jest.Mock).mockResolvedValue(data);

    await act(() => result.current.mutate(data));

    expect(backupData).toHaveBeenCalledWith(data, expect.any(AbortSignal));
    expect(localStorage.getItem(localStorageKey.LOCAL_DATA)).toBe(JSON.stringify(data));
    expect(result.current.spaces).toEqual(data);
    expect(useResources.getState().isBackingUp).toBe(false);
    expect(toast).not.toHaveBeenCalled();
  });

  it('should stop backing up, roll back and show a toast when the backup fails', async () => {
    const { result } = await renderRemoteData();

    (backupData as jest.Mock).mockRejectedValue({ code: 500, message: 'Server error' });

    await act(() => result.current.mutate([space('1')]));

    expect(useResources.getState().isBackingUp).toBe(false);
    expect(result.current.spaces).toEqual([]);
    expect(localStorage.getItem(localStorageKey.LOCAL_DATA)).toBeNull();
    expect(toast).toHaveBeenCalledWith(expect.objectContaining({ variant: 'destructive' }));
  });

  it('should roll back and offer a reload when another device changed the data', async () => {
    const { result } = await renderRemoteData();
    const conflict = Object.assign(new Error('Changed elsewhere'), { name: 'RemoteConflictError' });

    (backupData as jest.Mock).mockRejectedValue(conflict);

    await act(() => result.current.mutate([space('1')]));

    expect(result.current.spaces).toEqual([]);
    expect(useResources.getState().isBackingUp).toBe(false);
    expect(toast).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Remo was updated on another device',
        action: expect.anything(),
      }),
    );
  });

  it('should keep backing up until the latest of overlapping backups finishes', async () => {
    const { result } = await renderRemoteData();
    const first = [space('1')];
    const second = [space('1'), space('2')];

    deferredBackup();
    const resolveSecond = deferredBackup();

    let firstBackup: Promise<void> = Promise.resolve();
    let secondBackup: Promise<void> = Promise.resolve();

    act(() => {
      firstBackup = result.current.mutate(first);
    });
    act(() => {
      secondBackup = result.current.mutate(second);
    });

    // The first backup is aborted by the second one
    await act(() => firstBackup);

    expect(useResources.getState().isBackingUp).toBe(true);
    expect(toast).not.toHaveBeenCalled();

    resolveSecond();
    await act(() => secondBackup);

    expect(useResources.getState().isBackingUp).toBe(false);
    expect(result.current.spaces).toEqual(second);
    expect(toast).not.toHaveBeenCalled();
  });

  it('should abort a backup started from another hook instance', async () => {
    const { result: a } = await renderRemoteData('shared-token');
    const { result: b } = await renderRemoteData('shared-token');

    deferredBackup();
    const resolveSecond = deferredBackup();

    let firstBackup: Promise<void> = Promise.resolve();

    act(() => {
      firstBackup = a.current.mutate([space('1')]);
    });
    act(() => {
      b.current.mutate([space('2')]);
    });

    const firstSignal: AbortSignal = (backupData as jest.Mock).mock.calls[0][1];

    expect(firstSignal.aborted).toBe(true);

    await act(() => firstBackup);
    resolveSecond();

    await waitFor(() => expect(useResources.getState().isBackingUp).toBe(false));
  });
});
