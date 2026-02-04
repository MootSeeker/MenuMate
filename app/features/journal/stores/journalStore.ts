/**
 * Journal Store
 *
 * Zustand Store für das Tagebuch-Feature
 * Verwaltet das ausgewählte Datum und Nutzer-Ziele
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { NutritionGoals } from '../types';

/**
 * Hilfsfunktion: Datum auf Mitternacht setzen (lokale Zeit)
 */
function normalizeDate(date: Date): Date {
  const normalized = new Date(date);
  normalized.setHours(0, 0, 0, 0);
  return normalized;
}

/**
 * Hilfsfunktion: Datum zu String (YYYY-MM-DD)
 */
export function dateToString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Hilfsfunktion: String zu Datum
 */
export function stringToDate(dateString: string): Date {
  const [year, month, day] = dateString.split('-').map(Number);
  return new Date(year, month - 1, day);
}

/**
 * Hilfsfunktion: Prüfen ob Datum heute ist
 */
export function isToday(date: Date): boolean {
  const today = normalizeDate(new Date());
  const checkDate = normalizeDate(date);
  return today.getTime() === checkDate.getTime();
}

/**
 * Hilfsfunktion: Prüfen ob Datum in der Zukunft liegt
 */
export function isFuture(date: Date): boolean {
  const today = normalizeDate(new Date());
  const checkDate = normalizeDate(date);
  return checkDate.getTime() > today.getTime();
}

/**
 * Hilfsfunktion: Datum formatieren für Anzeige
 */
export function formatDateForDisplay(date: Date): string {
  if (isToday(date)) {
    return 'Heute';
  }

  const yesterday = normalizeDate(new Date());
  yesterday.setDate(yesterday.getDate() - 1);

  if (normalizeDate(date).getTime() === yesterday.getTime()) {
    return 'Gestern';
  }

  // Deutsches Datumsformat: "Mo, 4. Feb 2026"
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  };

  return date.toLocaleDateString('de-DE', options);
}

/**
 * Standard-Nährwertziele
 */
const DEFAULT_GOALS: NutritionGoals = {
  calories: 2000,
  protein: 150,
  carbs: 200,
  fat: 65,
};

/**
 * Journal Store State
 */
interface JournalState {
  // Ausgewähltes Datum
  selectedDate: string;

  // Nutzer-Ziele (von Profil übernommen oder manuell gesetzt)
  goals: NutritionGoals;

  // Actions
  setSelectedDate: (date: Date | string) => void;
  goToPreviousDay: () => void;
  goToNextDay: () => void;
  goToToday: () => void;
  setGoals: (goals: Partial<NutritionGoals>) => void;

  // Computed helpers
  getSelectedDate: () => Date;
  canGoToNextDay: () => boolean;
}

/**
 * Journal Store
 */
export const useJournalStore = create<JournalState>()(
  persist(
    (set, get) => ({
      // Initial state: heute
      selectedDate: dateToString(new Date()),
      goals: DEFAULT_GOALS,

      // Datum setzen
      setSelectedDate: (date: Date | string) => {
        const dateObj = typeof date === 'string' ? stringToDate(date) : date;
        const normalizedDate = normalizeDate(dateObj);

        // Keine Zukunft erlaubt
        if (isFuture(normalizedDate)) {
          return;
        }

        set({ selectedDate: dateToString(normalizedDate) });
      },

      // Einen Tag zurück
      goToPreviousDay: () => {
        const currentDate = stringToDate(get().selectedDate);
        currentDate.setDate(currentDate.getDate() - 1);
        set({ selectedDate: dateToString(currentDate) });
      },

      // Einen Tag vor (nur wenn nicht in der Zukunft)
      goToNextDay: () => {
        const currentDate = stringToDate(get().selectedDate);
        const nextDate = new Date(currentDate);
        nextDate.setDate(nextDate.getDate() + 1);

        if (!isFuture(nextDate)) {
          set({ selectedDate: dateToString(nextDate) });
        }
      },

      // Zurück zu heute
      goToToday: () => {
        set({ selectedDate: dateToString(new Date()) });
      },

      // Ziele setzen
      setGoals: (goals: Partial<NutritionGoals>) => {
        set((state) => ({
          goals: {
            ...state.goals,
            ...goals,
          },
        }));
      },

      // Computed: Date-Objekt für ausgewähltes Datum
      getSelectedDate: () => {
        return stringToDate(get().selectedDate);
      },

      // Computed: Kann zum nächsten Tag navigieren?
      canGoToNextDay: () => {
        const currentDate = stringToDate(get().selectedDate);
        const nextDate = new Date(currentDate);
        nextDate.setDate(nextDate.getDate() + 1);
        return !isFuture(nextDate);
      },
    }),
    {
      name: 'menumate-journal-store',
      storage: createJSONStorage(() => AsyncStorage),
      // Nur goals persistieren, nicht das Datum
      partialize: (state) => ({
        goals: state.goals,
      }),
    }
  )
);
