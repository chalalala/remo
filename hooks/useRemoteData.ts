import { Space } from '@/types/Resource';
import { backupData, readBackupData } from '@/utils/apis/remoteData';
import { useCallback, useMemo } from 'react';
import useSWRImmutable from 'swr/immutable';

export const useRemoteData = (accessToken: string) => {
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
      swrMutate(backupData(data), {
        optimisticData: data,
        rollbackOnError: true,
        populateCache: true,
        revalidate: false,
      });
    },
    [swrMutate],
  );

  return useMemo(
    () => ({
      spaces: data || [],
      error,
      isLoading,
      mutate,
    }),
    [data, error, isLoading, mutate],
  );
};
