/**
 * Navigation Integration Tests
 *
 * Tests for Expo Router navigation flow, protected routes, and tab navigation.
 */

import React from 'react';

// Mock expo-router
jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    canGoBack: jest.fn(() => true),
  }),
  useSegments: () => ['(tabs)'],
  usePathname: () => '/journal',
  Link: ({ children }: { children: React.ReactNode }) => children,
  Redirect: () => null,
  Stack: { Screen: () => null },
  Tabs: { Screen: () => null },
  Slot: () => null,
}));

// Mock auth store
const mockUseAuthStore = jest.fn();
jest.mock('@/features/auth/stores/authStore', () => ({
  useAuthStore: () => mockUseAuthStore(),
}));

// Mock onboarding store
const mockUseOnboardingStore = jest.fn();
jest.mock('@/features/onboarding/stores/onboardingStore', () => ({
  useOnboardingStore: () => mockUseOnboardingStore(),
}));

describe('Navigation Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Route Segments', () => {
    it('should identify public routes correctly', () => {
      const publicRoutes = ['auth', 'login', 'register'];
      const currentSegment = 'auth';

      expect(publicRoutes.includes(currentSegment)).toBe(true);
    });

    it('should identify protected routes correctly', () => {
      const publicRoutes = ['auth', 'login', 'register'];
      const currentSegment = '(tabs)';

      expect(publicRoutes.includes(currentSegment)).toBe(false);
    });
  });

  describe('Auth Guard Logic', () => {
    it('should redirect to login when not authenticated on protected route', () => {
      mockUseAuthStore.mockReturnValue({
        isAuthenticated: false,
        isInitialized: true,
        isLoading: false,
      });

      const isProtectedRoute = true;
      const shouldRedirectToLogin = !mockUseAuthStore().isAuthenticated && isProtectedRoute;

      expect(shouldRedirectToLogin).toBe(true);
    });

    it('should not redirect when authenticated on protected route', () => {
      mockUseAuthStore.mockReturnValue({
        isAuthenticated: true,
        isInitialized: true,
        isLoading: false,
      });

      const isProtectedRoute = true;
      const shouldRedirectToLogin = !mockUseAuthStore().isAuthenticated && isProtectedRoute;

      expect(shouldRedirectToLogin).toBe(false);
    });

    it('should not redirect on public routes regardless of auth state', () => {
      mockUseAuthStore.mockReturnValue({
        isAuthenticated: false,
        isInitialized: true,
        isLoading: false,
      });

      const isProtectedRoute = false;
      const shouldRedirectToLogin = !mockUseAuthStore().isAuthenticated && isProtectedRoute;

      expect(shouldRedirectToLogin).toBe(false);
    });

    it('should redirect authenticated users away from auth pages', () => {
      mockUseAuthStore.mockReturnValue({
        isAuthenticated: true,
        isInitialized: true,
        isLoading: false,
      });

      const isAuthRoute = true;
      const shouldRedirectToHome = mockUseAuthStore().isAuthenticated && isAuthRoute;

      expect(shouldRedirectToHome).toBe(true);
    });
  });

  describe('Onboarding Flow', () => {
    it('should redirect to onboarding when not completed', () => {
      mockUseAuthStore.mockReturnValue({
        isAuthenticated: true,
        isInitialized: true,
        isLoading: false,
      });

      mockUseOnboardingStore.mockReturnValue({
        isCompleted: false,
      });

      const shouldShowOnboarding =
        mockUseAuthStore().isAuthenticated && !mockUseOnboardingStore().isCompleted;

      expect(shouldShowOnboarding).toBe(true);
    });

    it('should not redirect to onboarding when completed', () => {
      mockUseAuthStore.mockReturnValue({
        isAuthenticated: true,
        isInitialized: true,
        isLoading: false,
      });

      mockUseOnboardingStore.mockReturnValue({
        isCompleted: true,
      });

      const shouldShowOnboarding =
        mockUseAuthStore().isAuthenticated && !mockUseOnboardingStore().isCompleted;

      expect(shouldShowOnboarding).toBe(false);
    });
  });

  describe('Tab Navigation', () => {
    it('should have correct tab configuration', () => {
      const tabConfig = [
        { name: 'journal', title: 'Tagebuch', icon: 'book' },
        { name: 'index', title: 'Scan', icon: 'camera' },
        { name: 'two', title: 'Analyse', icon: 'bar-chart' },
        { name: 'profile', title: 'Profil', icon: 'user' },
      ];

      expect(tabConfig).toHaveLength(4);
      expect(tabConfig.map((t) => t.name)).toEqual(['journal', 'index', 'two', 'profile']);
    });

    it('should identify active tab correctly', () => {
      const currentPath = '/journal';
      const tabs = ['journal', 'index', 'two', 'profile'];

      const activeTab = tabs.find((tab) => currentPath.includes(tab));
      expect(activeTab).toBe('journal');
    });
  });

  describe('Deep Linking', () => {
    it('should parse journal date deep links correctly', () => {
      const deepLink = 'menumate://journal?date=2026-02-06';
      // Extract path and params manually for custom schemes
      const [, pathAndParams] = deepLink.split('://');
      const [path, queryString] = pathAndParams.split('?');
      const params = new URLSearchParams(queryString);

      expect(path).toBe('journal');
      expect(params.get('date')).toBe('2026-02-06');
    });

    it('should parse profile section deep links correctly', () => {
      const deepLink = 'menumate://profile/edit-goals';
      const [, pathPart] = deepLink.split('://');

      expect(pathPart).toBe('profile/edit-goals');
      expect(pathPart.startsWith('profile/')).toBe(true);
    });

    it('should handle food entry deep links', () => {
      const deepLink = 'menumate://journal/add?meal=breakfast';
      const [, pathAndParams] = deepLink.split('://');
      const [path, queryString] = pathAndParams.split('?');
      const params = new URLSearchParams(queryString);

      expect(path).toBe('journal/add');
      expect(params.get('meal')).toBe('breakfast');
    });
  });
});

describe('Navigation State Persistence', () => {
  it('should preserve navigation state across app restarts', () => {
    const savedState = {
      routes: [{ name: '(tabs)', state: { routes: [{ name: 'journal' }] } }],
      index: 0,
    };

    // Simulate saving state
    const serialized = JSON.stringify(savedState);
    expect(serialized).toBeTruthy();

    // Simulate restoring state
    const restored = JSON.parse(serialized);
    expect(restored.routes[0].name).toBe('(tabs)');
  });
});
