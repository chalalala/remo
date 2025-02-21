import { localStorageKey } from '@/constants/local-storage';
import { useResources } from '@/stores/resources';
import { Space } from '@/types/Resource';
import { backupData, readBackupData } from '@/utils/apis/remoteData';
import { isObject } from '@/utils/object';
import { useCallback, useMemo, useRef } from 'react';
import useSWRImmutable from 'swr/immutable';

export const useRemoteData = (accessToken: string) => {
  const abortController = useRef<AbortController | undefined>();
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
      setIsBackingUp(true);

      await swrMutate(
        async () => {
          try {
            if (abortController.current) {
              abortController.current.abort();
            }

            abortController.current = new AbortController();
            await backupData(data, abortController.current.signal);
            localStorage.setItem(localStorageKey.LOCAL_DATA, JSON.stringify(data));

            return data;
          } catch (error) {
            if (isObject(error) && 'name' in error && error.name !== 'AbortError') {
              throw error;
            }
          } finally {
            abortController.current = undefined;
          }
        },
        {
          optimisticData: data,
          rollbackOnError: true,
          populateCache: true,
          revalidate: false,
        },
      );

      setIsBackingUp(false);
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
