/**
 * Step 3: Activity Level Screen
 *
 * User selects their daily activity level which is used
 * for TDEE (Total Daily Energy Expenditure) calculation.
 *
 * @see Issue #19 - [ONBOARD-001-C] Onboarding Step 3: Activity Level
 */

import { useCallback } from 'react';
import { View, Pressable } from 'react-native';
import { useRouter } from 'expo-router';

import { Text, Card } from '@/components/ui';
import { ACTIVITY_MULTIPLIERS, type ActivityLevel } from '@/features/user/utils';

import { OnboardingLayout } from '../components';
import { useOnboardingStore } from '../stores';

// ============================================
// TYPES
// ============================================

interface ActivityOption {
  level: ActivityLevel;
  name: string;
  description: string;
  icon: string;
  examples: string;
  factor: number;
}

// ============================================
// CONSTANTS
// ============================================

const ACTIVITY_OPTIONS: ActivityOption[] = [
  {
    level: 'sedentary',
    name: 'Kaum aktiv',
    description: 'Wenig bis keine Bewegung',
    icon: '🪑',
    examples: 'Bürojob, viel Sitzen',
    factor: ACTIVITY_MULTIPLIERS.sedentary,
  },
  {
    level: 'lightly_active',
    name: 'Leicht aktiv',
    description: 'Leichte Aktivität 1-3x/Woche',
    icon: '🚶',
    examples: 'Spaziergänge, leichtes Training',
    factor: ACTIVITY_MULTIPLIERS.lightly_active,
  },
  {
    level: 'moderately_active',
    name: 'Moderat aktiv',
    description: 'Moderate Aktivität 3-5x/Woche',
    icon: '🏃',
    examples: 'Joggen, Fitness, Radfahren',
    factor: ACTIVITY_MULTIPLIERS.moderately_active,
  },
  {
    level: 'very_active',
    name: 'Sehr aktiv',
    description: 'Intensives Training 6-7x/Woche',
    icon: '💪',
    examples: 'Kraftsport, Mannschaftssport',
    factor: ACTIVITY_MULTIPLIERS.very_active,
  },
  {
    level: 'extremely_active',
    name: 'Extrem aktiv',
    description: 'Sehr intensiv, körperliche Arbeit',
    icon: '🔥',
    examples: 'Leistungssport, Bauarbeiter',
    factor: ACTIVITY_MULTIPLIERS.extremely_active,
  },
];

// ============================================
// COMPONENT
// ============================================

export function Step3ActivityScreen() {
  const router = useRouter();
  const { data, setActivityLevel, nextStep, prevStep } = useOnboardingStore();

  // Handle activity selection
  const handleSelectActivity = useCallback(
    (level: ActivityLevel) => {
      setActivityLevel(level);
    },
    [setActivityLevel]
  );

  // Handle next button
  const handleNext = useCallback(() => {
    if (data.activityLevel) {
      nextStep();
      router.push('/onboarding/step4');
    }
  }, [data.activityLevel, nextStep, router]);

  // Handle back button
  const handleBack = useCallback(() => {
    prevStep();
    router.back();
  }, [prevStep, router]);

  return (
    <OnboardingLayout
      currentStep={3}
      onNext={handleNext}
      onBack={handleBack}
      nextDisabled={!data.activityLevel}
    >
      <View className="flex-1 py-4">
        {/* Title */}
        <Text variant="heading-2" className="mb-2 text-center">
          Wie aktiv bist du?
        </Text>
        <Text variant="body-md" color="secondary" className="mb-6 text-center">
          Wähle das Level, das am besten zu deinem Alltag passt.
        </Text>

        {/* Activity Options */}
        <View className="gap-3">
          {ACTIVITY_OPTIONS.map((option) => {
            const isSelected = data.activityLevel === option.level;

            return (
              <Pressable
                key={option.level}
                onPress={() => handleSelectActivity(option.level)}
                accessibilityRole="radio"
                accessibilityState={{ selected: isSelected }}
                accessibilityLabel={`${option.name}: ${option.description}`}
              >
                <Card
                  variant={isSelected ? 'elevated' : 'outlined'}
                  padding="md"
                  className={`${
                    isSelected
                      ? 'border-2 border-primary-500 bg-primary-50 dark:bg-primary-950'
                      : 'border border-neutral-200 dark:border-neutral-700'
                  }`}
                >
                  <View className="flex-row items-center">
                    {/* Icon */}
                    <View
                      className={`mr-4 h-12 w-12 items-center justify-center rounded-full ${
                        isSelected
                          ? 'bg-primary-100 dark:bg-primary-900'
                          : 'bg-neutral-100 dark:bg-neutral-800'
                      }`}
                    >
                      <Text variant="heading-3">{option.icon}</Text>
                    </View>

                    {/* Text Content */}
                    <View className="flex-1">
                      <View className="flex-row items-center justify-between">
                        <Text
                          variant="body-lg"
                          className={`font-semibold ${
                            isSelected ? 'text-primary-700 dark:text-primary-300' : ''
                          }`}
                        >
                          {option.name}
                        </Text>

                        {/* Selection Indicator */}
                        <View
                          className={`h-5 w-5 items-center justify-center rounded-full border-2 ${
                            isSelected
                              ? 'border-primary-500 bg-primary-500'
                              : 'border-neutral-300 dark:border-neutral-600'
                          }`}
                        >
                          {isSelected && <View className="h-2 w-2 rounded-full bg-white" />}
                        </View>
                      </View>

                      <Text variant="body-sm" color="secondary" className="mt-0.5">
                        {option.description}
                      </Text>

                      <Text variant="caption" color="tertiary" className="mt-1">
                        z.B. {option.examples}
                      </Text>
                    </View>
                  </View>
                </Card>
              </Pressable>
            );
          })}
        </View>

        {/* Info Card */}
        <Card variant="flat" padding="md" className="mt-6">
          <Text variant="body-sm" color="secondary">
            💡 <Text variant="body-sm">Tipp:</Text> Wähle im Zweifel lieber ein niedrigeres Level.
            Du kannst es später in den Einstellungen anpassen.
          </Text>
        </Card>
      </View>
    </OnboardingLayout>
  );
}
