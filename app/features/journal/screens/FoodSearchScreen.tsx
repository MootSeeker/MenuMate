/**
 * FoodSearchScreen
 *
 * Suchbildschirm für Lebensmittel
 * Implementiert Issue #31: Food Search Screen
 */

import React, { useCallback } from 'react';
import { View, FlatList, Pressable, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { cssInterop } from 'nativewind';
import { useRouter, useLocalSearchParams } from 'expo-router';

import { Text, Input, Badge } from '@/components/ui';
import { Button } from '@/components/ui/Button';
import { useFoodSearch, SearchTab, FoodSearchResult } from '../hooks';
import { MealType, MEAL_TYPE_CONFIG } from '../types';

// Enable NativeWind styling
cssInterop(View, { className: 'style' });
cssInterop(Pressable, { className: 'style' });
cssInterop(FlatList, { className: 'style' });
cssInterop(SafeAreaView, { className: 'style' });

/**
 * Tab-Button Komponente
 */
function TabButton({
  label,
  isActive,
  onPress,
}: {
  label: string;
  isActive: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      className={`flex-1 items-center border-b-2 px-4 py-2 ${isActive ? 'border-primary-500' : 'border-transparent'} `}
      accessibilityRole="tab"
      accessibilityState={{ selected: isActive }}
    >
      <Text
        variant="body-sm"
        color={isActive ? 'primary' : 'secondary'}
        className={isActive ? 'font-semibold' : ''}
      >
        {label}
      </Text>
    </Pressable>
  );
}

/**
 * Such-Ergebnis Item
 */
function SearchResultItem({
  item,
  onPress,
}: {
  item: FoodSearchResult;
  onPress: (item: FoodSearchResult) => void;
}) {
  // Badge für die Quelle
  const getSourceBadge = () => {
    switch (item.source) {
      case 'custom':
        return (
          <Badge variant="success" size="sm">
            Mein Essen
          </Badge>
        );
      case 'recent':
        return (
          <Badge variant="secondary" size="sm">
            Zuletzt
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <Pressable
      onPress={() => onPress(item)}
      className="flex-row items-center border-b border-border px-4 py-3 active:bg-gray-100 dark:border-gray-700 dark:active:bg-gray-800"
      accessibilityRole="button"
      accessibilityLabel={`${item.name}${item.brand ? `, ${item.brand}` : ''}, ${item.nutritionPer100g.calories} Kalorien pro 100g`}
    >
      {/* Linke Seite: Name und Marke */}
      <View className="mr-4 flex-1">
        <View className="flex-row items-center">
          <Text variant="body-md" numberOfLines={1} className="mr-2 flex-1">
            {item.name}
          </Text>
          {getSourceBadge()}
        </View>
        {item.brand && (
          <Text variant="caption" color="secondary" numberOfLines={1}>
            {item.brand}
          </Text>
        )}
      </View>

      {/* Rechte Seite: Kalorien */}
      <View className="items-end">
        <Text variant="body-md" color="default" className="font-semibold">
          {item.nutritionPer100g.calories}
        </Text>
        <Text variant="caption" color="tertiary">
          kcal/100g
        </Text>
      </View>
    </Pressable>
  );
}

/**
 * Leerer Zustand
 */
function EmptyState({
  activeTab,
  query,
  isSearching,
}: {
  activeTab: SearchTab;
  query: string;
  isSearching: boolean;
}) {
  if (activeTab === 'all' && query.length < 2) {
    return (
      <View className="flex-1 items-center justify-center px-6 py-12">
        <Text variant="heading-3" className="mb-2">
          🔍
        </Text>
        <Text variant="body-md" color="secondary" className="text-center">
          Suche nach Lebensmitteln{'\n'}
          (mindestens 2 Zeichen)
        </Text>
      </View>
    );
  }

  if (isSearching) {
    return null; // Loading wird separat angezeigt
  }

  if (activeTab === 'custom') {
    return (
      <View className="flex-1 items-center justify-center px-6 py-12">
        <Text variant="heading-3" className="mb-2">
          📝
        </Text>
        <Text variant="body-md" color="secondary" className="text-center">
          {query.length >= 2
            ? 'Keine eigenen Lebensmittel gefunden'
            : 'Noch keine eigenen Lebensmittel erstellt'}
        </Text>
      </View>
    );
  }

  if (activeTab === 'recent') {
    return (
      <View className="flex-1 items-center justify-center px-6 py-12">
        <Text variant="heading-3" className="mb-2">
          🕒
        </Text>
        <Text variant="body-md" color="secondary" className="text-center">
          {query.length >= 2
            ? 'Keine passenden zuletzt verwendeten Lebensmittel'
            : 'Noch keine zuletzt verwendeten Lebensmittel'}
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 items-center justify-center px-6 py-12">
      <Text variant="heading-3" className="mb-2">
        🤷
      </Text>
      <Text variant="body-md" color="secondary" className="text-center">
        Keine Ergebnisse gefunden
      </Text>
    </View>
  );
}

/**
 * FoodSearchScreen Komponente
 */
export function FoodSearchScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ mealType?: string; date?: string }>();

  const mealType = (params.mealType as MealType) || 'snack';
  const date = params.date || new Date().toISOString().split('T')[0];

  const mealConfig = MEAL_TYPE_CONFIG[mealType];

  const { query, setQuery, activeTab, setActiveTab, results, isLoading, isSearching } =
    useFoodSearch();

  // Zurück-Handler
  const handleBack = useCallback(() => {
    router.back();
  }, [router]);

  // Ergebnis auswählen
  const handleSelectResult = useCallback(
    (item: FoodSearchResult) => {
      // TODO: Navigiere zur Portionsauswahl
      console.log('Selected:', item.name, 'for', mealType, 'on', date);
      // router.push({
      //   pathname: '/journal/portion',
      //   params: { foodId: item.id, mealType, date },
      // });
    },
    [mealType, date]
  );

  // Tab-Wechsel Handler
  const handleTabChange = useCallback(
    (tab: SearchTab) => {
      setActiveTab(tab);
    },
    [setActiveTab]
  );

  // Render Item für FlatList
  const renderItem = useCallback(
    ({ item }: { item: FoodSearchResult }) => (
      <SearchResultItem item={item} onPress={handleSelectResult} />
    ),
    [handleSelectResult]
  );

  // Key Extractor
  const keyExtractor = useCallback((item: FoodSearchResult) => item.id, []);

  return (
    <SafeAreaView className="flex-1 bg-background dark:bg-gray-900" edges={['top']}>
      {/* Header */}
      <View className="flex-row items-center border-b border-border px-4 py-2 dark:border-gray-800">
        <Pressable onPress={handleBack} className="mr-2 p-2" accessibilityLabel="Zurück">
          <Text variant="heading-4" color="primary">
            ←
          </Text>
        </Pressable>
        <View className="flex-1">
          <Text variant="heading-4">
            {mealConfig.icon} {mealConfig.name} hinzufügen
          </Text>
        </View>
      </View>

      {/* Suchfeld */}
      <View className="px-4 py-3">
        <Input
          placeholder="Lebensmittel suchen..."
          value={query}
          onChangeText={setQuery}
          autoFocus
          leftIcon={
            <Text variant="body-md" color="tertiary">
              🔍
            </Text>
          }
          rightIcon={
            query.length > 0 ? (
              <Pressable onPress={() => setQuery('')}>
                <Text variant="body-md" color="tertiary">
                  ✕
                </Text>
              </Pressable>
            ) : undefined
          }
        />
      </View>

      {/* Tabs */}
      <View className="flex-row border-b border-border dark:border-gray-800">
        <TabButton
          label="Alle"
          isActive={activeTab === 'all'}
          onPress={() => handleTabChange('all')}
        />
        <TabButton
          label="Meine"
          isActive={activeTab === 'custom'}
          onPress={() => handleTabChange('custom')}
        />
        <TabButton
          label="Zuletzt"
          isActive={activeTab === 'recent'}
          onPress={() => handleTabChange('recent')}
        />
      </View>

      {/* Ergebnisse oder Zustände */}
      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#22c55e" />
          <Text variant="body-sm" color="secondary" className="mt-2">
            Suche...
          </Text>
        </View>
      ) : results.length > 0 ? (
        <FlatList
          data={results}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          className="flex-1"
          contentContainerStyle={{ paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <EmptyState activeTab={activeTab} query={query} isSearching={isSearching} />
      )}

      {/* Manuelle Eingabe Button */}
      <View className="absolute bottom-0 left-0 right-0 border-t border-border bg-background p-4 dark:border-gray-800 dark:bg-gray-900">
        <Button
          variant="outline"
          onPress={() => {
            // TODO: Navigiere zur manuellen Eingabe
            console.log('Manual entry for', mealType, 'on', date);
          }}
        >
          ✏️ Manuell eingeben
        </Button>
      </View>
    </SafeAreaView>
  );
}

export default FoodSearchScreen;
