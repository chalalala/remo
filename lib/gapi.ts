import { cookieKey } from '@/constants/cookies';
import { getCookie, removeCookie } from '../utils/cookies';

export const signOut = (callbackFunc: () => void) => {
  const cname = cookieKey.GAPI_TOKEN;
  const token = getCookie(cname);

  if (token) {
    window.google.accounts.oauth2.revoke(token, callbackFunc);
    removeCookie(cname);
  }
};
