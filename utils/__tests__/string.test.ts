import { DEFAULT_ID_LENGTH, generateId } from '../string';

describe('generateId', () => {
  it('should return a random string with window.crypto.getRandomValues', () => {
    const id = generateId();

    expect(typeof id).toEqual('string');
    expect(id).toHaveLength(DEFAULT_ID_LENGTH);
  });

  it('should return a random string without window.crypto.getRandomValues', () => {
    const originalCrypto = window.crypto;

    Object.defineProperty(window, 'crypto', {
      value: undefined,
      writable: true,
    });

    const id = generateId();

    expect(typeof id).toEqual('string');
    expect(id).toHaveLength(DEFAULT_ID_LENGTH);

    Object.defineProperty(window, 'crypto', {
      value: originalCrypto,
      writable: true,
    });
  });

  it('should generate ID of specified length with window.crypto.getRandomValues', () => {
    const length = 10;

    expect(generateId(length)).toHaveLength(length);
  });

  it('should generate ID of specified length without window.crypto.getRandomValues', () => {
    const length = 10;

    const originalCrypto = window.crypto;

    Object.defineProperty(window, 'crypto', {
      value: undefined,
      writable: true,
    });

    const id = generateId(length);

    expect(typeof id).toEqual('string');
    expect(id).toHaveLength(length);

    Object.defineProperty(window, 'crypto', {
      value: originalCrypto,
      writable: true,
    });
  });
});
