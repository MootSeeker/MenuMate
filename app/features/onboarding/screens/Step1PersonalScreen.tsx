/**
 * Step 1: Personal Data Screen
 *
 * Captures gender and birth date from the user.
 * First step of the onboarding flow.
 *
 * @see Issue #17 - [ONBOARD-001-A] Onboarding Step 1: Personal Data
 */

import { useCallback, useState } from 'react';
import { View, Pressable, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';

import { Text, Card, Button } from '@/components/ui';
import type { Gender } from '@/features/user/utils';

import { OnboardingLayout } from '../components';
import { useOnboardingStore } from '../stores';

// ============================================
// TYPES
// ============================================

interface GenderOption {
  value: Gender;
  label: string;
  icon: string;
}

// ============================================
// CONSTANTS
// ============================================

const GENDER_OPTIONS: GenderOption[] = [
  { value: 'male', label: 'Männlich', icon: '♂️' },
  { value: 'female', label: 'Weiblich', icon: '♀️' },
  { value: 'diverse', label: 'Divers', icon: '⚧️' },
];

const MIN_AGE = 13;
const MAX_AGE = 120;

// ============================================
// HELPERS
// ============================================

/**
 * Calculate age from birth date
 */
function calculateAge(birthDate: Date): number {
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

/**
 * Validate birth date
 */
function validateBirthDate(date: Date): { valid: boolean; error?: string } {
  const age = calculateAge(date);

  if (age < MIN_AGE) {
    return { valid: false, error: `Du musst mindestens ${MIN_AGE} Jahre alt sein` };
  }

  if (age > MAX_AGE) {
    return { valid: false, error: 'Bitte gib ein gültiges Geburtsdatum ein' };
  }

  return { valid: true };
}

/**
 * Format date for display
 */
function formatDate(date: Date): string {
  return date.toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

// ============================================
// COMPONENT
// ============================================

export function Step1PersonalScreen() {
  const router = useRouter();
  const { data, setGender, setBirthDate, nextStep } = useOnboardingStore();

  // Local state
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dateError, setDateError] = useState<string | null>(null);
  const [genderError, setGenderError] = useState<string | null>(null);

  // Default date for picker (18 years ago)
  const defaultDate = new Date();
  defaultDate.setFullYear(defaultDate.getFullYear() - 25);

  // Get current birth date or default
  const currentBirthDate = data.birthDate ? new Date(data.birthDate) : defaultDate;

  // Calculate min/max dates
  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() - MIN_AGE);

  const minDate = new Date();
  minDate.setFullYear(minDate.getFullYear() - MAX_AGE);

  // Handle gender selection
  const handleSelectGender = useCallback(
    (gender: Gender) => {
      setGender(gender);
      setGenderError(null);
    },
    [setGender]
  );

  // Handle date change
  const handleDateChange = useCallback(
    (_event: DateTimePickerEvent, selectedDate?: Date) => {
      // On Android, picker is dismissed automatically
      if (Platform.OS === 'android') {
        setShowDatePicker(false);
      }

      if (selectedDate) {
        const validation = validateBirthDate(selectedDate);
        if (validation.valid) {
          setBirthDate(selectedDate);
          setDateError(null);
        } else {
          setDateError(validation.error ?? null);
        }
      }
    },
    [setBirthDate]
  );

  // Handle iOS date picker confirm
  const handleConfirmDate = useCallback(() => {
    setShowDatePicker(false);
  }, []);

  // Handle next button
  const handleNext = useCallback(() => {
    let hasError = false;

    if (!data.gender) {
      setGenderError('Bitte wähle dein Geschlecht');
      hasError = true;
    }

    if (!data.birthDate) {
      setDateError('Bitte gib dein Geburtsdatum ein');
      hasError = true;
    } else {
      const validation = validateBirthDate(new Date(data.birthDate));
      if (!validation.valid) {
        setDateError(validation.error ?? null);
        hasError = true;
      }
    }

    if (!hasError) {
      nextStep();
      router.push('/onboarding/step2');
    }
  }, [data.gender, data.birthDate, nextStep, router]);

  // Check if can proceed
  const canProceed = !!data.gender && !!data.birthDate && !dateError;

  // Calculate displayed age
  const displayedAge = data.birthDate ? calculateAge(new Date(data.birthDate)) : null;

  return (
    <OnboardingLayout currentStep={1} onNext={handleNext} nextDisabled={!canProceed} showBack={false}>
      <View className="flex-1 py-4">
        {/* Title */}
        <Text variant="heading-2" className="mb-2 text-center">
          Persönliche Daten
        </Text>
        <Text variant="body-md" color="secondary" className="mb-8 text-center">
          Diese Informationen helfen uns, deinen Kalorienbedarf zu berechnen.
        </Text>

        {/* Gender Selection */}
        <View className="mb-6">
          <Text variant="label-lg" className="mb-3">
            Geschlecht
          </Text>
          <View className="flex-row gap-3">
            {GENDER_OPTIONS.map((option) => {
              const isSelected = data.gender === option.value;

              return (
                <Pressable
                  key={option.value}
                  onPress={() => handleSelectGender(option.value)}
                  accessibilityRole="radio"
                  accessibilityState={{ selected: isSelected }}
                  accessibilityLabel={option.label}
                  className="flex-1"
                >
                  <Card
                    variant={isSelected ? 'elevated' : 'outlined'}
                    padding="md"
                    className={`items-center ${
                      isSelected
                        ? 'border-2 border-primary-500 bg-primary-50 dark:bg-primary-950'
                        : 'border border-neutral-200 dark:border-neutral-700'
                    }`}
                  >
                    <Text className="mb-1 text-2xl">{option.icon}</Text>
                    <Text
                      variant="body-sm"
                      weight={isSelected ? 'semibold' : 'regular'}
                      className={isSelected ? 'text-primary-600 dark:text-primary-400' : ''}
                    >
                      {option.label}
                    </Text>
                  </Card>
                </Pressable>
              );
            })}
          </View>
          {genderError && (
            <Text variant="body-sm" className="mt-2 text-error-600 dark:text-error-400">
              {genderError}
            </Text>
          )}
        </View>

        {/* Birth Date Selection */}
        <View className="mb-6">
          <Text variant="label-lg" className="mb-3">
            Geburtsdatum
          </Text>

          <Pressable onPress={() => setShowDatePicker(true)}>
            <Card
              variant="outlined"
              padding="md"
              className={`${dateError ? 'border-error-500' : 'border-neutral-200 dark:border-neutral-700'}`}
            >
              <View className="flex-row items-center justify-between">
                <View>
                  <Text variant="body-md">
                    {data.birthDate ? formatDate(new Date(data.birthDate)) : 'Datum auswählen...'}
                  </Text>
                  {displayedAge !== null && (
                    <Text variant="body-sm" color="secondary">
                      {displayedAge} Jahre alt
                    </Text>
                  )}
                </View>
                <Text className="text-xl">📅</Text>
              </View>
            </Card>
          </Pressable>

          {dateError && (
            <Text variant="body-sm" className="mt-2 text-error-600 dark:text-error-400">
              {dateError}
            </Text>
          )}
        </View>

        {/* Date Picker Modal (iOS) / Inline (Android) */}
        {showDatePicker && (
          <View>
            {Platform.OS === 'ios' && (
              <View className="mb-4 flex-row justify-end">
                <Button variant="primary" size="sm" onPress={handleConfirmDate}>
                  Fertig
                </Button>
              </View>
            )}
            <DateTimePicker
              value={currentBirthDate}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={handleDateChange}
              maximumDate={maxDate}
              minimumDate={minDate}
              locale="de-DE"
            />
          </View>
        )}

        {/* Info Box */}
        <View className="mt-auto rounded-lg bg-neutral-100 p-4 dark:bg-neutral-800">
          <Text variant="body-sm" color="secondary">
            ℹ️ Deine Daten werden nur zur Berechnung deines persönlichen Kalorienbedarfs verwendet
            und vertraulich behandelt.
          </Text>
        </View>
      </View>
    </OnboardingLayout>
  );
}
