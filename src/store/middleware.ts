import { StateCreator, StoreApi, StoreMutatorIdentifier } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type Logger = <
  T extends unknown,
  Mps extends [StoreMutatorIdentifier, unknown][] = [],
  Mcs extends [StoreMutatorIdentifier, unknown][] = []
>(
  f: StateCreator<T, Mps, Mcs>,
  name?: string
) => StateCreator<T, Mps, Mcs>;

type LoggerImpl = <T extends unknown>(
  f: StateCreator<T, [], []>,
  name?: string
) => StateCreator<T, [], []>;

const loggerImpl: LoggerImpl = (f, name) => (set, get, store) => {
  type T = ReturnType<typeof f>;
  const loggedSet: typeof set = (...a) => {
    const next = a[0](get());
    console.group(
      `%c ${name || "store"}`,
      "color: #22c55e; font-weight: bold;"
    );
    console.log("%c prev", "color: #9ca3af; font-weight: bold;", get());
    console.log("%c next", "color: #22c55e; font-weight: bold;", next);
    console.groupEnd();
    return set(...a);
  };
  return f(loggedSet, get, store);
};

export const logger = loggerImpl as unknown as Logger;

type PersistOptions<T> = {
  name: string;
  partialize?: (state: T) => Partial<T>;
  version?: number;
  migrate?: (persistedState: any, version: number) => T;
};

export const createPersistedStore = <T extends object>(
  storeCreator: StateCreator<T, [], []>,
  options: PersistOptions<T>
) => {
  const { name, partialize, version = 1, migrate } = options;

  return persist(storeCreator, {
    name,
    storage: createJSONStorage(() => localStorage),
    partialize: partialize || ((state) => state),
    version,
    migrate: migrate || ((persistedState, version) => persistedState as T),
  });
};

type CacheOptions = {
  ttl?: number; // Time to live in milliseconds
  maxSize?: number; // Maximum number of items in cache
};

export const withCache = <T extends object>(
  storeCreator: StateCreator<T, [], []>,
  options: CacheOptions = {}
) => {
  const { ttl = 5 * 60 * 1000, maxSize = 100 } = options;
  const cache = new Map<string, { data: any; timestamp: number }>();

  return ((set, get, store) => {
    const cachedGet = async <K extends keyof T>(
      key: K,
      fetcher: () => Promise<T[K]>
    ): Promise<T[K]> => {
      const cacheKey = String(key);
      const cached = cache.get(cacheKey);

      if (cached && Date.now() - cached.timestamp < ttl) {
        return cached.data;
      }

      const data = await fetcher();
      cache.set(cacheKey, { data, timestamp: Date.now() });

      // Limpa cache antigo se exceder tamanho máximo
      if (cache.size > maxSize) {
        const oldestKey = Array.from(cache.entries()).sort(
          (a, b) => a[1].timestamp - b[1].timestamp
        )[0][0];
        cache.delete(oldestKey);
      }

      return data;
    };

    return storeCreator(
      set,
      () => ({
        ...get(),
        cachedGet,
      }),
      store
    );
  }) as StateCreator<T, [], []>;
};

// Exemplo de uso:
/*
const useStore = create(
  withCache(
    createPersistedStore(
      logger(
        (set) => ({
          data: null,
          fetchData: async (id: string) => {
            const data = await cachedGet("data", () => fetch(`/api/data/${id}`));
            set({ data });
          },
        }),
        "MyStore"
      ),
      {
        name: "my-store",
        version: 1,
        partialize: (state) => ({ data: state.data }),
      }
    ),
    {
      ttl: 5 * 60 * 1000, // 5 minutos
      maxSize: 100,
    }
  )
);
*/
