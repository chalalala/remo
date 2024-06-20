import { cookieKey } from '@/constants/cookies';
import { localStorageKey } from '@/constants/local-storage';
import { useRemoteData } from '@/hooks/useRemoteData';
import { Section, Space } from '@/types/Resource';
import { getCookie } from '@/utils/cookies';
import { isExtension } from '@/lib/chromeApi';
import {
  Dispatch,
  FC,
  PropsWithChildren,
  SetStateAction,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

type GoogleAuth = ReturnType<typeof window.google.accounts.oauth2.initTokenClient>;

interface AppContextValue {
  // States
  spaces: Space[];
  selectedSpace: Space | undefined;
  sections: Section[];
  googleAuth: GoogleAuth | undefined;
  accessToken: string;
  error: unknown;
  isLoading: boolean;

  // Actions
  setSections: (sections: Section[]) => void;
  setGoogleAuth: Dispatch<SetStateAction<GoogleAuth | undefined>>;
  setAccessToken: Dispatch<SetStateAction<string>>;
  setSelectedSpaceId: Dispatch<SetStateAction<string>>;
}

const AppContext = createContext<AppContextValue>({} as never);

export const AppContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const [googleAuth, setGoogleAuth] = useState<GoogleAuth>();
  const [accessToken, setAccessToken] = useState('');
  const { spaces, error, isLoading, mutate } = useRemoteData(accessToken);
  const [selectedSpaceId, setSelectedSpaceId] = useState<string>('');
  const [localStorageData, setLocalStorageData] = useState<Space[]>([]);

  const selectedSpace = useMemo(() => {
    if (isLoading) {
      return localStorageData.find((space) => space.id === selectedSpaceId);
    }

    return spaces.find((space) => space.id === selectedSpaceId);
  }, [isLoading, localStorageData, spaces, selectedSpaceId]);

  const sections = useMemo(() => selectedSpace?.sections || [], [selectedSpace]);

  const setSections = useCallback(
    async (data: Section[]) => {
      if (isLoading || !selectedSpace) {
        return;
      }

      const newSpaces = spaces.map((space) => {
        if (space.id === selectedSpace.id) {
          return {
            ...space,
            sections: data,
          };
        }

        return space;
      });

      mutate(newSpaces);
    },
    [spaces, selectedSpace, isLoading, mutate],
  );

  useEffect(() => {
    const localData = localStorage.getItem(localStorageKey.LOCAL_DATA);

    try {
      setLocalStorageData(localData ? JSON.parse(localData) : []);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }

    if (isExtension()) {
      chrome.identity.getAuthToken({ interactive: false }, (token) => {
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

  useEffect(() => {
    const lastUsedSpaceId = localStorage.getItem(localStorageKey.LAST_SPACE_ID);

    localStorage.setItem(localStorageKey.LOCAL_DATA, JSON.stringify(spaces));

    setSelectedSpaceId(lastUsedSpaceId || spaces[0]?.id);
  }, [spaces]);

  const contextValue: AppContextValue = {
    // States
    spaces,
    selectedSpace,
    sections: sections || [],
    googleAuth,
    accessToken,
    error,
    isLoading,

    // Actions
    setSections,
    setGoogleAuth,
    setAccessToken,
    setSelectedSpaceId,
  };

  return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>;
};

export const useAppContext = () => useContext(AppContext);
