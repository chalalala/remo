import { localStorageKey } from '@/constants/local-storage';
import { Space } from '@/types/Resource';
import { backupData, readBackupData } from '@/utils/apis/remoteData';
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

  const mutate = useCallback(
    (data: Space[]) => {
      swrMutate(
        async () => {
          try {
            if (abortController.current) {
              abortController.current.abort();
            }

            abortController.current = new AbortController();
            await backupData(data, abortController.current.signal);
            localStorage.setItem(localStorageKey.LOCAL_DATA, JSON.stringify(data));
          } catch (error) {}

          abortController.current = undefined;

          return data;
        },
        {
          optimisticData: data,
          rollbackOnError: true,
          populateCache: true,
          revalidate: false,
        },
      );
    },
    [swrMutate],
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
