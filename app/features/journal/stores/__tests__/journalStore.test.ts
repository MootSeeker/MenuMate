/**
 * Journal Store Tests
 *
 * Tests for the journal store managing date selection and nutrition goals.
 */

import { act, renderHook } from '@testing-library/react-native';
import {
  useJournalStore,
  dateToString,
  stringToDate,
  isToday,
  isFuture,
  formatDateForDisplay,
} from '../journalStore';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () =>
  require('../../../../__mocks__/asyncStorage').default
);

describe('Journal Store Helper Functions', () => {
  describe('dateToString', () => {
    it('should convert date to YYYY-MM-DD format', () => {
      const date = new Date(2026, 1, 6); // Feb 6, 2026
      expect(dateToString(date)).toBe('2026-02-06');
    });

    it('should pad single digit months and days', () => {
      const date = new Date(2026, 0, 5); // Jan 5, 2026
      expect(dateToString(date)).toBe('2026-01-05');
    });
  });

  describe('stringToDate', () => {
    it('should convert YYYY-MM-DD string to Date', () => {
      const result = stringToDate('2026-02-06');
      expect(result.getFullYear()).toBe(2026);
      expect(result.getMonth()).toBe(1); // 0-indexed
      expect(result.getDate()).toBe(6);
    });
  });

  describe('isToday', () => {
    it('should return true for current date', () => {
      expect(isToday(new Date())).toBe(true);
    });

    it('should return false for yesterday', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      expect(isToday(yesterday)).toBe(false);
    });

    it('should return false for tomorrow', () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      expect(isToday(tomorrow)).toBe(false);
    });
  });

  describe('isFuture', () => {
    it('should return false for today', () => {
      expect(isFuture(new Date())).toBe(false);
    });

    it('should return false for yesterday', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      expect(isFuture(yesterday)).toBe(false);
    });

    it('should return true for tomorrow', () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      expect(isFuture(tomorrow)).toBe(true);
    });
  });

  describe('formatDateForDisplay', () => {
    it('should return "Heute" for today', () => {
      expect(formatDateForDisplay(new Date())).toBe('Heute');
    });

    it('should return "Gestern" for yesterday', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      expect(formatDateForDisplay(yesterday)).toBe('Gestern');
    });

    it('should return formatted date for other days', () => {
      const pastDate = new Date(2026, 0, 15); // Jan 15, 2026
      const result = formatDateForDisplay(pastDate);
      // Should include day, month, year in German format
      expect(result).toContain('Jan');
      expect(result).toContain('2026');
    });
  });
});

describe('useJournalStore', () => {
  beforeEach(() => {
    // Reset store state before each test
    useJournalStore.setState({
      selectedDate: dateToString(new Date()),
      goals: {
        calories: 2000,
        protein: 150,
        carbs: 200,
        fat: 65,
      },
    });
  });

  describe('initial state', () => {
    it('should have today as selected date', () => {
      const { result } = renderHook(() => useJournalStore());
      expect(result.current.selectedDate).toBe(dateToString(new Date()));
    });

    it('should have default nutrition goals', () => {
      const { result } = renderHook(() => useJournalStore());
      expect(result.current.goals).toEqual({
        calories: 2000,
        protein: 150,
        carbs: 200,
        fat: 65,
      });
    });
  });

  describe('setSelectedDate', () => {
    it('should set date when given a Date object', () => {
      const { result } = renderHook(() => useJournalStore());
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 5);

      act(() => {
        result.current.setSelectedDate(pastDate);
      });

      expect(result.current.selectedDate).toBe(dateToString(pastDate));
    });

    it('should set date when given a string', () => {
      const { result } = renderHook(() => useJournalStore());
      const dateString = '2026-01-15';

      act(() => {
        result.current.setSelectedDate(dateString);
      });

      expect(result.current.selectedDate).toBe(dateString);
    });

    it('should not allow future dates', () => {
      const { result } = renderHook(() => useJournalStore());
      const originalDate = result.current.selectedDate;
      
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 5);

      act(() => {
        result.current.setSelectedDate(futureDate);
      });

      // Should remain unchanged
      expect(result.current.selectedDate).toBe(originalDate);
    });
  });

  describe('goToPreviousDay', () => {
    it('should navigate to previous day', () => {
      const { result } = renderHook(() => useJournalStore());
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      act(() => {
        result.current.goToPreviousDay();
      });

      expect(result.current.selectedDate).toBe(dateToString(yesterday));
    });

    it('should allow navigating far into the past', () => {
      const { result } = renderHook(() => useJournalStore());

      act(() => {
        for (let i = 0; i < 100; i++) {
          result.current.goToPreviousDay();
        }
      });

      const date = result.current.getSelectedDate();
      expect(isFuture(date)).toBe(false);
    });
  });

  describe('goToNextDay', () => {
    it('should navigate to next day when not at today', () => {
      const { result } = renderHook(() => useJournalStore());

      // First go back a few days
      act(() => {
        result.current.goToPreviousDay();
        result.current.goToPreviousDay();
      });

      const dateBeforeNext = result.current.selectedDate;

      act(() => {
        result.current.goToNextDay();
      });

      // Should have moved forward one day
      expect(result.current.selectedDate).not.toBe(dateBeforeNext);
    });

    it('should not navigate beyond today', () => {
      const { result } = renderHook(() => useJournalStore());
      const today = dateToString(new Date());

      act(() => {
        result.current.goToNextDay();
      });

      expect(result.current.selectedDate).toBe(today);
    });
  });

  describe('goToToday', () => {
    it('should navigate back to today from past date', () => {
      const { result } = renderHook(() => useJournalStore());
      const today = dateToString(new Date());

      // Go back several days
      act(() => {
        result.current.goToPreviousDay();
        result.current.goToPreviousDay();
        result.current.goToPreviousDay();
      });

      expect(result.current.selectedDate).not.toBe(today);

      act(() => {
        result.current.goToToday();
      });

      expect(result.current.selectedDate).toBe(today);
    });
  });

  describe('setGoals', () => {
    it('should update partial goals', () => {
      const { result } = renderHook(() => useJournalStore());

      act(() => {
        result.current.setGoals({ calories: 2500 });
      });

      expect(result.current.goals.calories).toBe(2500);
      expect(result.current.goals.protein).toBe(150); // unchanged
    });

    it('should update multiple goals at once', () => {
      const { result } = renderHook(() => useJournalStore());

      act(() => {
        result.current.setGoals({
          calories: 1800,
          protein: 120,
          carbs: 180,
          fat: 60,
        });
      });

      expect(result.current.goals).toEqual({
        calories: 1800,
        protein: 120,
        carbs: 180,
        fat: 60,
      });
    });
  });

  describe('canGoToNextDay', () => {
    it('should return false when at today', () => {
      const { result } = renderHook(() => useJournalStore());
      expect(result.current.canGoToNextDay()).toBe(false);
    });

    it('should return true when in the past', () => {
      const { result } = renderHook(() => useJournalStore());

      act(() => {
        result.current.goToPreviousDay();
      });

      expect(result.current.canGoToNextDay()).toBe(true);
    });
  });

  describe('getSelectedDate', () => {
    it('should return Date object for selected date', () => {
      const { result } = renderHook(() => useJournalStore());
      const date = result.current.getSelectedDate();

      expect(date).toBeInstanceOf(Date);
      expect(isToday(date)).toBe(true);
    });
  });
});
