export type StorageSubscriber = () => void;

export interface LocalStorageStore {
  getSnapshot: () => string;
  setSnapshot: (value: string) => void;
  subscribe: (callback: StorageSubscriber) => () => void;
}

function isBrowser() {
  return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
}

function getStorageEventName(key: string) {
  return `storage:${key}:updated`;
}

export function readStorage(key: string, fallbackValue = '') {
  if (!isBrowser()) {
    return fallbackValue;
  }

  return localStorage.getItem(key) ?? fallbackValue;
}

export function writeStorage(key: string, value: string) {
  if (!isBrowser()) {
    return;
  }

  localStorage.setItem(key, value);
  window.dispatchEvent(new CustomEvent(getStorageEventName(key)));
}

export function readJsonStorage<T>(key: string, fallbackValue: T): T {
  const rawValue = readStorage(key);

  if (!rawValue) {
    return fallbackValue;
  }

  try {
    return JSON.parse(rawValue) as T;
  } catch {
    return fallbackValue;
  }
}

export function writeJsonStorage<T>(key: string, value: T) {
  writeStorage(key, JSON.stringify(value));
}

export function subscribeStorage(key: string, callback: StorageSubscriber) {
  if (!isBrowser()) {
    return () => undefined;
  }

  const listener = () => callback();
  const eventName = getStorageEventName(key);

  window.addEventListener(eventName, listener);
  window.addEventListener('storage', listener);

  return () => {
    window.removeEventListener(eventName, listener);
    window.removeEventListener('storage', listener);
  };
}

export function createLocalStorageStore(
  key: string,
  fallbackValue = '',
): LocalStorageStore {
  return {
    getSnapshot: () => readStorage(key, fallbackValue),
    setSnapshot: (value) => writeStorage(key, value),
    subscribe: (callback) => subscribeStorage(key, callback),
  };
}
