/**
 * TDEE (Total Daily Energy Expenditure) Calculation Module
 *
 * This module implements the Mifflin-St Jeor equation for calculating
 * Basal Metabolic Rate (BMR) and Total Daily Energy Expenditure (TDEE).
 *
 * The Mifflin-St Jeor equation is considered one of the most accurate
 * formulas for estimating BMR in healthy adults.
 */

// ============================================
// TYPES
// ============================================

export type Gender = 'male' | 'female' | 'diverse';

export type ActivityLevel =
  | 'sedentary'
  | 'lightly_active'
  | 'moderately_active'
  | 'very_active'
  | 'extremely_active';

export type Goal = 'lose' | 'maintain' | 'gain';

export interface BMRParams {
  /** Weight in kilograms */
  weightKg: number;
  /** Height in centimeters */
  heightCm: number;
  /** Age in years */
  age: number;
  /** Gender for BMR calculation */
  gender: Gender;
}

export interface TDEEParams extends BMRParams {
  /** Daily activity level */
  activityLevel: ActivityLevel;
}

export interface GoalCaloriesParams extends TDEEParams {
  /** Weight/fitness goal */
  goal: Goal;
}

export interface CalorieCalculationResult {
  /** Basal Metabolic Rate in kcal */
  bmr: number;
  /** Total Daily Energy Expenditure in kcal */
  tdee: number;
  /** Goal-adjusted calories in kcal */
  goalCalories: number;
  /** Activity level multiplier used */
  activityMultiplier: number;
  /** Calorie adjustment based on goal */
  goalAdjustment: number;
}

// ============================================
// CONSTANTS
// ============================================

/**
 * Activity level multipliers for TDEE calculation
 * Based on the Harris-Benedict activity factors
 */
export const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, number> = {
  sedentary: 1.2, // Little or no exercise, desk job
  lightly_active: 1.375, // Light exercise 1-3 days/week
  moderately_active: 1.55, // Moderate exercise 3-5 days/week
  very_active: 1.725, // Intense exercise 6-7 days/week
  extremely_active: 1.9, // Very intense exercise, physical labor
};

/**
 * Calorie adjustments based on weight goal
 * These values represent a safe and sustainable rate of weight change
 */
export const GOAL_ADJUSTMENTS: Record<Goal, number> = {
  lose: -500, // ~0.5kg/week loss
  maintain: 0, // No change
  gain: 300, // ~0.3kg/week gain (lean muscle focus)
};

/**
 * Validation constraints
 */
export const VALIDATION = {
  MIN_WEIGHT_KG: 30,
  MAX_WEIGHT_KG: 300,
  MIN_HEIGHT_CM: 100,
  MAX_HEIGHT_CM: 250,
  MIN_AGE: 13,
  MAX_AGE: 120,
  MIN_BMR: 500,
  MAX_BMR: 5000,
  MIN_TDEE: 800,
  MAX_TDEE: 10000,
  MIN_GOAL_CALORIES: 1200, // Minimum safe intake
  MAX_GOAL_CALORIES: 10000,
};

// ============================================
// VALIDATION
// ============================================

/**
 * Validates BMR input parameters
 * @throws Error if any parameter is out of valid range
 */
export function validateBMRParams(params: BMRParams): void {
  const { weightKg, heightCm, age, gender } = params;

  if (weightKg < VALIDATION.MIN_WEIGHT_KG || weightKg > VALIDATION.MAX_WEIGHT_KG) {
    throw new Error(
      `Weight must be between ${VALIDATION.MIN_WEIGHT_KG} and ${VALIDATION.MAX_WEIGHT_KG} kg`
    );
  }

  if (heightCm < VALIDATION.MIN_HEIGHT_CM || heightCm > VALIDATION.MAX_HEIGHT_CM) {
    throw new Error(
      `Height must be between ${VALIDATION.MIN_HEIGHT_CM} and ${VALIDATION.MAX_HEIGHT_CM} cm`
    );
  }

  if (age < VALIDATION.MIN_AGE || age > VALIDATION.MAX_AGE) {
    throw new Error(`Age must be between ${VALIDATION.MIN_AGE} and ${VALIDATION.MAX_AGE} years`);
  }

  if (!['male', 'female', 'diverse'].includes(gender)) {
    throw new Error('Gender must be "male", "female", or "diverse"');
  }
}

// ============================================
// CALCULATION FUNCTIONS
// ============================================

/**
 * Calculates Basal Metabolic Rate (BMR) using the Mifflin-St Jeor equation
 *
 * Formula:
 * - Men: BMR = 10 × weight(kg) + 6.25 × height(cm) - 5 × age + 5
 * - Women: BMR = 10 × weight(kg) + 6.25 × height(cm) - 5 × age - 161
 * - Diverse: Uses average of male and female formulas
 *
 * @param params - BMR calculation parameters
 * @returns BMR in kcal/day, rounded to nearest integer
 */
export function calculateBMR(params: BMRParams): number {
  validateBMRParams(params);

  const { weightKg, heightCm, age, gender } = params;

  // Base calculation (common to all genders)
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age;

  let bmr: number;

  switch (gender) {
    case 'male':
      bmr = base + 5;
      break;
    case 'female':
      bmr = base - 161;
      break;
    case 'diverse':
      // Use average of male and female formulas
      bmr = base + (5 - 161) / 2; // base - 78
      break;
    default:
      throw new Error(`Invalid gender: ${gender}`);
  }

  // Round to nearest integer
  bmr = Math.round(bmr);

  // Clamp to valid range
  return Math.max(VALIDATION.MIN_BMR, Math.min(VALIDATION.MAX_BMR, bmr));
}

/**
 * Calculates Total Daily Energy Expenditure (TDEE)
 *
 * TDEE = BMR × Activity Multiplier
 *
 * @param bmr - Basal Metabolic Rate in kcal
 * @param activityLevel - Daily activity level
 * @returns TDEE in kcal/day, rounded to nearest integer
 */
export function calculateTDEE(bmr: number, activityLevel: ActivityLevel): number {
  const multiplier = ACTIVITY_MULTIPLIERS[activityLevel];

  if (multiplier === undefined) {
    throw new Error(`Invalid activity level: ${activityLevel}`);
  }

  const tdee = Math.round(bmr * multiplier);

  // Clamp to valid range
  return Math.max(VALIDATION.MIN_TDEE, Math.min(VALIDATION.MAX_TDEE, tdee));
}

/**
 * Calculates goal-adjusted calories based on weight goal
 *
 * @param tdee - Total Daily Energy Expenditure in kcal
 * @param goal - Weight/fitness goal
 * @returns Goal-adjusted calories in kcal/day
 */
export function calculateGoalCalories(tdee: number, goal: Goal): number {
  const adjustment = GOAL_ADJUSTMENTS[goal];

  if (adjustment === undefined) {
    throw new Error(`Invalid goal: ${goal}`);
  }

  const goalCalories = tdee + adjustment;

  // Ensure minimum safe intake
  return Math.max(
    VALIDATION.MIN_GOAL_CALORIES,
    Math.min(VALIDATION.MAX_GOAL_CALORIES, goalCalories)
  );
}

/**
 * Calculates all calorie metrics in one call
 *
 * This is a convenience function that calculates BMR, TDEE, and goal calories
 * all at once and returns a comprehensive result object.
 *
 * @param params - All calculation parameters
 * @returns Complete calorie calculation result
 */
export function calculateAllCalories(params: GoalCaloriesParams): CalorieCalculationResult {
  const { weightKg, heightCm, age, gender, activityLevel, goal } = params;

  const bmr = calculateBMR({ weightKg, heightCm, age, gender });
  const tdee = calculateTDEE(bmr, activityLevel);
  const goalCalories = calculateGoalCalories(tdee, goal);

  return {
    bmr,
    tdee,
    goalCalories,
    activityMultiplier: ACTIVITY_MULTIPLIERS[activityLevel],
    goalAdjustment: GOAL_ADJUSTMENTS[goal],
  };
}

/**
 * Helper function to calculate age from birth date
 *
 * @param birthDate - Date of birth
 * @param referenceDate - Reference date (defaults to today)
 * @returns Age in years
 */
export function calculateAge(birthDate: Date, referenceDate: Date = new Date()): number {
  let age = referenceDate.getFullYear() - birthDate.getFullYear();
  const monthDiff = referenceDate.getMonth() - birthDate.getMonth();

  // Adjust if birthday hasn't occurred yet this year
  if (monthDiff < 0 || (monthDiff === 0 && referenceDate.getDate() < birthDate.getDate())) {
    age--;
  }

  return age;
}

/**
 * Calculates suggested macro distribution based on goal
 *
 * Returns recommended percentages and grams for protein, carbs, and fat
 *
 * @param goalCalories - Target daily calories
 * @param weightKg - Body weight in kg (for protein calculation)
 * @param goal - Weight/fitness goal
 * @returns Macro distribution in grams
 */
export function calculateMacros(
  goalCalories: number,
  weightKg: number,
  goal: Goal
): { proteinG: number; carbsG: number; fatG: number } {
  // Protein: 1.6-2.2g per kg body weight depending on goal
  // Higher protein for muscle building/preservation
  const proteinMultiplier = goal === 'gain' ? 2.0 : goal === 'lose' ? 1.8 : 1.6;
  const proteinG = Math.round(weightKg * proteinMultiplier);
  const proteinCalories = proteinG * 4;

  // Fat: 25-30% of calories (higher end for weight loss for satiety)
  const fatPercent = goal === 'lose' ? 0.3 : 0.25;
  const fatCalories = goalCalories * fatPercent;
  const fatG = Math.round(fatCalories / 9);

  // Carbs: Remaining calories
  const carbsCalories = goalCalories - proteinCalories - fatCalories;
  const carbsG = Math.round(Math.max(0, carbsCalories) / 4);

  return { proteinG, carbsG, fatG };
}
