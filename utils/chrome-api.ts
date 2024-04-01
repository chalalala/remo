import { isExtension } from './env';
import { getFaviconFromURL } from './sections/sectionItem';

export const getDataFromActiveTab = async () => {
  if (!isExtension()) {
    return { url: '', icon: '' };
  }

  const queryOptions = { active: true, currentWindow: true };

  const [tab] = await chrome.tabs.query(queryOptions);

  const url = tab?.url || '';

  const icon = await getFaviconFromURL(url);

  return { url, icon };
};
