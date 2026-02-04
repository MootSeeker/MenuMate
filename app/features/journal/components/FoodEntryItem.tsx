/**
 * FoodEntryItem Component
 *
 * Einzelner Eintrag innerhalb einer Mahlzeit
 * Zeigt Name, Portion und Kalorien
 */

import React from 'react';
import { View, Pressable } from 'react-native';
import { cssInterop } from 'nativewind';

import { Text } from '@/components/ui';
import { FoodEntry } from '../types';

// Enable NativeWind styling
cssInterop(View, { className: 'style' });
cssInterop(Pressable, { className: 'style' });

export interface FoodEntryItemProps {
  /** Der Lebensmittel-Eintrag */
  entry: FoodEntry;
  /** Handler für Tap auf den Eintrag (zum Bearbeiten) */
  onPress?: (entry: FoodEntry) => void;
  /** Handler für lange Drücken (zum Löschen) */
  onLongPress?: (entry: FoodEntry) => void;
  /** Zusätzliche NativeWind-Klassen */
  className?: string;
}

/**
 * FoodEntryItem Komponente
 *
 * Zeigt einen einzelnen Lebensmittel-Eintrag mit:
 * - Name und optional Marke
 * - Portion/Menge
 * - Kalorien
 */
export function FoodEntryItem({ entry, onPress, onLongPress, className = '' }: FoodEntryItemProps) {
  // Formatierte Menge mit Einheit
  const formattedAmount = `${entry.amount} ${entry.unit}`;

  // Name mit optionaler Marke
  const displayName = entry.brand ? `${entry.name} (${entry.brand})` : entry.name;

  return (
    <Pressable
      onPress={() => onPress?.(entry)}
      onLongPress={() => onLongPress?.(entry)}
      className={`flex-row items-center justify-between border-b border-border bg-surface px-4 py-3 active:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:active:bg-gray-700 ${className} `}
      accessibilityRole="button"
      accessibilityLabel={`${displayName}, ${formattedAmount}, ${entry.nutrition.calories} Kalorien`}
      accessibilityHint="Tippen zum Bearbeiten, lange drücken zum Löschen"
    >
      {/* Linke Seite: Name und Menge */}
      <View className="mr-4 flex-1">
        <Text variant="body-md" numberOfLines={1}>
          {displayName}
        </Text>
        <Text variant="caption" color="secondary">
          {formattedAmount}
        </Text>
      </View>

      {/* Rechte Seite: Kalorien */}
      <View className="items-end">
        <Text variant="body-md" color="default" className="font-semibold">
          {entry.nutrition.calories}
        </Text>
        <Text variant="caption" color="tertiary">
          kcal
        </Text>
      </View>
    </Pressable>
  );
}

/**
 * Kompakte Version für kleinere Darstellung
 */
export function FoodEntryItemCompact({
  entry,
  onPress,
  className = '',
}: Omit<FoodEntryItemProps, 'onLongPress'>) {
  return (
    <Pressable
      onPress={() => onPress?.(entry)}
      className={`flex-row items-center justify-between px-3 py-2 active:bg-gray-100 dark:active:bg-gray-700 ${className} `}
    >
      <Text variant="body-sm" numberOfLines={1} className="mr-2 flex-1">
        {entry.name}
      </Text>
      <Text variant="body-sm" color="secondary">
        {entry.nutrition.calories} kcal
      </Text>
    </Pressable>
  );
}

export default FoodEntryItem;
