/**
 * Onboarding Feature Module
 *
 * Multi-step wizard for new users to capture profile data including:
 * - Personal data (gender, birth date)
 * - Body data (height, weight)
 * - Activity level
 * - Fitness/diet goal
 *
 * Calculates TDEE and recommended daily calorie intake.
 */

// Stores
export {
  useOnboardingStore,
  type OnboardingState,
  type OnboardingStep,
  type OnboardingData,
} from './stores';

// Components
export { OnboardingProgress, OnboardingLayout } from './components';

// Screens
export { Step2BodyScreen, Step3ActivityScreen, Step4GoalScreen } from './screens';

// Services
export {
  saveOnboardingProfile,
  checkOnboardingStatus,
  fetchUserProfile,
  type OnboardingProfileData,
  type ProfileRecord,
  type SaveProfileResult,
} from './services';
