import { localStorageKey } from '@/constants/local-storage';
import { sqlQuery } from '@/constants/queries';
import { useRemoteData } from '@/hooks/useRemoteData';
import { getAccessToken } from '@/lib/googleDrive';
import {
  Dispatch,
  FC,
  PropsWithChildren,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import initSqlJs, { Database } from 'sql.js';

type GoogleAuth = ReturnType<typeof window.google.accounts.oauth2.initTokenClient>;

interface AppContextValue {
  // States
  db: Database | undefined;
  selectedSpaceId: string;
  googleAuth: GoogleAuth | undefined;
  accessToken: string;
  localStorageData: ArrayBufferLike | undefined;
  isLoading: boolean;
  error: unknown;

  // Actions
  setGoogleAuth: Dispatch<SetStateAction<GoogleAuth | undefined>>;
  setAccessToken: Dispatch<SetStateAction<string>>;
  setSelectedSpaceId: Dispatch<SetStateAction<string>>;
  setIsLoading: (isLoading: boolean) => void;
}

const AppContext = createContext<AppContextValue>({} as never);

export const AppContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const [googleAuth, setGoogleAuth] = useState<GoogleAuth>();
  const [accessToken, setAccessToken] = useState('');
  const [selectedSpaceId, setSelectedSpaceId] = useState<string>('');
  const [localStorageData, setLocalStorageData] = useState<Uint8Array | undefined>();
  const [db, setDb] = useState<Database | undefined>();
  const [isLoading, setIsLoading] = useState(false);

  const { data, error, isLoading: isLoadingDB } = useRemoteData(accessToken);

  useEffect(() => {
    const getToken = async () => {
      const token = await getAccessToken();

      setAccessToken(token);
    };

    const getLocalData = () => {
      const localData = localStorage.getItem(localStorageKey.LOCAL_DATA);

      try {
        setLocalStorageData(localData ? JSON.parse(localData) : []);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
      }
    };

    const lastUsedSpaceId = localStorage.getItem(localStorageKey.LAST_SPACE_ID);

    setSelectedSpaceId(lastUsedSpaceId || '');
    getLocalData();
    getToken();
  }, []);

  useEffect(() => {
    let db: Database | undefined;

    const initDatabase = async () => {
      try {
        const SQL = await initSqlJs({
          locateFile: (file) => `https://sql.js.org/dist/${file}`,
        });

        db = new SQL.Database(data ? new Uint8Array(data) : localStorageData);

        db.exec(sqlQuery.CREATE_TABLES);

        localStorage.setItem(localStorageKey.LOCAL_DATA, JSON.stringify(db.export()));

        setDb(db);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error(err);
      }
    };

    initDatabase();

    return () => {
      db?.close();
    };
  }, [data, localStorageData]);

  const contextValue: AppContextValue = {
    // States
    db,
    selectedSpaceId,
    googleAuth,
    accessToken,
    error,
    localStorageData,
    isLoading: isLoading || isLoadingDB,

    // Actions
    setGoogleAuth,
    setAccessToken,
    setSelectedSpaceId,
    setIsLoading,
  };

  return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>;
};

export const useAppContext = () => useContext(AppContext);
