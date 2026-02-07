/**
 * Onboarding Store Tests
 *
 * Tests for the onboarding flow state management.
 */

import { act, renderHook } from '@testing-library/react-native';
import { useOnboardingStore } from '../onboardingStore';

// Mock AsyncStorage
jest.mock(
  '@react-native-async-storage/async-storage',
  () => require('../../../../__mocks__/asyncStorage').default
);

describe('useOnboardingStore', () => {
  const initialState = {
    currentStep: 1 as const,
    isCompleted: false,
    data: {
      gender: null,
      birthDate: null,
      heightCm: null,
      weightKg: null,
      activityLevel: null,
      goal: null,
      calculatedTDEE: null,
      dailyCalorieGoal: null,
    },
  };

  beforeEach(() => {
    // Reset store state before each test
    useOnboardingStore.setState(initialState);
  });

  describe('initial state', () => {
    it('should have step 1 as initial step', () => {
      const { result } = renderHook(() => useOnboardingStore());
      expect(result.current.currentStep).toBe(1);
    });

    it('should not be completed initially', () => {
      const { result } = renderHook(() => useOnboardingStore());
      expect(result.current.isCompleted).toBe(false);
    });

    it('should have all data fields as null', () => {
      const { result } = renderHook(() => useOnboardingStore());
      expect(result.current.data.gender).toBeNull();
      expect(result.current.data.birthDate).toBeNull();
      expect(result.current.data.heightCm).toBeNull();
      expect(result.current.data.weightKg).toBeNull();
      expect(result.current.data.activityLevel).toBeNull();
      expect(result.current.data.goal).toBeNull();
    });
  });

  describe('step navigation', () => {
    it('should set step directly with setStep', () => {
      const { result } = renderHook(() => useOnboardingStore());

      act(() => {
        result.current.setStep(3);
      });

      expect(result.current.currentStep).toBe(3);
    });

    it('should go to next step when data is valid', () => {
      const { result } = renderHook(() => useOnboardingStore());

      // Fill step 1 data
      act(() => {
        result.current.setGender('male');
        result.current.setBirthDate(new Date(1990, 5, 15));
      });

      act(() => {
        result.current.nextStep();
      });

      expect(result.current.currentStep).toBe(2);
    });

    it('should not go to next step when data is invalid', () => {
      const { result } = renderHook(() => useOnboardingStore());

      // Don't fill step 1 data
      act(() => {
        result.current.nextStep();
      });

      expect(result.current.currentStep).toBe(1);
    });

    it('should not go beyond step 4', () => {
      const { result } = renderHook(() => useOnboardingStore());

      act(() => {
        result.current.setStep(4);
      });

      act(() => {
        result.current.setGoal('maintain');
        result.current.nextStep();
      });

      expect(result.current.currentStep).toBe(4);
    });

    it('should go to previous step', () => {
      const { result } = renderHook(() => useOnboardingStore());

      act(() => {
        result.current.setStep(3);
      });

      act(() => {
        result.current.prevStep();
      });

      expect(result.current.currentStep).toBe(2);
    });

    it('should not go below step 1', () => {
      const { result } = renderHook(() => useOnboardingStore());

      act(() => {
        result.current.prevStep();
      });

      expect(result.current.currentStep).toBe(1);
    });
  });

  describe('data setters', () => {
    it('should set gender', () => {
      const { result } = renderHook(() => useOnboardingStore());

      act(() => {
        result.current.setGender('female');
      });

      expect(result.current.data.gender).toBe('female');
    });

    it('should set birth date', () => {
      const { result } = renderHook(() => useOnboardingStore());
      const birthDate = new Date(1995, 2, 20);

      act(() => {
        result.current.setBirthDate(birthDate);
      });

      expect(result.current.data.birthDate).toEqual(birthDate);
    });

    it('should set body data', () => {
      const { result } = renderHook(() => useOnboardingStore());

      act(() => {
        result.current.setBodyData(175, 70);
      });

      expect(result.current.data.heightCm).toBe(175);
      expect(result.current.data.weightKg).toBe(70);
    });

    it('should set activity level', () => {
      const { result } = renderHook(() => useOnboardingStore());

      act(() => {
        result.current.setActivityLevel('moderately_active');
      });

      expect(result.current.data.activityLevel).toBe('moderately_active');
    });

    it('should set goal', () => {
      const { result } = renderHook(() => useOnboardingStore());

      act(() => {
        result.current.setGoal('lose');
      });

      expect(result.current.data.goal).toBe('lose');
    });

    it('should set calculated values', () => {
      const { result } = renderHook(() => useOnboardingStore());

      act(() => {
        result.current.setCalculatedValues(2200, 1800);
      });

      expect(result.current.data.calculatedTDEE).toBe(2200);
      expect(result.current.data.dailyCalorieGoal).toBe(1800);
    });
  });

  describe('canProceedFromStep', () => {
    it('should return false for step 1 without gender and birthDate', () => {
      const { result } = renderHook(() => useOnboardingStore());
      expect(result.current.canProceedFromStep(1)).toBe(false);
    });

    it('should return true for step 1 with gender and birthDate', () => {
      const { result } = renderHook(() => useOnboardingStore());

      act(() => {
        result.current.setGender('male');
        result.current.setBirthDate(new Date(1990, 0, 1));
      });

      expect(result.current.canProceedFromStep(1)).toBe(true);
    });

    it('should return false for step 2 without body data', () => {
      const { result } = renderHook(() => useOnboardingStore());
      expect(result.current.canProceedFromStep(2)).toBe(false);
    });

    it('should return true for step 2 with body data', () => {
      const { result } = renderHook(() => useOnboardingStore());

      act(() => {
        result.current.setBodyData(180, 80);
      });

      expect(result.current.canProceedFromStep(2)).toBe(true);
    });

    it('should return false for step 3 without activity level', () => {
      const { result } = renderHook(() => useOnboardingStore());
      expect(result.current.canProceedFromStep(3)).toBe(false);
    });

    it('should return true for step 3 with activity level', () => {
      const { result } = renderHook(() => useOnboardingStore());

      act(() => {
        result.current.setActivityLevel('very_active');
      });

      expect(result.current.canProceedFromStep(3)).toBe(true);
    });

    it('should return false for step 4 without goal', () => {
      const { result } = renderHook(() => useOnboardingStore());
      expect(result.current.canProceedFromStep(4)).toBe(false);
    });

    it('should return true for step 4 with goal', () => {
      const { result } = renderHook(() => useOnboardingStore());

      act(() => {
        result.current.setGoal('gain');
      });

      expect(result.current.canProceedFromStep(4)).toBe(true);
    });
  });

  describe('getAge', () => {
    it('should return null when no birth date is set', () => {
      const { result } = renderHook(() => useOnboardingStore());
      expect(result.current.getAge()).toBeNull();
    });

    it('should calculate age correctly', () => {
      const { result } = renderHook(() => useOnboardingStore());

      // Set birthdate to exactly 30 years ago
      const thirtyYearsAgo = new Date();
      thirtyYearsAgo.setFullYear(thirtyYearsAgo.getFullYear() - 30);
      thirtyYearsAgo.setMonth(0); // January
      thirtyYearsAgo.setDate(1);

      act(() => {
        result.current.setBirthDate(thirtyYearsAgo);
      });

      const age = result.current.getAge();
      expect(age).toBeGreaterThanOrEqual(29);
      expect(age).toBeLessThanOrEqual(31);
    });

    it('should handle birthday not yet passed this year', () => {
      const { result } = renderHook(() => useOnboardingStore());

      // Set birthdate to later this year (or next year if late in year)
      const futureThisYear = new Date();
      futureThisYear.setFullYear(futureThisYear.getFullYear() - 25);
      futureThisYear.setMonth(11); // December
      futureThisYear.setDate(31);

      act(() => {
        result.current.setBirthDate(futureThisYear);
      });

      const age = result.current.getAge();
      expect(age).toBeGreaterThanOrEqual(24);
      expect(age).toBeLessThanOrEqual(25);
    });
  });

  describe('flow control', () => {
    it('should complete onboarding', () => {
      const { result } = renderHook(() => useOnboardingStore());

      act(() => {
        result.current.completeOnboarding();
      });

      expect(result.current.isCompleted).toBe(true);
    });

    it('should reset onboarding', () => {
      const { result } = renderHook(() => useOnboardingStore());

      // Set some data
      act(() => {
        result.current.setGender('male');
        result.current.setBodyData(180, 80);
        result.current.setStep(3);
        result.current.completeOnboarding();
      });

      // Reset
      act(() => {
        result.current.resetOnboarding();
      });

      expect(result.current.currentStep).toBe(1);
      expect(result.current.isCompleted).toBe(false);
      expect(result.current.data.gender).toBeNull();
      expect(result.current.data.heightCm).toBeNull();
    });
  });

  describe('full onboarding flow', () => {
    it('should complete entire onboarding flow', () => {
      const { result } = renderHook(() => useOnboardingStore());

      // Step 1: Personal Data
      act(() => {
        result.current.setGender('male');
        result.current.setBirthDate(new Date(1990, 5, 15));
        result.current.nextStep();
      });
      expect(result.current.currentStep).toBe(2);

      // Step 2: Body Data
      act(() => {
        result.current.setBodyData(178, 75);
        result.current.nextStep();
      });
      expect(result.current.currentStep).toBe(3);

      // Step 3: Activity Level
      act(() => {
        result.current.setActivityLevel('moderately_active');
        result.current.nextStep();
      });
      expect(result.current.currentStep).toBe(4);

      // Step 4: Goal
      act(() => {
        result.current.setGoal('maintain');
        result.current.setCalculatedValues(2400, 2400);
        result.current.completeOnboarding();
      });

      expect(result.current.isCompleted).toBe(true);
      expect(result.current.data).toEqual({
        gender: 'male',
        birthDate: expect.any(Date),
        heightCm: 178,
        weightKg: 75,
        activityLevel: 'moderately_active',
        goal: 'maintain',
        calculatedTDEE: 2400,
        dailyCalorieGoal: 2400,
      });
    });
  });
});
