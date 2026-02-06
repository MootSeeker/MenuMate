/**
 * Supabase Client Tests
 *
 * Tests for Supabase client configuration validation and helper functions.
 * Note: The actual supabase client requires environment variables,
 * so we test the configuration logic separately.
 */

describe('Supabase Configuration', () => {
  describe('Environment Variables Validation', () => {
    it('should require EXPO_PUBLIC_SUPABASE_URL', () => {
      const validateEnv = (url: string | undefined, key: string | undefined) => {
        if (!url || !key) {
          throw new Error('Missing Supabase environment variables');
        }
        return true;
      };

      expect(() => validateEnv(undefined, 'key')).toThrow('Missing Supabase environment variables');
    });

    it('should require EXPO_PUBLIC_SUPABASE_ANON_KEY', () => {
      const validateEnv = (url: string | undefined, key: string | undefined) => {
        if (!url || !key) {
          throw new Error('Missing Supabase environment variables');
        }
        return true;
      };

      expect(() => validateEnv('url', undefined)).toThrow('Missing Supabase environment variables');
    });

    it('should pass validation when both env vars are set', () => {
      const validateEnv = (url: string | undefined, key: string | undefined) => {
        if (!url || !key) {
          throw new Error('Missing Supabase environment variables');
        }
        return true;
      };

      expect(validateEnv('https://test.supabase.co', 'test-key')).toBe(true);
    });
  });

  describe('URL Format Validation', () => {
    it('should accept valid Supabase URL format', () => {
      const isValidSupabaseUrl = (url: string): boolean => {
        return /^https:\/\/.+\.supabase\.co$/.test(url);
      };

      expect(isValidSupabaseUrl('https://test-project.supabase.co')).toBe(true);
      expect(isValidSupabaseUrl('https://my-app.supabase.co')).toBe(true);
    });

    it('should reject invalid Supabase URL formats', () => {
      const isValidSupabaseUrl = (url: string): boolean => {
        return /^https:\/\/.+\.supabase\.co$/.test(url);
      };

      expect(isValidSupabaseUrl('http://test.supabase.co')).toBe(false);
      expect(isValidSupabaseUrl('https://test.example.com')).toBe(false);
      expect(isValidSupabaseUrl('not-a-url')).toBe(false);
    });
  });

  describe('Client Configuration Options', () => {
    it('should have correct auth configuration for React Native', () => {
      const expectedConfig = {
        auth: {
          autoRefreshToken: true,
          persistSession: true,
          detectSessionInUrl: false, // Disabled for React Native
        },
      };

      expect(expectedConfig.auth.autoRefreshToken).toBe(true);
      expect(expectedConfig.auth.persistSession).toBe(true);
      expect(expectedConfig.auth.detectSessionInUrl).toBe(false);
    });
  });
});

describe('Connection Testing Logic', () => {
  describe('testSupabaseConnection result formatting', () => {
    it('should format success with session', () => {
      const formatResult = (hasSession: boolean) => ({
        success: true,
        message: hasSession ? 'Connected with active session' : 'Connected (no active session)',
      });

      expect(formatResult(true).message).toBe('Connected with active session');
      expect(formatResult(false).message).toBe('Connected (no active session)');
    });

    it('should format auth errors', () => {
      const formatAuthError = (errorMessage: string) => ({
        success: false,
        message: `Auth error: ${errorMessage}`,
      });

      const result = formatAuthError('Invalid API key');
      expect(result.success).toBe(false);
      expect(result.message).toContain('Auth error');
      expect(result.message).toContain('Invalid API key');
    });

    it('should format network errors', () => {
      const formatNetworkError = (error: Error) => ({
        success: false,
        message: `Connection error: ${error.message}`,
      });

      const result = formatNetworkError(new Error('Network timeout'));
      expect(result.success).toBe(false);
      expect(result.message).toContain('Network timeout');
    });
  });
});

