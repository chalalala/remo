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
  } = useSWRImmutable(accessToken ? ['backupData', accessToken] : undefined, readBackupData, {
    keepPreviousData: true,
  });

  const mutate = useCallback(
    (data: Space[]) => {
      swrMutate(
        async () => {
          if (abortController.current) {
            abortController.current.abort();
          }

          abortController.current = new AbortController();

          const res = await backupData(data, abortController.current.signal);

          abortController.current = undefined;

          return res;
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
      isLoading,
      refresh: swrMutate,
      mutate,
    }),
    [data, error, isLoading, swrMutate, mutate],
  );
};
