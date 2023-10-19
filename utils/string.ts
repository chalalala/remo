export const DEFAULT_ID_LENGTH = 6;

/**
 * Generates a random ID string of the specified length.
 * @param length The length of the ID string to generate. Defaults to 6.
 * @returns A random ID string.
 */
export const generateId = (length = DEFAULT_ID_LENGTH): string => {
  if (window.crypto && window.crypto.getRandomValues) {
    const id = new Uint32Array(length);

    window.crypto.getRandomValues(id);

    const normalizedId = id.map((x) => x % 9);

    return normalizedId.join('');
  }

  let result = '';

  for (let i = 0; i < length; i++) {
    // Fallback if browser doesn't support window.crypto.getRandomValues
    result += (Math.floor(Math.random() * 100) % 9).toString();
  }

  return result;
};
