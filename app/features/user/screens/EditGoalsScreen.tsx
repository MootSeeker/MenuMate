/**
 * Edit Goals Screen
 *
 * Allows users to manually adjust their calorie and macro goals.
 * Also provides option to recalculate TDEE.
 *
 * @see Issue #24 - [PROFILE-001-A] Edit Goals Screen
 */

import { useCallback, useState, useMemo } from 'react';
import { View, ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Text, Card, Button, Input } from '@/components/ui';
import { useOnboardingStore } from '@/features/onboarding';
import { calculateAllCalories, GOAL_ADJUSTMENTS } from '@/features/user/utils';

// ============================================
// TYPES
// ============================================

interface ValidationErrors {
  calories?: string;
  protein?: string;
  carbs?: string;
  fat?: string;
}

// ============================================
// CONSTANTS
// ============================================

const MIN_CALORIES = 1200;
const MAX_CALORIES = 5000;

// ============================================
// HELPERS
// ============================================

/**
 * Validate goal inputs
 */
function validateInputs(
  calories: string,
  protein: string,
  carbs: string,
  fat: string
): ValidationErrors {
  const errors: ValidationErrors = {};

  const caloriesNum = parseInt(calories, 10);
  if (!calories || isNaN(caloriesNum)) {
    errors.calories = 'Bitte gib ein gültiges Kalorienziel ein';
  } else if (caloriesNum < MIN_CALORIES || caloriesNum > MAX_CALORIES) {
    errors.calories = `Kalorien müssen zwischen ${MIN_CALORIES} und ${MAX_CALORIES} liegen`;
  }

  const proteinNum = parseInt(protein, 10);
  if (protein && (isNaN(proteinNum) || proteinNum < 0)) {
    errors.protein = 'Bitte gib einen gültigen Wert ein';
  }

  const carbsNum = parseInt(carbs, 10);
  if (carbs && (isNaN(carbsNum) || carbsNum < 0)) {
    errors.carbs = 'Bitte gib einen gültigen Wert ein';
  }

  const fatNum = parseInt(fat, 10);
  if (fat && (isNaN(fatNum) || fatNum < 0)) {
    errors.fat = 'Bitte gib einen gültigen Wert ein';
  }

  return errors;
}

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

// ============================================
// COMPONENT
// ============================================

export function EditGoalsScreen() {
  const router = useRouter();
  const { data, setCalculatedValues } = useOnboardingStore();

  // Form state
  const [calories, setCalories] = useState(data.dailyCalorieGoal?.toString() ?? '');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fat, setFat] = useState('');
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  // Calculate macros based on current calories
  const calculatedMacros = useMemo(() => {
    const caloriesNum = parseInt(calories, 10);
    if (isNaN(caloriesNum) || caloriesNum < MIN_CALORIES) return null;

    // Default macro split: 30% protein, 40% carbs, 30% fat
    const proteinCal = caloriesNum * 0.3;
    const carbsCal = caloriesNum * 0.4;
    const fatCal = caloriesNum * 0.3;

    return {
      protein: Math.round(proteinCal / 4), // 4 cal per gram
      carbs: Math.round(carbsCal / 4), // 4 cal per gram
      fat: Math.round(fatCal / 9), // 9 cal per gram
    };
  }, [calories]);

  // Handle recalculate TDEE
  const handleRecalculateTDEE = useCallback(() => {
    if (
      !data.gender ||
      !data.birthDate ||
      !data.heightCm ||
      !data.weightKg ||
      !data.activityLevel
    ) {
      Alert.alert('Fehlende Daten', 'Bitte vervollständige zuerst dein Profil im Onboarding.', [
        { text: 'OK' },
      ]);
      return;
    }

    try {
      const age = calculateAge(new Date(data.birthDate));
      const result = calculateAllCalories({
        weightKg: data.weightKg,
        heightCm: data.heightCm,
        age,
        gender: data.gender,
        activityLevel: data.activityLevel,
        goal: data.goal ?? 'maintain',
      });

      const goalCalories = Math.round(result.tdee + GOAL_ADJUSTMENTS[data.goal ?? 'maintain']);
      setCalories(goalCalories.toString());
      setCalculatedValues(result.tdee, goalCalories);

      Alert.alert('Erfolg', `Dein Kalorienbedarf wurde neu berechnet: ${goalCalories} kcal`);
    } catch {
      Alert.alert('Fehler', 'Die Berechnung konnte nicht durchgeführt werden.');
    }
  }, [data, setCalculatedValues]);

  // Handle save
  const handleSave = useCallback(async () => {
    const validationErrors = validateInputs(calories, protein, carbs, fat);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setIsLoading(true);

    try {
      const caloriesNum = parseInt(calories, 10);
      setCalculatedValues(data.calculatedTDEE ?? caloriesNum, caloriesNum);

      // TODO: Save to Supabase when profile service is extended

      Alert.alert('Gespeichert', 'Deine Ziele wurden aktualisiert.', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch {
      Alert.alert('Fehler', 'Die Ziele konnten nicht gespeichert werden.');
    } finally {
      setIsLoading(false);
    }
  }, [calories, protein, carbs, fat, data.calculatedTDEE, setCalculatedValues, router]);

  // Handle cancel
  const handleCancel = useCallback(() => {
    router.back();
  }, [router]);

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-neutral-900" edges={['top']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        {/* Header */}
        <View className="flex-row items-center justify-between border-b border-neutral-200 px-4 py-4 dark:border-neutral-700">
          <Button variant="ghost" size="sm" onPress={handleCancel}>
            Abbrechen
          </Button>
          <Text variant="heading-3">Ziele bearbeiten</Text>
          <Button variant="primary" size="sm" onPress={handleSave} loading={isLoading}>
            Speichern
          </Button>
        </View>

        <ScrollView
          className="flex-1 px-4"
          contentContainerStyle={{ paddingVertical: 16 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Calories Section */}
          <Card variant="outlined" padding="md" className="mb-4">
            <Text variant="label-lg" className="mb-4">
              🎯 Kalorienziel
            </Text>

            <Input
              label="Tägliche Kalorien"
              type="number"
              value={calories}
              onChangeText={setCalories}
              error={errors.calories}
              placeholder="z.B. 2000"
              containerClassName="mb-4"
            />

            {/* Current TDEE Info */}
            {data.calculatedTDEE && (
              <View className="mb-4 rounded-lg bg-neutral-100 p-3 dark:bg-neutral-800">
                <Text variant="body-sm" color="secondary">
                  Dein berechneter Kalorienbedarf (TDEE): {data.calculatedTDEE} kcal
                </Text>
              </View>
            )}

            <Button variant="outline" size="md" onPress={handleRecalculateTDEE}>
              🔄 TDEE neu berechnen
            </Button>
          </Card>

          {/* Macros Section */}
          <Card variant="outlined" padding="md" className="mb-4">
            <Text variant="label-lg" className="mb-2">
              📊 Makronährstoffe (optional)
            </Text>
            <Text variant="body-sm" color="secondary" className="mb-4">
              Lass diese Felder leer, um die empfohlene Verteilung zu verwenden.
            </Text>

            <Input
              label="Protein (g)"
              type="number"
              value={protein}
              onChangeText={setProtein}
              error={errors.protein}
              placeholder={calculatedMacros ? `Empfohlen: ${calculatedMacros.protein}g` : 'g'}
              containerClassName="mb-3"
            />

            <Input
              label="Kohlenhydrate (g)"
              type="number"
              value={carbs}
              onChangeText={setCarbs}
              error={errors.carbs}
              placeholder={calculatedMacros ? `Empfohlen: ${calculatedMacros.carbs}g` : 'g'}
              containerClassName="mb-3"
            />

            <Input
              label="Fett (g)"
              type="number"
              value={fat}
              onChangeText={setFat}
              error={errors.fat}
              placeholder={calculatedMacros ? `Empfohlen: ${calculatedMacros.fat}g` : 'g'}
            />
          </Card>

          {/* Recommended Macros Info */}
          {calculatedMacros && (
            <Card variant="filled" padding="md" className="mb-4">
              <Text variant="label-md" className="mb-2">
                💡 Empfohlene Makroverteilung
              </Text>
              <Text variant="body-sm" color="secondary">
                Basierend auf {calories} kcal (30% Protein, 40% Kohlenhydrate, 30% Fett):
              </Text>
              <View className="mt-2 flex-row justify-between">
                <Text variant="body-sm">🥩 Protein: {calculatedMacros.protein}g</Text>
                <Text variant="body-sm">🍞 Carbs: {calculatedMacros.carbs}g</Text>
                <Text variant="body-sm">🥑 Fett: {calculatedMacros.fat}g</Text>
              </View>
            </Card>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
