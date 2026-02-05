/**
 * Auth Store Tests
 *
 * Tests for the authentication store including sign in, sign up, and sign out.
 */

import { act, renderHook } from '@testing-library/react-native';
import { useAuthStore } from '../authStore';

// Mock Supabase
const mockGetSession = jest.fn();
const mockSignInWithPassword = jest.fn();
const mockSignUp = jest.fn();
const mockSignOut = jest.fn();
const mockOnAuthStateChange = jest.fn(() => ({
  data: { subscription: { unsubscribe: jest.fn() } },
}));

jest.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      getSession: () => mockGetSession(),
      signInWithPassword: (params: { email: string; password: string }) =>
        mockSignInWithPassword(params),
      signUp: (params: { email: string; password: string }) => mockSignUp(params),
      signOut: () => mockSignOut(),
      onAuthStateChange: (callback: unknown) => mockOnAuthStateChange(callback),
    },
  },
}));

describe('useAuthStore', () => {
  beforeEach(() => {
    // Reset store state
    useAuthStore.setState({
      user: null,
      session: null,
      isLoading: true,
      isInitialized: false,
      error: null,
      isAuthenticated: false,
    });

    // Reset mocks
    jest.clearAllMocks();
  });

  describe('initial state', () => {
    it('should have correct initial values', () => {
      const { result } = renderHook(() => useAuthStore());

      expect(result.current.user).toBeNull();
      expect(result.current.session).toBeNull();
      expect(result.current.isLoading).toBe(true);
      expect(result.current.isInitialized).toBe(false);
      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.error).toBeNull();
    });
  });

  describe('initialize', () => {
    it('should set authenticated state when session exists', async () => {
      const mockSession = {
        user: { id: 'test-user-id', email: 'test@example.com' },
        access_token: 'test-token',
      };

      mockGetSession.mockResolvedValueOnce({
        data: { session: mockSession },
        error: null,
      });

      const { result } = renderHook(() => useAuthStore());

      await act(async () => {
        await result.current.initialize();
      });

      expect(result.current.isInitialized).toBe(true);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.session).toEqual(mockSession);
    });

    it('should set unauthenticated state when no session exists', async () => {
      mockGetSession.mockResolvedValueOnce({
        data: { session: null },
        error: null,
      });

      const { result } = renderHook(() => useAuthStore());

      await act(async () => {
        await result.current.initialize();
      });

      expect(result.current.isInitialized).toBe(true);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.session).toBeNull();
    });

    it('should handle initialization errors', async () => {
      mockGetSession.mockResolvedValueOnce({
        data: { session: null },
        error: { message: 'Network error' },
      });

      const { result } = renderHook(() => useAuthStore());

      await act(async () => {
        await result.current.initialize();
      });

      expect(result.current.isInitialized).toBe(true);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.error).toBeTruthy();
    });
  });

  describe('signIn', () => {
    it('should sign in successfully with valid credentials', async () => {
      const mockUser = { id: 'test-user-id', email: 'test@example.com' };
      const mockSession = { user: mockUser, access_token: 'test-token' };

      mockSignInWithPassword.mockResolvedValueOnce({
        data: { user: mockUser, session: mockSession },
        error: null,
      });

      const { result } = renderHook(() => useAuthStore());

      let signInResult;
      await act(async () => {
        signInResult = await result.current.signIn('test@example.com', 'password123');
      });

      expect(signInResult).toEqual({ success: true });
      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.user).toEqual(mockUser);
      expect(result.current.isLoading).toBe(false);
    });

    it('should handle invalid credentials', async () => {
      mockSignInWithPassword.mockResolvedValueOnce({
        data: { user: null, session: null },
        error: { message: 'Invalid login credentials' },
      });

      const { result } = renderHook(() => useAuthStore());

      let signInResult;
      await act(async () => {
        signInResult = await result.current.signIn('test@example.com', 'wrongpassword');
      });

      expect(signInResult?.success).toBe(false);
      expect(signInResult?.error).toBe('Ungültige E-Mail oder Passwort');
      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.error).toBe('Ungültige E-Mail oder Passwort');
    });

    it('should normalize email to lowercase', async () => {
      mockSignInWithPassword.mockResolvedValueOnce({
        data: { user: { id: '1' }, session: { access_token: 'token' } },
        error: null,
      });

      const { result } = renderHook(() => useAuthStore());

      await act(async () => {
        await result.current.signIn('TEST@EXAMPLE.COM', 'password');
      });

      expect(mockSignInWithPassword).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password',
      });
    });
  });

  describe('signUp', () => {
    it('should sign up successfully', async () => {
      const mockUser = { id: 'new-user-id', email: 'new@example.com' };
      const mockSession = { user: mockUser, access_token: 'new-token' };

      mockSignUp.mockResolvedValueOnce({
        data: { user: mockUser, session: mockSession },
        error: null,
      });

      const { result } = renderHook(() => useAuthStore());

      let signUpResult;
      await act(async () => {
        signUpResult = await result.current.signUp('new@example.com', 'password123');
      });

      expect(signUpResult).toEqual({ success: true });
      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.user).toEqual(mockUser);
    });

    it('should handle already registered email', async () => {
      mockSignUp.mockResolvedValueOnce({
        data: { user: null, session: null },
        error: { message: 'User already registered' },
      });

      const { result } = renderHook(() => useAuthStore());

      let signUpResult;
      await act(async () => {
        signUpResult = await result.current.signUp('existing@example.com', 'password123');
      });

      expect(signUpResult?.success).toBe(false);
      expect(signUpResult?.error).toBe('Diese E-Mail ist bereits registriert');
    });

    it('should handle email confirmation required', async () => {
      const mockUser = { id: 'new-user-id', email: 'new@example.com' };

      mockSignUp.mockResolvedValueOnce({
        data: { user: mockUser, session: null }, // No session means confirmation required
        error: null,
      });

      const { result } = renderHook(() => useAuthStore());

      let signUpResult;
      await act(async () => {
        signUpResult = await result.current.signUp('new@example.com', 'password123');
      });

      expect(signUpResult).toEqual({ success: true, error: undefined });
      expect(result.current.isAuthenticated).toBe(false); // Not authenticated until confirmed
    });
  });

  describe('signOut', () => {
    it('should sign out successfully', async () => {
      // Set up authenticated state
      useAuthStore.setState({
        user: { id: 'test-user-id' } as never,
        session: { access_token: 'token' } as never,
        isAuthenticated: true,
      });

      mockSignOut.mockResolvedValueOnce({ error: null });

      const { result } = renderHook(() => useAuthStore());

      await act(async () => {
        await result.current.signOut();
      });

      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.user).toBeNull();
      expect(result.current.session).toBeNull();
    });

    it('should clear local state even if server call fails', async () => {
      useAuthStore.setState({
        user: { id: 'test-user-id' } as never,
        session: { access_token: 'token' } as never,
        isAuthenticated: true,
      });

      mockSignOut.mockResolvedValueOnce({ error: { message: 'Network error' } });

      const { result } = renderHook(() => useAuthStore());

      await act(async () => {
        await result.current.signOut();
      });

      // Should still clear local state
      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.user).toBeNull();
    });
  });

  describe('clearError', () => {
    it('should clear the error state', () => {
      useAuthStore.setState({ error: 'Some error' });

      const { result } = renderHook(() => useAuthStore());

      act(() => {
        result.current.clearError();
      });

      expect(result.current.error).toBeNull();
    });
  });
});
