export function isObject<T extends Record<string, unknown>>(arg: unknown): arg is T {
  return typeof arg === 'object' && arg !== null && !Array.isArray(arg);
}
