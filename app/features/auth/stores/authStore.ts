/**
 * Auth Store
 *
 * Manages authentication state including user session,
 * login/logout actions, and session persistence.
 *
 * @see Issue #9 - [AUTH-001] Create Auth Store with State
 */

import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Session, User, AuthError } from '@supabase/supabase-js';

import { supabase } from '@/lib/supabase';

// ============================================
// TYPES
// ============================================

export interface AuthState {
  // State
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;

  // Computed
  isAuthenticated: boolean;

  // Actions
  initialize: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  clearError: () => void;

  // Internal
  setSession: (session: Session | null) => void;
  setLoading: (loading: boolean) => void;
}

// ============================================
// HELPERS
// ============================================

/**
 * Formats Supabase auth errors into user-friendly messages
 */
function formatAuthError(error: AuthError): string {
  const errorMessages: Record<string, string> = {
    'Invalid login credentials': 'Ungültige E-Mail oder Passwort',
    'Email not confirmed': 'Bitte bestätige zuerst deine E-Mail-Adresse',
    'User already registered': 'Diese E-Mail ist bereits registriert',
    'Password should be at least 6 characters': 'Das Passwort muss mindestens 6 Zeichen lang sein',
    'Unable to validate email address: invalid format': 'Bitte gib eine gültige E-Mail-Adresse ein',
    'Signup requires a valid password': 'Bitte gib ein gültiges Passwort ein',
  };

  return errorMessages[error.message] ?? error.message ?? 'Ein Fehler ist aufgetreten';
}

// ============================================
// STORE
// ============================================

export const useAuthStore = create<AuthState>()(
  persist(
    (set, _get) => ({
      // Initial state
      user: null,
      session: null,
      isLoading: true,
      isInitialized: false,
      error: null,
      isAuthenticated: false,

      /**
       * Initialize auth state from Supabase session
       * Should be called once on app start
       */
      initialize: async () => {
        try {
          set({ isLoading: true, error: null });

          // Get current session from Supabase
          const {
            data: { session },
            error,
          } = await supabase.auth.getSession();

          if (error) {
            console.error('Auth initialization error:', error);
            set({
              user: null,
              session: null,
              isAuthenticated: false,
              isLoading: false,
              isInitialized: true,
              error: formatAuthError(error),
            });
            return;
          }

          set({
            user: session?.user ?? null,
            session,
            isAuthenticated: !!session?.user,
            isLoading: false,
            isInitialized: true,
          });

          // Set up auth state change listener
          supabase.auth.onAuthStateChange((_event, session) => {
            set({
              user: session?.user ?? null,
              session,
              isAuthenticated: !!session?.user,
            });
          });
        } catch (err) {
          console.error('Auth initialization failed:', err);
          set({
            user: null,
            session: null,
            isAuthenticated: false,
            isLoading: false,
            isInitialized: true,
            error: 'Initialisierung fehlgeschlagen',
          });
        }
      },

      /**
       * Sign in with email and password
       */
      signIn: async (email: string, password: string) => {
        try {
          set({ isLoading: true, error: null });

          const { data, error } = await supabase.auth.signInWithPassword({
            email: email.trim().toLowerCase(),
            password,
          });

          if (error) {
            const errorMessage = formatAuthError(error);
            set({ isLoading: false, error: errorMessage });
            return { success: false, error: errorMessage };
          }

          set({
            user: data.user,
            session: data.session,
            isAuthenticated: true,
            isLoading: false,
          });

          return { success: true };
        } catch {
          const errorMessage = 'Anmeldung fehlgeschlagen';
          set({ isLoading: false, error: errorMessage });
          return { success: false, error: errorMessage };
        }
      },

      /**
       * Sign up with email and password
       */
      signUp: async (email: string, password: string) => {
        try {
          set({ isLoading: true, error: null });

          const { data, error } = await supabase.auth.signUp({
            email: email.trim().toLowerCase(),
            password,
          });

          if (error) {
            const errorMessage = formatAuthError(error);
            set({ isLoading: false, error: errorMessage });
            return { success: false, error: errorMessage };
          }

          // Check if email confirmation is required
          if (data.user && !data.session) {
            set({ isLoading: false });
            return {
              success: true,
              error: undefined,
            };
          }

          set({
            user: data.user,
            session: data.session,
            isAuthenticated: !!data.session,
            isLoading: false,
          });

          return { success: true };
        } catch {
          const errorMessage = 'Registrierung fehlgeschlagen';
          set({ isLoading: false, error: errorMessage });
          return { success: false, error: errorMessage };
        }
      },

      /**
       * Sign out the current user
       */
      signOut: async () => {
        try {
          set({ isLoading: true, error: null });

          const { error } = await supabase.auth.signOut();

          if (error) {
            console.error('Sign out error:', error);
          }

          set({
            user: null,
            session: null,
            isAuthenticated: false,
            isLoading: false,
          });
        } catch (err) {
          console.error('Sign out failed:', err);
          // Still clear local state even if server call fails
          set({
            user: null,
            session: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      },

      /**
       * Clear current error
       */
      clearError: () => set({ error: null }),

      /**
       * Set session (used by auth state change listener)
       */
      setSession: (session) =>
        set({
          session,
          user: session?.user ?? null,
          isAuthenticated: !!session?.user,
        }),

      /**
       * Set loading state
       */
      setLoading: (loading) => set({ isLoading: loading }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
      // Only persist these fields
      partialize: (state) => ({
        // We don't persist session/user - Supabase handles that
        // Just persist initialization flag to avoid redundant checks
        isInitialized: state.isInitialized,
      }),
    }
  )
);
