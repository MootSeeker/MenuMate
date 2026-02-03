/**
 * Supabase Client Configuration
 *
 * This module initializes the Supabase client with AsyncStorage
 * for session persistence across app restarts.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. ' +
      'Please create a .env file with EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY. ' +
      'See .env.example for reference.'
  );
}

/**
 * Supabase client instance configured with:
 * - AsyncStorage for session persistence
 * - Auto token refresh
 * - Session detection from URL (for OAuth flows)
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false, // Disable for React Native (no URL handling)
  },
});

/**
 * Test the Supabase connection
 * @returns Promise with connection status
 */
export async function testSupabaseConnection(): Promise<{
  success: boolean;
  message: string;
}> {
  try {
    const { data, error } = await supabase.auth.getSession();

    if (error) {
      return {
        success: false,
        message: `Auth error: ${error.message}`,
      };
    }

    return {
      success: true,
      message: data.session ? 'Connected with active session' : 'Connected (no active session)',
    };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    return {
      success: false,
      message: `Connection failed: ${errorMessage}`,
    };
  }
}
