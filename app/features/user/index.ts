/**
 * User Feature Module
 *
 * Contains user profile management, settings, and TDEE calculations.
 */

// Utils
export {
  calculateBMR,
  calculateTDEE,
  calculateGoalCalories,
  calculateAllCalories,
  calculateMacros,
  ACTIVITY_MULTIPLIERS,
  GOAL_ADJUSTMENTS,
  VALIDATION,
  type Gender,
  type ActivityLevel,
  type Goal,
  type BMRParams,
  type TDEEParams,
  type GoalCaloriesParams,
  type CalorieCalculationResult,
  type MacroDistribution,
} from './utils';

// Screens
export { ProfileScreen, EditGoalsScreen } from './screens';
