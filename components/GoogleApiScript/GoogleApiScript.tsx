import { cookieKey } from '@/constants/cookies';
import { useAppContext } from '@/context/AppContext';
import { setCookie } from '@/utils/cookies';
import Script from 'next/script';
import { FC, useCallback } from 'react';

const SCOPE = 'https://www.googleapis.com/auth/drive.file';

export const GoogleApiScript: FC = () => {
  const { setGoogleAuth, setAccessToken } = useAppContext();

  const initTokenClient = useCallback(() => {
    try {
      const authClient = window.google.accounts.oauth2.initTokenClient({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_API_CLIENT_ID || '',
        scope: SCOPE,
        callback: (tokenResponse) => {
          if (!tokenResponse) {
            return;
          }

          const token = tokenResponse.access_token;
          const expires = Number(tokenResponse.expires_in);

          setCookie(cookieKey.GAPI_TOKEN, token, expires * 1000);
          setAccessToken(token);
        },
      });

      setGoogleAuth(authClient);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
  }, [setGoogleAuth, setAccessToken]);

  return (
    <Script
      src="https://accounts.google.com/gsi/client"
      onLoad={initTokenClient}
      async
      defer
    />
  );
};
