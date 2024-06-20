import { cookieKey } from '@/constants/cookies';
import { removeCookie } from '../utils/cookies';
import { isExtension } from '@/lib/chromeApi';
import { getAccessToken } from './googleDrive';
import { localStorageKey } from '@/constants/local-storage';

export const signOut = async (callbackFunc: () => void) => {
  const token = await getAccessToken();

  if (!token) {
    return;
  }

  if (isExtension()) {
    const url = `https://accounts.google.com/o/oauth2/revoke?token=${token}`;

    window.fetch(url);

    chrome.identity.removeCachedAuthToken({ token }, callbackFunc);

    return;
  }

  window.google.accounts.oauth2.revoke(token, callbackFunc);

  removeCookie(cookieKey.GAPI_TOKEN);

  Object.values(localStorageKey).forEach((key) => {
    localStorage.removeItem(key);
  });
};
