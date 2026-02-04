/**
 * JournalScreen
 *
 * Hauptbildschirm des Tagebuchs
 * Implementiert Issue #25: Journal Main Screen
 */

import React, { useCallback } from 'react';
import { View, ScrollView, RefreshControl, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { cssInterop } from 'nativewind';
import { useRouter } from 'expo-router';

import { Text, ProgressRing, ProgressBar } from '@/components/ui';
import { Card } from '@/components/ui/Card';
import { DateNavigation, MealSection } from '../components';
import { useFoodEntries, useCalorieProgress, useMacroProgress } from '../hooks';
import { MealType, FoodEntry } from '../types';
import { useJournalStore } from '../stores';

// Enable NativeWind styling
cssInterop(View, { className: 'style' });
cssInterop(ScrollView, { className: 'style' });
cssInterop(SafeAreaView, { className: 'style' });

/**
 * Makro-Fortschrittsanzeige
 */
function MacroProgressItem({
  label,
  consumed,
  goal,
  percentage,
  color,
}: {
  label: string;
  consumed: number;
  goal: number;
  percentage: number;
  color: 'primary' | 'secondary' | 'warning';
}) {
  const variantMap = {
    primary: 'primary' as const,
    secondary: 'secondary' as const,
    warning: 'warning' as const,
  };

  return (
    <View className="mx-1 flex-1">
      <View className="mb-1 flex-row justify-between">
        <Text variant="caption" color="secondary">
          {label}
        </Text>
        <Text variant="caption" color="secondary">
          {consumed}g / {goal}g
        </Text>
      </View>
      <ProgressBar value={percentage} variant={variantMap[color]} size="sm" />
    </View>
  );
}

/**
 * Kalorienanzeige im Zentrum
 */
function CalorieDisplay() {
  const { consumed, goal, remaining, percentage, isOverGoal } = useCalorieProgress();

  return (
    <View className="items-center py-4">
      <ProgressRing value={percentage} size="xl" variant={isOverGoal ? 'error' : 'primary'}>
        <View className="items-center">
          <Text variant="heading-2" color={isOverGoal ? 'error' : 'default'}>
            {consumed}
          </Text>
          <Text variant="caption" color="secondary">
            von {goal} kcal
          </Text>
        </View>
      </ProgressRing>

      {/* Verbleibende Kalorien */}
      <View className="mt-3">
        {isOverGoal ? (
          <Text variant="body-sm" color="error">
            {Math.abs(remaining)} kcal über dem Ziel
          </Text>
        ) : (
          <Text variant="body-sm" color="secondary">
            Noch {remaining} kcal übrig
          </Text>
        )}
      </View>
    </View>
  );
}

/**
 * Makro-Übersicht
 */
function MacroOverview() {
  const macros = useMacroProgress();

  return (
    <Card variant="flat" padding="sm" className="mb-4">
      <View className="flex-row">
        <MacroProgressItem
          label="Protein"
          consumed={macros.protein.consumed}
          goal={macros.protein.goal}
          percentage={macros.protein.percentage}
          color="primary"
        />
        <MacroProgressItem
          label="Kohlenhydrate"
          consumed={macros.carbs.consumed}
          goal={macros.carbs.goal}
          percentage={macros.carbs.percentage}
          color="secondary"
        />
        <MacroProgressItem
          label="Fett"
          consumed={macros.fat.consumed}
          goal={macros.fat.goal}
          percentage={macros.fat.percentage}
          color="warning"
        />
      </View>
    </Card>
  );
}

/**
 * Leerer Zustand für Tage ohne Einträge
 * TODO: Wird in einer späteren Iteration eingesetzt
 */
function _EmptyState({ onAddPress }: { onAddPress: () => void }) {
  return (
    <View className="flex-1 items-center justify-center py-12">
      <Text variant="heading-3" className="mb-2">
        🍽️
      </Text>
      <Text variant="body-md" color="secondary" className="mb-4 text-center">
        Noch keine Einträge für heute.{'\n'}
        Füge deine erste Mahlzeit hinzu!
      </Text>
      <Text variant="body-md" color="primary" className="underline" onPress={onAddPress}>
        + Mahlzeit hinzufügen
      </Text>
    </View>
  );
}

/**
 * Lade-Zustand
 */
function LoadingState() {
  return (
    <View className="flex-1 items-center justify-center">
      <ActivityIndicator size="large" color="#22c55e" />
      <Text variant="body-sm" color="secondary" className="mt-2">
        Lade Einträge...
      </Text>
    </View>
  );
}

/**
 * Fehler-Zustand
 */
function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <View className="flex-1 items-center justify-center px-6">
      <Text variant="heading-3" className="mb-2">
        ⚠️
      </Text>
      <Text variant="body-md" color="error" className="mb-4 text-center">
        {message}
      </Text>
      <Text variant="body-md" color="primary" className="underline" onPress={onRetry}>
        Erneut versuchen
      </Text>
    </View>
  );
}

/**
 * JournalScreen Komponente
 */
export function JournalScreen() {
  const router = useRouter();
  const selectedDate = useJournalStore((state) => state.selectedDate);

  const { data, isLoading, isError, error, refetch, isRefetching } = useFoodEntries();

  // Handler für "Hinzufügen" Button
  const handleAddPress = useCallback(
    (mealType: MealType) => {
      // Navigiere zur Suche mit dem Mahlzeit-Typ als Parameter
      router.push({
        pathname: '/journal/search',
        params: { mealType, date: selectedDate },
      });
    },
    [router, selectedDate]
  );

  // Handler für Tap auf Eintrag (Bearbeiten)
  const handleEntryPress = useCallback((entry: FoodEntry) => {
    // TODO: Navigiere zur Bearbeitungs-Ansicht
    console.log('Edit entry:', entry.id);
  }, []);

  // Handler für lange Drücken auf Eintrag (Löschen)
  const handleEntryLongPress = useCallback((entry: FoodEntry) => {
    // TODO: Zeige Lösch-Dialog
    console.log('Delete entry:', entry.id);
  }, []);

  // Handler für generisches Hinzufügen (Empty State)
  // TODO: Wird verwendet wenn EmptyState aktiviert wird
  const _handleGenericAdd = useCallback(() => {
    handleAddPress('breakfast');
  }, [handleAddPress]);

  // Refresh Handler
  const handleRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  // Sortierte Mahlzeit-Typen
  const mealTypes: MealType[] = ['breakfast', 'lunch', 'dinner', 'snack'];

  // Prüfen ob es Einträge gibt
  const hasAnyEntries = data?.summary
    ? Object.values(data.summary.entriesByMeal).some((entries) => entries.length > 0)
    : false;

  return (
    <SafeAreaView className="flex-1 bg-background dark:bg-gray-900" edges={['top']}>
      {/* Header mit Datumsnavigation */}
      <DateNavigation className="border-b border-border dark:border-gray-800" />

      {/* Inhalt */}
      {isLoading ? (
        <LoadingState />
      ) : isError ? (
        <ErrorState
          message={error?.message ?? 'Ein Fehler ist aufgetreten'}
          onRetry={handleRefresh}
        />
      ) : (
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingBottom: 100 }}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={handleRefresh}
              tintColor="#22c55e"
              colors={['#22c55e']}
            />
          }
        >
          {/* Kalorienanzeige */}
          <CalorieDisplay />

          {/* Makro-Übersicht */}
          <View className="px-4">
            <MacroOverview />
          </View>

          {/* Mahlzeit-Sektionen oder Empty State */}
          <View className="px-4">
            {hasAnyEntries ? (
              mealTypes.map((mealType) => (
                <MealSection
                  key={mealType}
                  mealType={mealType}
                  entries={data?.summary?.entriesByMeal[mealType] ?? []}
                  totalCalories={data?.summary?.caloriesByMeal[mealType] ?? 0}
                  onAddPress={handleAddPress}
                  onEntryPress={handleEntryPress}
                  onEntryLongPress={handleEntryLongPress}
                />
              ))
            ) : (
              <>
                {/* Leere Sektionen anzeigen für bessere UX */}
                {mealTypes.map((mealType) => (
                  <MealSection
                    key={mealType}
                    mealType={mealType}
                    entries={[]}
                    totalCalories={0}
                    onAddPress={handleAddPress}
                    initiallyCollapsed={true}
                  />
                ))}
              </>
            )}
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

export default JournalScreen;
