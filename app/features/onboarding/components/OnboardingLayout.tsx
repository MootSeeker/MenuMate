/**
 * Onboarding Layout Component
 *
 * Provides consistent layout structure for all onboarding screens
 * including progress indicator, scrollable content, and navigation buttons.
 */

import { View, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/ui';

import { OnboardingProgress } from './OnboardingProgress';
import type { OnboardingStep } from '../stores';

// ============================================
// TYPES
// ============================================

interface OnboardingLayoutProps {
  currentStep: OnboardingStep;
  children: React.ReactNode;
  onNext?: () => void;
  onBack?: () => void;
  nextLabel?: string;
  nextDisabled?: boolean;
  nextLoading?: boolean;
  showBack?: boolean;
  className?: string;
}

// ============================================
// COMPONENT
// ============================================

export function OnboardingLayout({
  currentStep,
  children,
  onNext,
  onBack,
  nextLabel = 'Weiter',
  nextDisabled = false,
  nextLoading = false,
  showBack = true,
  className = '',
}: OnboardingLayoutProps) {
  return (
    <SafeAreaView className="bg-background-light dark:bg-background-dark flex-1">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        {/* Progress Indicator */}
        <View className="px-6 pt-4">
          <OnboardingProgress currentStep={currentStep} />
        </View>

        {/* Scrollable Content */}
        <ScrollView
          className={`flex-1 px-6 ${className}`}
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {children}
        </ScrollView>

        {/* Navigation Buttons */}
        <View className="flex-row gap-3 px-6 pb-6 pt-4">
          {showBack && currentStep > 1 && (
            <Button variant="outline" onPress={onBack} className="flex-1">
              Zurück
            </Button>
          )}

          {onNext && (
            <Button
              variant="primary"
              onPress={onNext}
              disabled={nextDisabled}
              loading={nextLoading}
              className={showBack && currentStep > 1 ? 'flex-1' : 'flex-1'}
            >
              {nextLabel}
            </Button>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
