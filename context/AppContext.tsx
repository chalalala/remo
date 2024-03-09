import { cookieKey } from '@/constants/cookies';
import { Section } from '@/types/Resource';
import { backupData, readBackupData } from '@/utils/apis/remoteData';
import { getCookie } from '@/utils/cookies';
import { isExtension } from '@/utils/env';
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
import useSWRImmutable from 'swr/immutable';

type GoogleAuth = ReturnType<typeof window.google.accounts.oauth2.initTokenClient>;

interface AppContextValue {
  // States
  sections: Section[];
  googleAuth: GoogleAuth | undefined;
  accessToken: string;
  error: unknown;

  // Actions
  setSections: (sections: Section[]) => void;
  setGoogleAuth: Dispatch<SetStateAction<GoogleAuth | undefined>>;
  setAccessToken: Dispatch<SetStateAction<string>>;
}

const AppContext = createContext<AppContextValue>({} as never);

export const AppContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const [googleAuth, setGoogleAuth] = useState<GoogleAuth>();
  const [accessToken, setAccessToken] = useState('');
  const { data: sections, error, mutate } = useSWRImmutable('backupData', readBackupData);

  const setSections = async (data: Section[]) => {
    mutate(backupData(data), {
      optimisticData: data,
      rollbackOnError: true,
      populateCache: true,
      revalidate: false,
    });
  };

  useEffect(() => {
    if (isExtension()) {
      chrome.identity.getAuthToken({ interactive: true }, (token) => {
        if (token) {
          setAccessToken(token);
        }
      });

      return;
    }

    const token = getCookie(cookieKey.GAPI_TOKEN);

    if (token) {
      setAccessToken(token);
    }
  }, []);

  const contextValue: AppContextValue = {
    // States
    sections: sections || [],
    googleAuth,
    accessToken,
    error,

    // Actions
    setSections,
    setGoogleAuth,
    setAccessToken,
  };

  return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>;
};

export const useAppContext = () => useContext(AppContext);
