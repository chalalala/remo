import { cookieKey } from '@/constants/cookies';
import { Section } from '@/types/Resource';
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

type GoogleAuth = ReturnType<typeof window.google.accounts.oauth2.initTokenClient>;

interface AppContextValue {
  // States
  sections: Section[];
  googleAuth: GoogleAuth | undefined;
  accessToken: string;

  // Actions
  setSections: Dispatch<SetStateAction<Section[]>>;
  setGoogleAuth: Dispatch<SetStateAction<GoogleAuth | undefined>>;
  setAccessToken: Dispatch<SetStateAction<string>>;
}

const AppContext = createContext<AppContextValue>({} as never);

export const AppContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const [googleAuth, setGoogleAuth] = useState<GoogleAuth>();
  const [accessToken, setAccessToken] = useState('');
  const [sections, setSections] = useState<Section[]>(() => [
    {
      id: 'section1',
      name: 'Item with a very very very very very very very very very very very very long name',
      items: [
        {
          id: 'test1',
          url: 'https://google.com',
          name: 'Item 1',
          icon: '',
        },
        {
          id: 'test2',
          name: 'Item 2 with a very very very very very very very very very very very very long name',
          url: '',
          icon: '',
        },
      ],
    },
    {
      id: 'section2',
      name: 'Item 2',
      items: [],
    },
  ]);

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
    sections,
    googleAuth,
    accessToken,

    // Actions
    setSections,
    setGoogleAuth,
    setAccessToken,
  };

  return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>;
};

export const useAppContext = () => useContext(AppContext);
