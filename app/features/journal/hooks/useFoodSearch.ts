/**
 * useFoodSearch Hook
 *
 * React Query Hook für die Lebensmittelsuche
 * Kombiniert OpenFoodFacts und Custom Foods mit Debounce
 */

import { useState, useEffect, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';

import {
  searchAllFoods,
  getAllCustomFoods,
  getRecentFoods,
  FoodSearchResult,
} from '../services/foodSearchService';

/**
 * Debounce Hook
 */
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Query Keys für Food Search
 */
export const foodSearchKeys = {
  all: ['food-search'] as const,
  search: (query: string) => [...foodSearchKeys.all, 'search', query] as const,
  customFoods: () => [...foodSearchKeys.all, 'custom'] as const,
  recentFoods: () => [...foodSearchKeys.all, 'recent'] as const,
};

/**
 * Aktiver Tab für die Suche
 */
export type SearchTab = 'all' | 'custom' | 'recent';

/**
 * Hook für die Lebensmittelsuche mit Debounce
 */
export function useFoodSearch(initialQuery: string = '') {
  const [query, setQuery] = useState(initialQuery);
  const [activeTab, setActiveTab] = useState<SearchTab>('all');

  // Debounced Query (300ms Verzögerung)
  const debouncedQuery = useDebounce(query, 300);

  // Suche in allen Quellen
  const searchQuery = useQuery({
    queryKey: foodSearchKeys.search(debouncedQuery),
    queryFn: () => searchAllFoods(debouncedQuery),
    enabled: activeTab === 'all' && debouncedQuery.length >= 2,
    staleTime: 1000 * 60 * 5, // 5 Minuten
  });

  // Alle Custom Foods
  const customFoodsQuery = useQuery({
    queryKey: foodSearchKeys.customFoods(),
    queryFn: getAllCustomFoods,
    enabled: activeTab === 'custom',
    staleTime: 1000 * 60 * 5,
  });

  // Zuletzt verwendete
  const recentFoodsQuery = useQuery({
    queryKey: foodSearchKeys.recentFoods(),
    queryFn: () => getRecentFoods(20),
    enabled: activeTab === 'recent',
    staleTime: 1000 * 60 * 2, // 2 Minuten
  });

  // Aktuelle Ergebnisse basierend auf Tab
  const getResults = useCallback((): FoodSearchResult[] => {
    switch (activeTab) {
      case 'all': {
        // Filter Custom Foods wenn Query vorhanden
        if (debouncedQuery.length >= 2) {
          return searchQuery.data ?? [];
        }
        return [];
      }

      case 'custom': {
        // Filter nach Query wenn vorhanden
        const customResults = customFoodsQuery.data ?? [];
        if (query.length >= 2) {
          const lowerQuery = query.toLowerCase();
          return customResults.filter(
            (food) =>
              food.name.toLowerCase().includes(lowerQuery) ||
              food.brand?.toLowerCase().includes(lowerQuery)
          );
        }
        return customResults;
      }

      case 'recent': {
        // Filter nach Query wenn vorhanden
        const recentResults = recentFoodsQuery.data ?? [];
        if (query.length >= 2) {
          const lowerQuery = query.toLowerCase();
          return recentResults.filter(
            (food) =>
              food.name.toLowerCase().includes(lowerQuery) ||
              food.brand?.toLowerCase().includes(lowerQuery)
          );
        }
        return recentResults;
      }

      default:
        return [];
    }
  }, [
    activeTab,
    debouncedQuery,
    query,
    searchQuery.data,
    customFoodsQuery.data,
    recentFoodsQuery.data,
  ]);

  // Loading State
  const isLoading =
    (activeTab === 'all' && searchQuery.isLoading) ||
    (activeTab === 'custom' && customFoodsQuery.isLoading) ||
    (activeTab === 'recent' && recentFoodsQuery.isLoading);

  // Error State
  const error =
    (activeTab === 'all' && searchQuery.error) ||
    (activeTab === 'custom' && customFoodsQuery.error) ||
    (activeTab === 'recent' && recentFoodsQuery.error);

  return {
    query,
    setQuery,
    activeTab,
    setActiveTab,
    results: getResults(),
    isLoading,
    error: error instanceof Error ? error : null,
    isSearching: activeTab === 'all' && debouncedQuery.length >= 2,
  };
}

export type { FoodSearchResult };
