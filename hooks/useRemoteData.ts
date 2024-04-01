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
  } = useSWRImmutable(accessToken ? ['backupData', accessToken] : undefined, readBackupData, {
    keepPreviousData: true,
  });

  const sendBackupData = useCallback(async (data: ArrayBuffer) => {
    if (abortController.current) {
      abortController.current.abort();
    }

    abortController.current = new AbortController();

    const res = await backupData(data, abortController.current.signal);

    abortController.current = undefined;

    return res;
  }, []);

  const mutate = useCallback(
    async (data: ArrayBuffer) => {
      swrMutate(async () => await sendBackupData(data), {
        optimisticData: data,
        rollbackOnError: true,
        populateCache: true,
        revalidate: false,
      });
    },
    [sendBackupData, swrMutate],
  );

  return useMemo(
    () => ({
      data,
      error,
      isLoading: isLoading || isValidating,
      refresh: swrMutate,
      mutate,
    }),
    [data, error, isLoading, isValidating, swrMutate, mutate],
  );
};
