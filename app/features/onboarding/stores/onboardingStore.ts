/**
 * Onboarding Store
 *
 * Manages the state of the onboarding flow including:
 * - Current step tracking
 * - User data collection across steps
 * - Persistence for resuming interrupted flows
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { ActivityLevel, Gender, Goal } from '@/features/user/utils';

// ============================================
// TYPES
// ============================================

export type OnboardingStep = 1 | 2 | 3 | 4;

export interface OnboardingData {
  // Step 1: Personal Data
  gender: Gender | null;
  birthDate: Date | null;

  // Step 2: Body Data
  heightCm: number | null;
  weightKg: number | null;

  // Step 3: Activity Level
  activityLevel: ActivityLevel | null;

  // Step 4: Goal
  goal: Goal | null;

  // Calculated values (set in step 4)
  calculatedTDEE: number | null;
  dailyCalorieGoal: number | null;
}

export interface OnboardingState {
  // Flow state
  currentStep: OnboardingStep;
  isCompleted: boolean;

  // Collected data
  data: OnboardingData;

  // Actions
  setStep: (step: OnboardingStep) => void;
  nextStep: () => void;
  prevStep: () => void;

  // Data setters
  setGender: (gender: Gender) => void;
  setBirthDate: (date: Date) => void;
  setBodyData: (heightCm: number, weightKg: number) => void;
  setActivityLevel: (level: ActivityLevel) => void;
  setGoal: (goal: Goal) => void;
  setCalculatedValues: (tdee: number, goalCalories: number) => void;

  // Flow control
  completeOnboarding: () => void;
  resetOnboarding: () => void;

  // Computed helpers
  canProceedFromStep: (step: OnboardingStep) => boolean;
  getAge: () => number | null;
}

// ============================================
// INITIAL STATE
// ============================================

const initialData: OnboardingData = {
  gender: null,
  birthDate: null,
  heightCm: null,
  weightKg: null,
  activityLevel: null,
  goal: null,
  calculatedTDEE: null,
  dailyCalorieGoal: null,
};

// ============================================
// STORE
// ============================================

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set, get) => ({
      // Initial state
      currentStep: 1,
      isCompleted: false,
      data: initialData,

      // Step navigation
      setStep: (step) => set({ currentStep: step }),

      nextStep: () => {
        const { currentStep, canProceedFromStep } = get();
        if (canProceedFromStep(currentStep) && currentStep < 4) {
          set({ currentStep: (currentStep + 1) as OnboardingStep });
        }
      },

      prevStep: () => {
        const { currentStep } = get();
        if (currentStep > 1) {
          set({ currentStep: (currentStep - 1) as OnboardingStep });
        }
      },

      // Data setters
      setGender: (gender) =>
        set((state) => ({
          data: { ...state.data, gender },
        })),

      setBirthDate: (date) =>
        set((state) => ({
          data: { ...state.data, birthDate: date },
        })),

      setBodyData: (heightCm, weightKg) =>
        set((state) => ({
          data: { ...state.data, heightCm, weightKg },
        })),

      setActivityLevel: (activityLevel) =>
        set((state) => ({
          data: { ...state.data, activityLevel },
        })),

      setGoal: (goal) =>
        set((state) => ({
          data: { ...state.data, goal },
        })),

      setCalculatedValues: (tdee, goalCalories) =>
        set((state) => ({
          data: {
            ...state.data,
            calculatedTDEE: tdee,
            dailyCalorieGoal: goalCalories,
          },
        })),

      // Flow control
      completeOnboarding: () => set({ isCompleted: true }),

      resetOnboarding: () =>
        set({
          currentStep: 1,
          isCompleted: false,
          data: initialData,
        }),

      // Validation helpers
      canProceedFromStep: (step) => {
        const { data } = get();

        switch (step) {
          case 1:
            return data.gender !== null && data.birthDate !== null;
          case 2:
            return data.heightCm !== null && data.weightKg !== null;
          case 3:
            return data.activityLevel !== null;
          case 4:
            return data.goal !== null;
          default:
            return false;
        }
      },

      getAge: () => {
        const { data } = get();
        if (!data.birthDate) return null;

        const today = new Date();
        const birthDate = new Date(data.birthDate);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();

        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
          age--;
        }

        return age;
      },
    }),
    {
      name: 'menumate-onboarding',
      storage: createJSONStorage(() => AsyncStorage),
      // Custom serialization for Date objects
      partialize: (state) => ({
        currentStep: state.currentStep,
        isCompleted: state.isCompleted,
        data: {
          ...state.data,
          // Convert Date to ISO string for storage
          birthDate: state.data.birthDate?.toISOString() ?? null,
        },
      }),
      // Custom deserialization
      onRehydrateStorage: () => (state) => {
        if (state?.data.birthDate) {
          // Convert ISO string back to Date
          state.data.birthDate = new Date(state.data.birthDate as unknown as string);
        }
      },
    }
  )
);
