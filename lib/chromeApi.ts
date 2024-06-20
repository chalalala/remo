import { isExtension } from '../utils/env';

export interface ActiveTabData {
  url: string;
  icon: string;
  title: string;
}

export const getDataFromActiveTab = async (): Promise<ActiveTabData> => {
  if (!isExtension()) {
    return { url: '', icon: '', title: '' };
  }

  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  const url = tab?.url || '';
  const icon = tab?.favIconUrl || '';
  const title = tab?.title || '';

  return { url, icon, title };
};
