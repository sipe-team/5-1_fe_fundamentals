import { useCallback, useSyncExternalStore } from 'react';

export interface PersistentStorageOptions<T> {
  key: string;
  version: number;
  initialValue: T;
  migrate?: (
    persistedState: unknown,
    persistedVersion: number,
  ) => T | undefined;
  storage?: Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;
}

interface Envelope<T> {
  version: number;
  state: T;
}

interface Store<T> {
  subscribe: (listener: () => void) => () => void;
  getSnapshot: () => T;
  getServerSnapshot: () => T;
  setValue: (next: T) => void;
}

type SetValue<T> = (value: T | ((prev: T) => T)) => void;

const registry = new Map<string, Store<unknown>>();

function getStorage(
  override?: PersistentStorageOptions<unknown>['storage'],
): Pick<Storage, 'getItem' | 'setItem' | 'removeItem'> | null {
  if (override) return override;

  if (typeof window === 'undefined') return null;

  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

function createStore<T>(options: PersistentStorageOptions<T>): Store<T> {
  const { key, version, initialValue, migrate } = options;
  const storage = getStorage(options.storage);
  const listeners = new Set<() => void>();

  function read(): T {
    if (!storage) return initialValue;
    try {
      const raw = storage.getItem(key);
      if (!raw) return initialValue;

      const parsed = JSON.parse(raw) as Envelope<T> | null;

      if (!parsed || typeof parsed !== 'object') return initialValue;

      if (parsed.version === version) {
        return parsed.state;
      }

      if (migrate) {
        const migrated = migrate(parsed.state, parsed.version);
        if (migrated !== undefined) {
          write(migrated);
          return migrated;
        }
      }
      return initialValue;
    } catch {
      return initialValue;
    }
  }

  function write(value: T) {
    if (!storage) return;

    try {
      const envelope: Envelope<T> = { version, state: value };
      storage.setItem(key, JSON.stringify(envelope));
    } catch {}
  }

  let cached: T = read();

  function emit() {
    for (const listener of listeners) listener();
  }

  function handleStorageEvent(event: StorageEvent) {
    if (event.key !== key) return;
    const next = read();
    if (!Object.is(next, cached)) {
      cached = next;
      emit();
    }
  }

  return {
    subscribe(listener) {
      listeners.add(listener);
      if (typeof window !== 'undefined') {
        window.addEventListener('storage', handleStorageEvent);
      }
      return () => {
        listeners.delete(listener);
        if (typeof window !== 'undefined' && listeners.size === 0) {
          window.removeEventListener('storage', handleStorageEvent);
        }
      };
    },
    getSnapshot: () => cached,
    getServerSnapshot: () => initialValue,
    setValue(next) {
      if (Object.is(next, cached)) return;
      cached = next;
      write(next);
      emit();
    },
  };
}

function getOrCreateStore<T>(options: PersistentStorageOptions<T>): Store<T> {
  const existing = registry.get(options.key) as Store<T> | undefined;

  if (existing) return existing;

  const store = createStore(options);

  registry.set(options.key, store as Store<unknown>);
  return store;
}

export function usePersistentStorage<T>(
  options: PersistentStorageOptions<T>,
): [T, SetValue<T>] {
  const store = getOrCreateStore(options);

  const value = useSyncExternalStore(
    store.subscribe,
    store.getSnapshot,
    store.getServerSnapshot,
  );

  const setValue = useCallback<SetValue<T>>(
    (next) => {
      const resolved =
        typeof next === 'function'
          ? (next as (prev: T) => T)(store.getSnapshot())
          : next;
      store.setValue(resolved);
    },
    [store],
  );

  return [value, setValue];
}
