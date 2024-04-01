import { useAppContext } from '@/context/AppContext';
import { useCallback } from 'react';
import { BindParams } from 'sql.js';

export const useDatabaseQuery = () => {
  const { db, setIsLoading } = useAppContext();

  const getQueryResultAsJson = useCallback(
    <T>(query: string, bindValues?: BindParams | undefined) => {
      if (!db) {
        return [];
      }

      setIsLoading(true);

      const data: T[] = [];

      const result = db.prepare(query);

      result.bind(bindValues);

      while (result.step()) {
        const row = result.getAsObject();

        data.push(row as T);
      }

      result.free();
      result.freemem();

      setIsLoading(false);

      return data;
    },
    [setIsLoading, db],
  );

  return { getQueryResultAsJson };
};
