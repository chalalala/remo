export const isExtension = () => {
  return typeof chrome !== 'undefined' && !!chrome.runtime && !!chrome.runtime.id;
};
