import { cookieKey } from '@/constants/cookies';
import { getCookie } from './cookies';

export const signOut = (callbackFunc: () => void) => {
  const token = getCookie(cookieKey.GAPI_TOKEN);

  if (token) {
    window.google.accounts.oauth2.revoke(token, callbackFunc);
  }
};
