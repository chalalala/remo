import { getCookie, setCookie, removeCookie } from '../cookies';
import { MockObject } from '../test-helpers';

describe('getCookie', () => {
  const mockCookie = new MockObject(
    document,
    'cookie',
    'cookie1=value1; cookie2=value2; cookie3=value3',
  );

  beforeEach(() => {
    mockCookie.setup();
  });

  afterEach(() => {
    mockCookie.restore();
  });

  it('should return the value of an existing cookie', () => {
    const cookieValue = getCookie('cookie2');

    expect(cookieValue).toBe('value2');
  });

  it('should return an empty string for a non-existing cookie', () => {
    const cookieValue = getCookie('nonExistingCookie');

    expect(cookieValue).toBe('');
  });
});

describe('setCookie', () => {
  const mockCookie = new MockObject(document, 'cookie', '');
  const mockDate = new Date(2024, 3, 2, 0, 0, 0, 0);

  beforeEach(() => {
    mockCookie.setup();
    jest.useFakeTimers();
    jest.setSystemTime(mockDate);
  });

  afterEach(() => {
    mockCookie.restore();
    jest.useRealTimers();
  });

  it('should set a cookie with the provided name, value, and duration', () => {
    const duration = 3600;

    setCookie('newCookie', 'newValue', duration);

    const expiresTime = mockDate;

    expiresTime.setTime(mockDate.getTime() + duration);

    expect(document.cookie).toBe(`newCookie=newValue; expires=${mockDate.toUTCString()}; path=/`);
  });
});

describe('removeCookie', () => {
  const mockCookie = new MockObject(
    document,
    'cookie',
    'cookie1=value1; cookie2=value2; cookie3=value3',
  );
  const mockDate = new Date(2024, 3, 2, 0, 0, 0, 0);

  beforeEach(() => {
    mockCookie.setup();
    jest.useFakeTimers();
    jest.setSystemTime(mockDate);
  });

  afterEach(() => {
    mockCookie.restore();
    jest.useRealTimers();
  });

  it('should remove the specified cookie', () => {
    removeCookie('cookie2');

    const expiresTime = mockDate;

    expiresTime.setFullYear(expiresTime.getFullYear() - 1);

    expect(document.cookie).toBe(`cookie2=''; expires=${expiresTime.toUTCString()}; path=/`);
  });
});
