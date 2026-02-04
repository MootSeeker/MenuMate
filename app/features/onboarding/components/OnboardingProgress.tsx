/**
 * Onboarding Progress Indicator
 *
 * Displays the current step in the onboarding flow
 * with visual feedback for completed and active steps.
 */

import { View } from 'react-native';

import { Text } from '@/components/ui';

import type { OnboardingStep } from '../stores';

// ============================================
// TYPES
// ============================================

interface OnboardingProgressProps {
  currentStep: OnboardingStep;
  totalSteps?: number;
  className?: string;
}

// ============================================
// CONSTANTS
// ============================================

const STEP_LABELS: Record<OnboardingStep, string> = {
  1: 'Persönliche Daten',
  2: 'Körperdaten',
  3: 'Aktivitätslevel',
  4: 'Dein Ziel',
};

// ============================================
// COMPONENT
// ============================================

export function OnboardingProgress({
  currentStep,
  totalSteps = 4,
  className = '',
}: OnboardingProgressProps) {
  return (
    <View className={`mb-6 ${className}`}>
      {/* Step Counter */}
      <Text variant="caption" color="tertiary" className="mb-2 text-center">
        Schritt {currentStep} von {totalSteps}
      </Text>

      {/* Progress Dots */}
      <View className="flex-row items-center justify-center gap-2">
        {Array.from({ length: totalSteps }, (_, i) => {
          const step = (i + 1) as OnboardingStep;
          const isCompleted = step < currentStep;
          const isActive = step === currentStep;

          return (
            <View
              key={step}
              className={`h-2 rounded-full transition-all ${
                isCompleted
                  ? 'w-8 bg-primary-500'
                  : isActive
                    ? 'w-8 bg-primary-400'
                    : 'w-2 bg-neutral-300 dark:bg-neutral-600'
              }`}
            />
          );
        })}
      </View>

      {/* Current Step Label */}
      <Text variant="label" color="primary" className="mt-3 text-center">
        {STEP_LABELS[currentStep]}
      </Text>
    </View>
  );
}
