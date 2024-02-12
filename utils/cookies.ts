/**
 *
 * @param cname Cookie name
 * @param cvalue Cookie value
 * @param duration Duration (ms)
 */
export const setCookie = (cname: string, cvalue: string, duration: number) => {
  const expires = new Date();

  expires.setTime(expires.getTime() + duration);

  document.cookie = cname + '=' + cvalue + ';' + new Date(expires).toUTCString() + ';path=/';
};

export const getCookie = (cname: string) => {
  const name = cname + '=';
  const decodedCookie = decodeURIComponent(document.cookie);
  const ca = decodedCookie.split(';');

  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];

    while (c.charAt(0) === ' ') {
      c = c.substring(1);
    }

    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length);
    }
  }

  return '';
};

export const removeCookie = (cname: string) => {
  const expireTime = new Date();

  expireTime.setFullYear(expireTime.getFullYear() - 1);

  setCookie(cname, '', expireTime.getMilliseconds());
};
