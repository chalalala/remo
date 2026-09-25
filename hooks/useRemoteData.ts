import { toast } from '@/components/ui/use-toast';
import { localStorageKey } from '@/constants/local-storage';
import { useResources } from '@/stores/resources';
import { Space } from '@/types/Resource';
import { backupData, readBackupData } from '@/utils/apis/remoteData';
import { isObject } from '@/utils/object';
import { useCallback, useMemo } from 'react';
import useSWRImmutable from 'swr/immutable';

const isAbortError = (error: unknown) =>
  isObject(error) && 'name' in error && error.name === 'AbortError';

// Shared by every useRemoteData instance, so a new backup always cancels the one in flight
let currentBackup: AbortController | undefined;

export const useRemoteData = (accessToken: string) => {
  const {
    data,
    mutate: swrMutate,
    error,
    isLoading,
    isValidating,
  } = useSWRImmutable(accessToken ? ['backupData', accessToken] : undefined, readBackupData);
  const { setIsBackingUp } = useResources();

  const mutate = useCallback(
    async (data: Space[]) => {
      currentBackup?.abort();

      const controller = new AbortController();

      currentBackup = controller;
      setIsBackingUp(true);

      try {
        await swrMutate(
          async () => {
            await backupData(data, controller.signal);
            localStorage.setItem(localStorageKey.LOCAL_DATA, JSON.stringify(data));

            return data;
          },
          {
            optimisticData: data,
            rollbackOnError: true,
            populateCache: true,
            revalidate: false,
          },
        );
      } catch (error) {
        if (!isAbortError(error)) {
          toast({
            variant: 'destructive',
            title: 'Failed to save changes',
            description: 'Your latest change was not saved to Google Drive. Please try again.',
          });
        }
      } finally {
        // Only the latest backup may clear the state, an aborted one must not stop the spinner
        if (currentBackup === controller) {
          currentBackup = undefined;
          setIsBackingUp(false);
        }
      }
    },
    [setIsBackingUp, swrMutate],
  );

  return useMemo(
    () => ({
      spaces: data || [],
      error,
      isLoading: isLoading || isValidating,
      refresh: swrMutate,
      mutate,
    }),
    [data, error, isLoading, isValidating, swrMutate, mutate],
  );
};
