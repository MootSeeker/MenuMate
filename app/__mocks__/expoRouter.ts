/**
 * Mock for expo-router
 * Used in tests to simulate navigation
 */

export const mockRouter = {
  push: jest.fn(),
  replace: jest.fn(),
  back: jest.fn(),
  canGoBack: jest.fn().mockReturnValue(true),
  dismiss: jest.fn(),
  dismissAll: jest.fn(),
  navigate: jest.fn(),
  setParams: jest.fn(),
};

export const mockSegments: string[] = [];
export const mockPathname = '/';

// Hook mocks
export const useRouter = jest.fn().mockReturnValue(mockRouter);
export const useSegments = jest.fn().mockReturnValue(mockSegments);
export const usePathname = jest.fn().mockReturnValue(mockPathname);
export const useLocalSearchParams = jest.fn().mockReturnValue({});
export const useGlobalSearchParams = jest.fn().mockReturnValue({});
export const useRootNavigationState = jest.fn().mockReturnValue({ key: 'root' });
export const useNavigation = jest.fn().mockReturnValue({
  navigate: jest.fn(),
  goBack: jest.fn(),
  setOptions: jest.fn(),
  addListener: jest.fn().mockReturnValue(() => {}),
  removeListener: jest.fn(),
  isFocused: jest.fn().mockReturnValue(true),
  canGoBack: jest.fn().mockReturnValue(true),
  getParent: jest.fn(),
  getState: jest.fn().mockReturnValue({ routes: [], index: 0 }),
});

export const useFocusEffect = jest.fn((callback) => {
  // Execute the callback immediately in tests
  callback();
});

// Component mocks
export const Link = jest.fn(({ children }) => children);
export const Redirect = jest.fn(() => null);
export const Stack = jest.fn(({ children }) => children);
Stack.Screen = jest.fn(({ children }) => children);

export const Tabs = jest.fn(({ children }) => children);
Tabs.Screen = jest.fn(({ children }) => children);

export const Slot = jest.fn(({ children }) => children);

// Router instance
export const router = mockRouter;

// Helper to reset all navigation mocks
export const resetRouterMocks = () => {
  Object.values(mockRouter).forEach((mock) => {
    if (typeof mock === 'function' && 'mockClear' in mock) {
      (mock as jest.Mock).mockClear();
    }
  });
  useRouter.mockClear();
  useSegments.mockClear();
  usePathname.mockClear();
  useLocalSearchParams.mockClear();
  useGlobalSearchParams.mockClear();
  useNavigation.mockClear();
  useFocusEffect.mockClear();
};

// Helper to set mock segments
export const setMockSegments = (segments: string[]) => {
  useSegments.mockReturnValue(segments);
};

// Helper to set mock pathname
export const setMockPathname = (pathname: string) => {
  usePathname.mockReturnValue(pathname);
};

// Helper to set mock search params
export const setMockSearchParams = (params: Record<string, string>) => {
  useLocalSearchParams.mockReturnValue(params);
  useGlobalSearchParams.mockReturnValue(params);
};

export default {
  useRouter,
  useSegments,
  usePathname,
  useLocalSearchParams,
  useGlobalSearchParams,
  useRootNavigationState,
  useNavigation,
  useFocusEffect,
  Link,
  Redirect,
  Stack,
  Tabs,
  Slot,
  router,
};
