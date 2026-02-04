/**
 * Step 4: Goal Selection Screen
 *
 * User selects their diet/fitness goal and sees calculated calorie recommendations.
 * This is the final step of onboarding - completing it saves the profile.
 *
 * @see Issue #20 - [ONBOARD-001-D] Onboarding Step 4: Select Goal
 */

import { useCallback, useState, useMemo } from 'react';
import { View, Pressable } from 'react-native';
import { useRouter } from 'expo-router';

import { Text, Card, Badge, ProgressRing, Input, Modal, Button } from '@/components/ui';
import {
  calculateAllCalories,
  calculateMacros,
  GOAL_ADJUSTMENTS,
  type Goal,
} from '@/features/user/utils';

import { OnboardingLayout } from '../components';
import { useOnboardingStore } from '../stores';
import { saveOnboardingProfile } from '../services/profileService';

// ============================================
// TYPES
// ============================================

interface GoalOption {
  goal: Goal;
  name: string;
  description: string;
  icon: string;
  adjustment: number;
  color: 'info' | 'success' | 'warning';
}

// ============================================
// CONSTANTS
// ============================================

const GOAL_OPTIONS: GoalOption[] = [
  {
    goal: 'lose',
    name: 'Abnehmen',
    description: 'Gewicht verlieren',
    icon: '📉',
    adjustment: GOAL_ADJUSTMENTS.lose,
    color: 'info',
  },
  {
    goal: 'maintain',
    name: 'Halten',
    description: 'Gewicht halten',
    icon: '⚖️',
    adjustment: GOAL_ADJUSTMENTS.maintain,
    color: 'success',
  },
  {
    goal: 'gain',
    name: 'Aufbauen',
    description: 'Muskeln aufbauen',
    icon: '💪',
    adjustment: GOAL_ADJUSTMENTS.gain,
    color: 'warning',
  },
];

// ============================================
// COMPONENT
// ============================================

export function Step4GoalScreen() {
  const router = useRouter();
  const { data, setGoal, setCalculatedValues, completeOnboarding, prevStep } = useOnboardingStore();

  // Local state
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAdjustModal, setShowAdjustModal] = useState(false);
  const [customCalories, setCustomCalories] = useState('');

  // Calculate TDEE based on collected data
  const calculations = useMemo(() => {
    if (
      !data.gender ||
      !data.birthDate ||
      !data.heightCm ||
      !data.weightKg ||
      !data.activityLevel
    ) {
      return null;
    }

    // Calculate age from birth date
    const today = new Date();
    const birth = new Date(data.birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }

    try {
      return calculateAllCalories({
        weightKg: data.weightKg,
        heightCm: data.heightCm,
        age,
        gender: data.gender,
        activityLevel: data.activityLevel,
        goal: data.goal ?? 'maintain',
      });
    } catch {
      return null;
    }
  }, [data]);

  // Get goal-specific calorie recommendation
  const getGoalCalories = useCallback(
    (goal: Goal): number => {
      if (!calculations) return 0;
      return Math.round(calculations.tdee + GOAL_ADJUSTMENTS[goal]);
    },
    [calculations]
  );

  // Get macros for current selection
  const macros = useMemo(() => {
    if (!data.goal || !calculations || !data.weightKg) return null;
    const goalCalories = getGoalCalories(data.goal);
    return calculateMacros(goalCalories, data.weightKg, data.goal);
  }, [data.goal, data.weightKg, calculations, getGoalCalories]);

  // Handle goal selection
  const handleSelectGoal = useCallback(
    (goal: Goal) => {
      setGoal(goal);
      setError(null);
    },
    [setGoal]
  );

  // Handle finish button
  const handleFinish = useCallback(async () => {
    if (!data.goal || !calculations) return;

    setIsLoading(true);
    setError(null);

    const finalCalories = customCalories
      ? parseInt(customCalories, 10)
      : getGoalCalories(data.goal);

    // Save calculated values to store
    setCalculatedValues(calculations.tdee, finalCalories);

    try {
      // Save profile to database
      await saveOnboardingProfile({
        ...data,
        goal: data.goal,
        calculatedTDEE: calculations.tdee,
        dailyCalorieGoal: finalCalories,
      });

      // Mark onboarding as complete
      completeOnboarding();

      // Navigate to main app
      router.replace('/(tabs)');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Ein Fehler ist aufgetreten';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [
    data,
    calculations,
    customCalories,
    getGoalCalories,
    setCalculatedValues,
    completeOnboarding,
    router,
  ]);

  // Handle back button
  const handleBack = useCallback(() => {
    prevStep();
    router.back();
  }, [prevStep, router]);

  // Handle custom calories save
  const handleSaveCustomCalories = useCallback(() => {
    const parsed = parseInt(customCalories, 10);
    if (!isNaN(parsed) && parsed >= 1200 && parsed <= 5000) {
      setShowAdjustModal(false);
    }
  }, [customCalories]);

  // Current goal calories (custom or calculated)
  const currentGoalCalories = useMemo(() => {
    if (customCalories) {
      const parsed = parseInt(customCalories, 10);
      if (!isNaN(parsed)) return parsed;
    }
    return data.goal ? getGoalCalories(data.goal) : 0;
  }, [customCalories, data.goal, getGoalCalories]);

  // Calculate progress percentage for ring
  const progressPercent = useMemo(() => {
    if (!calculations || currentGoalCalories === 0) return 0;
    const maxValue = calculations.tdee * 1.5;
    return Math.min(100, (currentGoalCalories / maxValue) * 100);
  }, [calculations, currentGoalCalories]);

  // No calculations available
  if (!calculations) {
    return (
      <OnboardingLayout currentStep={4} onBack={handleBack} showBack>
        <View className="flex-1 items-center justify-center py-4">
          <Text variant="body-md" color="error">
            Fehler beim Berechnen. Bitte gehe zurück und überprüfe deine Daten.
          </Text>
        </View>
      </OnboardingLayout>
    );
  }

  return (
    <OnboardingLayout
      currentStep={4}
      onNext={handleFinish}
      onBack={handleBack}
      nextLabel="Fertig"
      nextDisabled={!data.goal}
      nextLoading={isLoading}
    >
      <View className="flex-1 py-4">
        {/* Title */}
        <Text variant="heading-2" className="mb-2 text-center">
          Was ist dein Ziel?
        </Text>
        <Text variant="body-md" color="secondary" className="mb-6 text-center">
          Basierend auf deinen Daten berechnen wir deinen Kalorienbedarf.
        </Text>

        {/* TDEE Display */}
        <Card variant="elevated" padding="md" className="mb-6">
          <View className="items-center">
            <Text variant="caption" color="tertiary">
              Dein täglicher Grundumsatz (TDEE)
            </Text>
            <Text variant="heading-1" className="text-primary-600 dark:text-primary-400">
              {Math.round(calculations.tdee)}
            </Text>
            <Text variant="body-sm" color="tertiary">
              kcal / Tag
            </Text>
          </View>
        </Card>

        {/* Goal Options */}
        <View className="mb-6 flex-row gap-3">
          {GOAL_OPTIONS.map((option) => {
            const isSelected = data.goal === option.goal;
            const goalCalories = getGoalCalories(option.goal);

            return (
              <Pressable
                key={option.goal}
                onPress={() => handleSelectGoal(option.goal)}
                className="flex-1"
                accessibilityRole="radio"
                accessibilityState={{ selected: isSelected }}
                accessibilityLabel={`${option.name}: ${option.description}, ${goalCalories} Kalorien`}
              >
                <Card
                  variant={isSelected ? 'elevated' : 'outlined'}
                  padding="sm"
                  className={`items-center ${
                    isSelected
                      ? 'border-2 border-primary-500 bg-primary-50 dark:bg-primary-950'
                      : 'border border-neutral-200 dark:border-neutral-700'
                  }`}
                >
                  <Text variant="heading-3" className="mb-1">
                    {option.icon}
                  </Text>
                  <Text
                    variant="label"
                    className={`text-center ${
                      isSelected ? 'text-primary-700 dark:text-primary-300' : ''
                    }`}
                  >
                    {option.name}
                  </Text>
                  <Text variant="caption" color="tertiary" className="text-center">
                    {option.description}
                  </Text>
                  <Badge variant={option.color} size="sm" className="mt-2">
                    {option.adjustment > 0 ? '+' : ''}
                    {option.adjustment} kcal
                  </Badge>
                </Card>
              </Pressable>
            );
          })}
        </View>

        {/* Selected Goal Summary */}
        {data.goal && (
          <Card variant="outlined" padding="md" className="mb-6">
            <Text variant="label" color="tertiary" className="mb-3 text-center">
              Dein tägliches Kalorienziel
            </Text>

            <View className="items-center">
              <ProgressRing value={progressPercent} size="lg" variant="primary" showValue>
                <Text variant="heading-3">{currentGoalCalories}</Text>
                <Text variant="caption" color="tertiary">
                  kcal
                </Text>
              </ProgressRing>
            </View>

            {customCalories && (
              <Badge variant="secondary" size="sm" className="mt-2 self-center">
                Angepasst
              </Badge>
            )}

            {/* Macros Preview */}
            {macros && (
              <View className="mt-4 flex-row justify-around border-t border-neutral-200 pt-4 dark:border-neutral-700">
                <View className="items-center">
                  <Text variant="caption" color="tertiary">
                    Protein
                  </Text>
                  <Text variant="body-lg" className="font-semibold text-macro-protein">
                    {macros.proteinG}g
                  </Text>
                </View>
                <View className="items-center">
                  <Text variant="caption" color="tertiary">
                    Kohlenhydrate
                  </Text>
                  <Text variant="body-lg" className="font-semibold text-macro-carbs">
                    {macros.carbsG}g
                  </Text>
                </View>
                <View className="items-center">
                  <Text variant="caption" color="tertiary">
                    Fett
                  </Text>
                  <Text variant="body-lg" className="font-semibold text-macro-fat">
                    {macros.fatG}g
                  </Text>
                </View>
              </View>
            )}

            {/* Adjust Button */}
            <Pressable
              onPress={() => {
                setCustomCalories(currentGoalCalories.toString());
                setShowAdjustModal(true);
              }}
              className="mt-4 self-center"
            >
              <Text variant="body-sm" color="primary" className="underline">
                Manuell anpassen
              </Text>
            </Pressable>
          </Card>
        )}

        {/* Error Display */}
        {error && (
          <Card variant="outlined" padding="md" className="mb-6 border-error-500">
            <Text variant="body-sm" color="error">
              {error}
            </Text>
            <Pressable onPress={handleFinish} className="mt-2">
              <Text variant="body-sm" color="primary" className="underline">
                Erneut versuchen
              </Text>
            </Pressable>
          </Card>
        )}

        {/* Info Card */}
        <Card variant="flat" padding="md">
          <Text variant="body-sm" color="secondary">
            💡 <Text variant="body-sm">Tipp:</Text> Diese Werte sind Empfehlungen basierend auf
            wissenschaftlichen Formeln. Du kannst sie jederzeit in den Einstellungen anpassen.
          </Text>
        </Card>
      </View>

      {/* Adjust Calories Modal */}
      <Modal
        visible={showAdjustModal}
        onClose={() => setShowAdjustModal(false)}
        title="Kalorienziel anpassen"
      >
        <View className="p-4">
          <Text variant="body-md" color="secondary" className="mb-4">
            Gib dein gewünschtes tägliches Kalorienziel ein (1200-5000 kcal).
          </Text>

          <Input
            label="Kalorienziel"
            value={customCalories}
            onChangeText={setCustomCalories}
            keyboardType="number-pad"
            placeholder="z.B. 2000"
            helperText="kcal"
          />

          <View className="mt-6 flex-row gap-3">
            <Button
              variant="outline"
              onPress={() => {
                setCustomCalories('');
                setShowAdjustModal(false);
              }}
              className="flex-1"
            >
              Zurücksetzen
            </Button>
            <Button variant="primary" onPress={handleSaveCustomCalories} className="flex-1">
              Speichern
            </Button>
          </View>
        </View>
      </Modal>
    </OnboardingLayout>
  );
}
