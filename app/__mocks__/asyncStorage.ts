/**
 * Mock for @react-native-async-storage/async-storage
 * Used in tests to simulate local storage
 */

type StorageData = Record<string, string>;

let storage: StorageData = {};

const asyncStorageMock = {
  getItem: jest.fn((key: string): Promise<string | null> => {
    return Promise.resolve(storage[key] ?? null);
  }),

  setItem: jest.fn((key: string, value: string): Promise<void> => {
    storage[key] = value;
    return Promise.resolve();
  }),

  removeItem: jest.fn((key: string): Promise<void> => {
    delete storage[key];
    return Promise.resolve();
  }),

  clear: jest.fn((): Promise<void> => {
    storage = {};
    return Promise.resolve();
  }),

  getAllKeys: jest.fn((): Promise<string[]> => {
    return Promise.resolve(Object.keys(storage));
  }),

  multiGet: jest.fn((keys: string[]): Promise<[string, string | null][]> => {
    const result = keys.map((key): [string, string | null] => [key, storage[key] ?? null]);
    return Promise.resolve(result);
  }),

  multiSet: jest.fn((keyValuePairs: [string, string][]): Promise<void> => {
    keyValuePairs.forEach(([key, value]) => {
      storage[key] = value;
    });
    return Promise.resolve();
  }),

  multiRemove: jest.fn((keys: string[]): Promise<void> => {
    keys.forEach((key) => {
      delete storage[key];
    });
    return Promise.resolve();
  }),

  mergeItem: jest.fn((key: string, value: string): Promise<void> => {
    const existing = storage[key];
    if (existing) {
      try {
        const merged = { ...JSON.parse(existing), ...JSON.parse(value) };
        storage[key] = JSON.stringify(merged);
      } catch {
        storage[key] = value;
      }
    } else {
      storage[key] = value;
    }
    return Promise.resolve();
  }),

  multiMerge: jest.fn(async (keyValuePairs: [string, string][]): Promise<void> => {
    await Promise.all(
      keyValuePairs.map(([key, value]) => asyncStorageMock.mergeItem(key, value))
    );
  }),
};

// Helper to reset storage state between tests
export const resetAsyncStorage = () => {
  storage = {};
  Object.values(asyncStorageMock).forEach((mock) => {
    if (typeof mock === 'function' && 'mockClear' in mock) {
      (mock as jest.Mock).mockClear();
    }
  });
};

// Helper to set initial storage state for tests
export const setAsyncStorageData = (data: StorageData) => {
  storage = { ...data };
};

// Helper to get current storage state
export const getAsyncStorageData = (): StorageData => ({ ...storage });

export default asyncStorageMock;
