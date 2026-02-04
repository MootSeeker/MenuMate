/**
 * Profile Service
 *
 * Handles saving user profile data to Supabase after onboarding completion.
 * Includes error handling and retry mechanism.
 *
 * @see Issue #22 - [ONBOARD-003] Save Profile to Database
 */

import { supabase } from '@/lib/supabase';
import type { ActivityLevel, Gender, Goal } from '@/features/user/utils';

// ============================================
// TYPES
// ============================================

export interface OnboardingProfileData {
  gender: Gender | null;
  birthDate: Date | null;
  heightCm: number | null;
  weightKg: number | null;
  activityLevel: ActivityLevel | null;
  goal: Goal | null;
  calculatedTDEE: number | null;
  dailyCalorieGoal: number | null;
}

/** Validated profile data with all required fields non-null */
export interface ValidatedProfileData {
  gender: Gender;
  birthDate: Date;
  heightCm: number;
  weightKg: number;
  activityLevel: ActivityLevel;
  goal: Goal;
  calculatedTDEE: number;
  dailyCalorieGoal: number;
}

export interface ProfileRecord {
  id?: string;
  user_id: string;
  gender: Gender;
  birth_date: string;
  height_cm: number;
  weight_kg: number;
  activity_level: ActivityLevel;
  goal: Goal;
  tdee: number;
  daily_calorie_goal: number;
  onboarding_completed: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface SaveProfileResult {
  success: boolean;
  error?: string;
  profile?: ProfileRecord;
}

// ============================================
// CONSTANTS
// ============================================

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1000;

// ============================================
// HELPERS
// ============================================

/**
 * Delay helper for retry mechanism
 */
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Validates that all required onboarding data is present
 * Returns validated data or error message
 */
function validateOnboardingData(
  data: OnboardingProfileData
): { valid: true; data: ValidatedProfileData } | { valid: false; error: string } {
  if (!data.gender) return { valid: false, error: 'Geschlecht fehlt' };
  if (!data.birthDate) return { valid: false, error: 'Geburtsdatum fehlt' };
  if (!data.heightCm) return { valid: false, error: 'Größe fehlt' };
  if (!data.weightKg) return { valid: false, error: 'Gewicht fehlt' };
  if (!data.activityLevel) return { valid: false, error: 'Aktivitätslevel fehlt' };
  if (!data.goal) return { valid: false, error: 'Ziel fehlt' };
  if (!data.calculatedTDEE) return { valid: false, error: 'TDEE Berechnung fehlt' };
  if (!data.dailyCalorieGoal) return { valid: false, error: 'Kalorienziel fehlt' };

  return {
    valid: true,
    data: {
      gender: data.gender,
      birthDate: data.birthDate,
      heightCm: data.heightCm,
      weightKg: data.weightKg,
      activityLevel: data.activityLevel,
      goal: data.goal,
      calculatedTDEE: data.calculatedTDEE,
      dailyCalorieGoal: data.dailyCalorieGoal,
    },
  };
}

// ============================================
// MAIN FUNCTION
// ============================================

/**
 * Saves the onboarding profile data to Supabase
 *
 * @param data - The collected onboarding data
 * @param retryCount - Current retry attempt (internal use)
 * @returns Promise with save result
 */
export async function saveOnboardingProfile(
  data: OnboardingProfileData,
  retryCount = 0
): Promise<SaveProfileResult> {
  // Validate data
  const validation = validateOnboardingData(data);
  if (!validation.valid) {
    return {
      success: false,
      error: validation.error,
    };
  }

  const validData = validation.data;

  try {
    // Get current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return {
        success: false,
        error: 'Nicht eingeloggt. Bitte melde dich erneut an.',
      };
    }

    // Prepare profile record
    const profileRecord: Omit<ProfileRecord, 'id' | 'created_at' | 'updated_at'> = {
      user_id: user.id,
      gender: validData.gender,
      birth_date: validData.birthDate.toISOString().split('T')[0], // YYYY-MM-DD format
      height_cm: validData.heightCm,
      weight_kg: validData.weightKg,
      activity_level: validData.activityLevel,
      goal: validData.goal,
      tdee: Math.round(validData.calculatedTDEE),
      daily_calorie_goal: Math.round(validData.dailyCalorieGoal),
      onboarding_completed: true,
    };

    // Upsert profile (insert or update if exists)
    const { data: savedProfile, error: saveError } = await supabase
      .from('profiles')
      .upsert(profileRecord, {
        onConflict: 'user_id',
      })
      .select()
      .single();

    if (saveError) {
      throw saveError;
    }

    return {
      success: true,
      profile: savedProfile as ProfileRecord,
    };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unbekannter Fehler';

    // Retry on network errors
    if (retryCount < MAX_RETRIES) {
      const isNetworkError =
        errorMessage.includes('network') ||
        errorMessage.includes('timeout') ||
        errorMessage.includes('Failed to fetch');

      if (isNetworkError) {
        await delay(RETRY_DELAY_MS * (retryCount + 1)); // Exponential backoff
        return saveOnboardingProfile(data, retryCount + 1);
      }
    }

    return {
      success: false,
      error: `Speichern fehlgeschlagen: ${errorMessage}`,
    };
  }
}

/**
 * Checks if the current user has completed onboarding
 *
 * @returns Promise with onboarding status
 */
export async function checkOnboardingStatus(): Promise<{
  completed: boolean;
  error?: string;
}> {
  try {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return { completed: false, error: 'Nicht eingeloggt' };
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('onboarding_completed')
      .eq('user_id', user.id)
      .single();

    if (profileError) {
      // No profile means onboarding not completed
      if (profileError.code === 'PGRST116') {
        return { completed: false };
      }
      throw profileError;
    }

    return { completed: profile?.onboarding_completed ?? false };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unbekannter Fehler';
    return { completed: false, error: errorMessage };
  }
}

/**
 * Fetches the current user's profile
 *
 * @returns Promise with profile data or error
 */
export async function fetchUserProfile(): Promise<{
  profile: ProfileRecord | null;
  error?: string;
}> {
  try {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return { profile: null, error: 'Nicht eingeloggt' };
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (profileError) {
      if (profileError.code === 'PGRST116') {
        return { profile: null }; // No profile found
      }
      throw profileError;
    }

    return { profile: profile as ProfileRecord };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unbekannter Fehler';
    return { profile: null, error: errorMessage };
  }
}
