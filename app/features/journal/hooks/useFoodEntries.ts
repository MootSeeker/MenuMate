/**
 * useFoodEntries Hook
 *
 * React Query Hook für das Laden und Verwalten von Tagebuch-Einträgen
 * Implementiert Issue #29: Load Food Entries from Database
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { supabase } from '@/lib/supabase';
import {
  FoodEntry,
  FoodEntryRow,
  DailySummary,
  MealType,
  mapFoodEntryRowToFoodEntry,
  mapFoodEntryToFoodEntryRow,
  aggregateEntriesToDailySummary,
} from '../types';
import { useJournalStore } from '../stores';

/**
 * Query Key Factory für Journal-Einträge
 */
export const foodEntriesKeys = {
  all: ['food-entries'] as const,
  byDate: (date: string) => [...foodEntriesKeys.all, 'date', date] as const,
  byDateAndMeal: (date: string, mealType: MealType) =>
    [...foodEntriesKeys.byDate(date), 'meal', mealType] as const,
};

/**
 * Einträge für ein Datum laden
 */
async function fetchFoodEntries(date: string, userId: string): Promise<FoodEntry[]> {
  const { data, error } = await supabase
    .from('food_entries')
    .select('*')
    .eq('user_id', userId)
    .eq('date', date)
    .order('created_at', { ascending: true });

  if (error) {
    throw new Error(`Fehler beim Laden der Einträge: ${error.message}`);
  }

  return (data as FoodEntryRow[]).map(mapFoodEntryRowToFoodEntry);
}

/**
 * Neuen Eintrag hinzufügen
 */
async function addFoodEntry(
  entry: Omit<FoodEntry, 'id' | 'createdAt' | 'updatedAt'>
): Promise<FoodEntry> {
  const row = mapFoodEntryToFoodEntryRow(entry);

  const { data, error } = await supabase.from('food_entries').insert(row).select().single();

  if (error) {
    throw new Error(`Fehler beim Hinzufügen: ${error.message}`);
  }

  return mapFoodEntryRowToFoodEntry(data as FoodEntryRow);
}

/**
 * Eintrag aktualisieren
 */
async function updateFoodEntry(
  id: string,
  updates: Partial<Omit<FoodEntry, 'id' | 'userId' | 'createdAt' | 'updatedAt'>>
): Promise<FoodEntry> {
  // Nur die aktualisierbaren Felder konvertieren
  const updateData: Record<string, unknown> = {};

  if (updates.date !== undefined) updateData.date = updates.date;
  if (updates.mealType !== undefined) updateData.meal_type = updates.mealType;
  if (updates.name !== undefined) updateData.name = updates.name;
  if (updates.brand !== undefined) updateData.brand = updates.brand ?? null;
  if (updates.amount !== undefined) updateData.amount = updates.amount;
  if (updates.unit !== undefined) updateData.unit = updates.unit;
  if (updates.nutrition !== undefined) {
    updateData.calories = updates.nutrition.calories;
    updateData.protein = updates.nutrition.protein;
    updateData.carbs = updates.nutrition.carbs;
    updateData.fat = updates.nutrition.fat;
  }
  if (updates.imageUrl !== undefined) updateData.image_url = updates.imageUrl ?? null;
  if (updates.barcode !== undefined) updateData.barcode = updates.barcode ?? null;

  const { data, error } = await supabase
    .from('food_entries')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new Error(`Fehler beim Aktualisieren: ${error.message}`);
  }

  return mapFoodEntryRowToFoodEntry(data as FoodEntryRow);
}

/**
 * Eintrag löschen
 */
async function deleteFoodEntry(id: string): Promise<void> {
  const { error } = await supabase.from('food_entries').delete().eq('id', id);

  if (error) {
    throw new Error(`Fehler beim Löschen: ${error.message}`);
  }
}

/**
 * Hook: Einträge für das ausgewählte Datum laden
 */
export function useFoodEntries() {
  const selectedDate = useJournalStore((state) => state.selectedDate);
  const goals = useJournalStore((state) => state.goals);

  return useQuery({
    queryKey: foodEntriesKeys.byDate(selectedDate),
    queryFn: async () => {
      // User-ID aus der Session holen
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user) {
        // Wenn nicht eingeloggt, leeres Array zurückgeben
        return {
          entries: [] as FoodEntry[],
          summary: aggregateEntriesToDailySummary([], selectedDate),
          goals,
        };
      }

      const entries = await fetchFoodEntries(selectedDate, session.user.id);
      const summary = aggregateEntriesToDailySummary(entries, selectedDate);

      return {
        entries,
        summary,
        goals,
      };
    },
    staleTime: 1000 * 60 * 5, // 5 Minuten
  });
}

/**
 * Hook: Tages-Zusammenfassung
 */
export function useDailySummary(): DailySummary | undefined {
  const { data } = useFoodEntries();
  return data?.summary;
}

/**
 * Hook: Eintrag hinzufügen
 */
export function useAddFoodEntry() {
  const queryClient = useQueryClient();
  const selectedDate = useJournalStore((state) => state.selectedDate);

  return useMutation({
    mutationFn: addFoodEntry,
    onSuccess: () => {
      // Cache für das aktuelle Datum invalidieren
      queryClient.invalidateQueries({
        queryKey: foodEntriesKeys.byDate(selectedDate),
      });
    },
  });
}

/**
 * Hook: Eintrag aktualisieren
 */
export function useUpdateFoodEntry() {
  const queryClient = useQueryClient();
  const selectedDate = useJournalStore((state) => state.selectedDate);

  return useMutation({
    mutationFn: ({
      id,
      updates,
    }: {
      id: string;
      updates: Partial<Omit<FoodEntry, 'id' | 'userId' | 'createdAt' | 'updatedAt'>>;
    }) => updateFoodEntry(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: foodEntriesKeys.byDate(selectedDate),
      });
    },
  });
}

/**
 * Hook: Eintrag löschen
 */
export function useDeleteFoodEntry() {
  const queryClient = useQueryClient();
  const selectedDate = useJournalStore((state) => state.selectedDate);

  return useMutation({
    mutationFn: deleteFoodEntry,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: foodEntriesKeys.byDate(selectedDate),
      });
    },
  });
}

/**
 * Hook: Kalorien-Fortschritt berechnen
 */
export function useCalorieProgress(): {
  consumed: number;
  goal: number;
  remaining: number;
  percentage: number;
  isOverGoal: boolean;
} {
  const { data } = useFoodEntries();

  const consumed = data?.summary?.totalCalories ?? 0;
  const goal = data?.goals?.calories ?? 2000;
  const remaining = goal - consumed;
  const percentage = goal > 0 ? Math.min(100, Math.round((consumed / goal) * 100)) : 0;
  const isOverGoal = consumed > goal;

  return {
    consumed,
    goal,
    remaining,
    percentage,
    isOverGoal,
  };
}

/**
 * Hook: Makro-Fortschritt berechnen
 */
export function useMacroProgress(): {
  protein: { consumed: number; goal: number; percentage: number };
  carbs: { consumed: number; goal: number; percentage: number };
  fat: { consumed: number; goal: number; percentage: number };
} {
  const { data } = useFoodEntries();

  const summary = data?.summary;
  const goals = data?.goals;

  const calcProgress = (consumed: number, goal: number) => ({
    consumed,
    goal,
    percentage: goal > 0 ? Math.min(100, Math.round((consumed / goal) * 100)) : 0,
  });

  return {
    protein: calcProgress(summary?.totalProtein ?? 0, goals?.protein ?? 150),
    carbs: calcProgress(summary?.totalCarbs ?? 0, goals?.carbs ?? 200),
    fat: calcProgress(summary?.totalFat ?? 0, goals?.fat ?? 65),
  };
}
