export const getSelfHostedFavicon = async (url: string) => {
  try {
    const parsedURL = new URL(url);
    const origin = parsedURL.origin;
    const iconUrl = `${origin}/favicon.ico`;
    const controller = new AbortController();

    setTimeout(() => {
      controller.abort();
    }, 1000);

    const res = await fetch(iconUrl, {
      signal: controller.signal,
    });

    if (res.status === 200) {
      return iconUrl;
    }
  } catch (error) {
    return '';
  }
};
