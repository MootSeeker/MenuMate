/**
 * MealSection Component
 *
 * Wiederverwendbare Komponente für eine Mahlzeit-Kategorie
 * Implementiert Issue #27: Meal Section Component
 */

import React, { useState } from 'react';
import { View, Pressable } from 'react-native';
import { cssInterop } from 'nativewind';

import { Text, Card } from '@/components/ui';
import { FoodEntry, MealType, MealTypeConfig, MEAL_TYPE_CONFIG } from '../types';
import { FoodEntryItem } from './FoodEntryItem';

// Enable NativeWind styling
cssInterop(View, { className: 'style' });
cssInterop(Pressable, { className: 'style' });

export interface MealSectionProps {
  /** Typ der Mahlzeit */
  mealType: MealType;
  /** Einträge für diese Mahlzeit */
  entries: FoodEntry[];
  /** Gesamtkalorien für diese Mahlzeit */
  totalCalories: number;
  /** Handler für "+" Button */
  onAddPress?: (mealType: MealType) => void;
  /** Handler für Tap auf einen Eintrag */
  onEntryPress?: (entry: FoodEntry) => void;
  /** Handler für lange Drücken auf einen Eintrag */
  onEntryLongPress?: (entry: FoodEntry) => void;
  /** Ist die Sektion initial eingeklappt? */
  initiallyCollapsed?: boolean;
  /** Zusätzliche NativeWind-Klassen */
  className?: string;
}

/**
 * Chevron-Icon für Collapse-Status
 */
function ChevronIcon({ expanded }: { expanded: boolean }) {
  return (
    <Text variant="body-md" color="tertiary" className="mr-2">
      {expanded ? '▼' : '▶'}
    </Text>
  );
}

/**
 * MealSection Komponente
 *
 * Zeigt eine Mahlzeit-Kategorie mit:
 * - Header mit Icon, Name und Gesamtkalorien
 * - Liste der Einträge
 * - "+" Button zum Hinzufügen
 * - Optional einklappbar
 */
export function MealSection({
  mealType,
  entries,
  totalCalories,
  onAddPress,
  onEntryPress,
  onEntryLongPress,
  initiallyCollapsed = false,
  className = '',
}: MealSectionProps) {
  const [isExpanded, setIsExpanded] = useState(!initiallyCollapsed);

  const config: MealTypeConfig = MEAL_TYPE_CONFIG[mealType];
  const hasEntries = entries.length > 0;

  return (
    <Card variant="flat" padding="none" className={`mb-3 ${className}`}>
      {/* Header */}
      <Pressable
        onPress={() => setIsExpanded(!isExpanded)}
        className="flex-row items-center justify-between p-4"
        accessibilityRole="button"
        accessibilityLabel={`${config.name}, ${totalCalories} Kalorien, ${entries.length} Einträge`}
        accessibilityHint={isExpanded ? 'Tippen zum Einklappen' : 'Tippen zum Aufklappen'}
        accessibilityState={{ expanded: isExpanded }}
      >
        {/* Linke Seite: Icon, Name und Chevron */}
        <View className="flex-1 flex-row items-center">
          <ChevronIcon expanded={isExpanded} />
          <Text variant="heading-4" className="mr-2">
            {config.icon}
          </Text>
          <Text variant="heading-4">{config.name}</Text>
        </View>

        {/* Rechte Seite: Kalorien und Add-Button */}
        <View className="flex-row items-center">
          <Text variant="body-md" color="secondary" className="mr-3">
            {totalCalories} kcal
          </Text>
          <Pressable
            onPress={(e) => {
              e.stopPropagation();
              onAddPress?.(mealType);
            }}
            className="h-8 w-8 items-center justify-center rounded-full bg-primary-500 active:bg-primary-600"
            accessibilityRole="button"
            accessibilityLabel={`${config.name} hinzufügen`}
          >
            <Text variant="body-lg" color="inverse" className="font-bold">
              +
            </Text>
          </Pressable>
        </View>
      </Pressable>

      {/* Einträge (wenn expanded) */}
      {isExpanded && (
        <View>
          {hasEntries ? (
            entries.map((entry) => (
              <FoodEntryItem
                key={entry.id}
                entry={entry}
                onPress={onEntryPress}
                onLongPress={onEntryLongPress}
              />
            ))
          ) : (
            <View className="items-center px-4 py-6">
              <Text variant="body-sm" color="tertiary">
                Noch keine Einträge
              </Text>
              <Pressable
                onPress={() => onAddPress?.(mealType)}
                className="mt-2"
                accessibilityRole="button"
                accessibilityLabel={`Erstes ${config.name} hinzufügen`}
              >
                <Text variant="body-sm" color="primary">
                  + Hinzufügen
                </Text>
              </Pressable>
            </View>
          )}
        </View>
      )}
    </Card>
  );
}

/**
 * Kompakte Version der MealSection für Übersichten
 */
export function MealSectionCompact({
  mealType,
  totalCalories,
  entryCount,
  onPress,
  className = '',
}: {
  mealType: MealType;
  totalCalories: number;
  entryCount: number;
  onPress?: (mealType: MealType) => void;
  className?: string;
}) {
  const config = MEAL_TYPE_CONFIG[mealType];

  return (
    <Pressable
      onPress={() => onPress?.(mealType)}
      className={`flex-row items-center justify-between rounded-lg bg-surface px-4 py-3 active:opacity-80 dark:bg-gray-800 ${className} `}
    >
      <View className="flex-row items-center">
        <Text variant="body-md" className="mr-2">
          {config.icon}
        </Text>
        <Text variant="body-md">{config.name}</Text>
        {entryCount > 0 && (
          <View className="ml-2 rounded-full bg-gray-200 px-2 py-0.5 dark:bg-gray-700">
            <Text variant="caption" color="secondary">
              {entryCount}
            </Text>
          </View>
        )}
      </View>
      <Text variant="body-md" color="secondary">
        {totalCalories} kcal
      </Text>
    </Pressable>
  );
}

export default MealSection;
