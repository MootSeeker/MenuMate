/**
 * Unit tests for TDEE Calculation Module
 *
 * Tests cover:
 * - BMR calculation for all genders
 * - TDEE calculation with all activity levels
 * - Goal calorie adjustments
 * - Edge cases and validation
 * - Age calculation from birth date
 * - Macro distribution
 */

import {
  calculateBMR,
  calculateTDEE,
  calculateGoalCalories,
  calculateAllCalories,
  calculateAge,
  calculateMacros,
  validateBMRParams,
  ACTIVITY_MULTIPLIERS,
  GOAL_ADJUSTMENTS,
  VALIDATION,
  type BMRParams,
  type ActivityLevel,
  type Goal,
} from '../calculateTDEE';

describe('TDEE Calculation Module', () => {
  // ============================================
  // BMR CALCULATION TESTS
  // ============================================

  describe('calculateBMR', () => {
    describe('Male calculations', () => {
      it('calculates BMR for average adult male', () => {
        // 30 year old, 80kg, 180cm male
        // Expected: 10*80 + 6.25*180 - 5*30 + 5 = 800 + 1125 - 150 + 5 = 1780
        const bmr = calculateBMR({
          weightKg: 80,
          heightCm: 180,
          age: 30,
          gender: 'male',
        });

        expect(bmr).toBe(1780);
      });

      it('calculates BMR for young athletic male', () => {
        // 25 year old, 75kg, 175cm male
        // Expected: 10*75 + 6.25*175 - 5*25 + 5 = 750 + 1093.75 - 125 + 5 = 1724
        const bmr = calculateBMR({
          weightKg: 75,
          heightCm: 175,
          age: 25,
          gender: 'male',
        });

        expect(bmr).toBe(1724);
      });

      it('calculates BMR for older male', () => {
        // 60 year old, 85kg, 170cm male
        // Expected: 10*85 + 6.25*170 - 5*60 + 5 = 850 + 1062.5 - 300 + 5 = 1618
        const bmr = calculateBMR({
          weightKg: 85,
          heightCm: 170,
          age: 60,
          gender: 'male',
        });

        expect(bmr).toBe(1618);
      });
    });

    describe('Female calculations', () => {
      it('calculates BMR for average adult female', () => {
        // 30 year old, 65kg, 165cm female
        // Expected: 10*65 + 6.25*165 - 5*30 - 161 = 650 + 1031.25 - 150 - 161 = 1370
        const bmr = calculateBMR({
          weightKg: 65,
          heightCm: 165,
          age: 30,
          gender: 'female',
        });

        expect(bmr).toBe(1370);
      });

      it('calculates BMR for young athletic female', () => {
        // 25 year old, 60kg, 170cm female
        // Expected: 10*60 + 6.25*170 - 5*25 - 161 = 600 + 1062.5 - 125 - 161 = 1377
        const bmr = calculateBMR({
          weightKg: 60,
          heightCm: 170,
          age: 25,
          gender: 'female',
        });

        expect(bmr).toBe(1377);
      });

      it('calculates BMR for older female', () => {
        // 55 year old, 70kg, 160cm female
        // Expected: 10*70 + 6.25*160 - 5*55 - 161 = 700 + 1000 - 275 - 161 = 1264
        const bmr = calculateBMR({
          weightKg: 70,
          heightCm: 160,
          age: 55,
          gender: 'female',
        });

        expect(bmr).toBe(1264);
      });
    });

    describe('Diverse gender calculations', () => {
      it('calculates BMR for diverse gender (average of male/female)', () => {
        // 30 year old, 70kg, 170cm diverse
        // Male: 10*70 + 6.25*170 - 5*30 + 5 = 700 + 1062.5 - 150 + 5 = 1618
        // Female: 10*70 + 6.25*170 - 5*30 - 161 = 700 + 1062.5 - 150 - 161 = 1452
        // Average: (1618 + 1452) / 2 = 1535
        // Using formula: base + (5-161)/2 = base - 78 = 1612.5 - 78 = 1535
        const bmr = calculateBMR({
          weightKg: 70,
          heightCm: 170,
          age: 30,
          gender: 'diverse',
        });

        expect(bmr).toBe(1535);
      });
    });

    describe('Edge cases', () => {
      it('clamps extremely low BMR to minimum', () => {
        // Very small/young person - should be clamped
        const bmr = calculateBMR({
          weightKg: 30,
          heightCm: 100,
          age: 13,
          gender: 'female',
        });

        expect(bmr).toBeGreaterThanOrEqual(VALIDATION.MIN_BMR);
      });

      it('handles minimum valid values', () => {
        const bmr = calculateBMR({
          weightKg: VALIDATION.MIN_WEIGHT_KG,
          heightCm: VALIDATION.MIN_HEIGHT_CM,
          age: VALIDATION.MIN_AGE,
          gender: 'male',
        });

        expect(bmr).toBeGreaterThanOrEqual(VALIDATION.MIN_BMR);
        expect(bmr).toBeLessThanOrEqual(VALIDATION.MAX_BMR);
      });

      it('handles maximum valid values', () => {
        const bmr = calculateBMR({
          weightKg: VALIDATION.MAX_WEIGHT_KG,
          heightCm: VALIDATION.MAX_HEIGHT_CM,
          age: VALIDATION.MAX_AGE,
          gender: 'male',
        });

        expect(bmr).toBeGreaterThanOrEqual(VALIDATION.MIN_BMR);
        expect(bmr).toBeLessThanOrEqual(VALIDATION.MAX_BMR);
      });
    });
  });

  // ============================================
  // VALIDATION TESTS
  // ============================================

  describe('validateBMRParams', () => {
    it('throws error for weight below minimum', () => {
      expect(() =>
        validateBMRParams({
          weightKg: 20,
          heightCm: 170,
          age: 30,
          gender: 'male',
        })
      ).toThrow(/Weight must be between/);
    });

    it('throws error for weight above maximum', () => {
      expect(() =>
        validateBMRParams({
          weightKg: 400,
          heightCm: 170,
          age: 30,
          gender: 'male',
        })
      ).toThrow(/Weight must be between/);
    });

    it('throws error for height below minimum', () => {
      expect(() =>
        validateBMRParams({
          weightKg: 70,
          heightCm: 50,
          age: 30,
          gender: 'male',
        })
      ).toThrow(/Height must be between/);
    });

    it('throws error for height above maximum', () => {
      expect(() =>
        validateBMRParams({
          weightKg: 70,
          heightCm: 300,
          age: 30,
          gender: 'male',
        })
      ).toThrow(/Height must be between/);
    });

    it('throws error for age below minimum', () => {
      expect(() =>
        validateBMRParams({
          weightKg: 70,
          heightCm: 170,
          age: 10,
          gender: 'male',
        })
      ).toThrow(/Age must be between/);
    });

    it('throws error for age above maximum', () => {
      expect(() =>
        validateBMRParams({
          weightKg: 70,
          heightCm: 170,
          age: 150,
          gender: 'male',
        })
      ).toThrow(/Age must be between/);
    });

    it('throws error for invalid gender', () => {
      expect(() =>
        validateBMRParams({
          weightKg: 70,
          heightCm: 170,
          age: 30,
          gender: 'invalid' as BMRParams['gender'],
        })
      ).toThrow(/Gender must be/);
    });

    it('passes validation for valid params', () => {
      expect(() =>
        validateBMRParams({
          weightKg: 70,
          heightCm: 170,
          age: 30,
          gender: 'male',
        })
      ).not.toThrow();
    });
  });

  // ============================================
  // TDEE CALCULATION TESTS
  // ============================================

  describe('calculateTDEE', () => {
    const baseBMR = 1700;

    it('calculates TDEE for sedentary activity', () => {
      const tdee = calculateTDEE(baseBMR, 'sedentary');
      expect(tdee).toBe(Math.round(baseBMR * 1.2)); // 2040
    });

    it('calculates TDEE for lightly active', () => {
      const tdee = calculateTDEE(baseBMR, 'lightly_active');
      expect(tdee).toBe(Math.round(baseBMR * 1.375)); // 2338
    });

    it('calculates TDEE for moderately active', () => {
      const tdee = calculateTDEE(baseBMR, 'moderately_active');
      expect(tdee).toBe(Math.round(baseBMR * 1.55)); // 2635
    });

    it('calculates TDEE for very active', () => {
      const tdee = calculateTDEE(baseBMR, 'very_active');
      expect(tdee).toBe(Math.round(baseBMR * 1.725)); // 2933
    });

    it('calculates TDEE for extremely active', () => {
      const tdee = calculateTDEE(baseBMR, 'extremely_active');
      expect(tdee).toBe(Math.round(baseBMR * 1.9)); // 3230
    });

    it('throws error for invalid activity level', () => {
      expect(() => calculateTDEE(baseBMR, 'invalid' as ActivityLevel)).toThrow(
        /Invalid activity level/
      );
    });

    it('clamps TDEE to minimum', () => {
      const tdee = calculateTDEE(500, 'sedentary');
      expect(tdee).toBeGreaterThanOrEqual(VALIDATION.MIN_TDEE);
    });

    it('clamps TDEE to maximum', () => {
      const tdee = calculateTDEE(10000, 'extremely_active');
      expect(tdee).toBeLessThanOrEqual(VALIDATION.MAX_TDEE);
    });
  });

  // ============================================
  // GOAL CALORIES TESTS
  // ============================================

  describe('calculateGoalCalories', () => {
    const baseTDEE = 2500;

    it('calculates weight loss calories (TDEE - 500)', () => {
      const goalCal = calculateGoalCalories(baseTDEE, 'lose');
      expect(goalCal).toBe(2000);
    });

    it('calculates maintenance calories (no change)', () => {
      const goalCal = calculateGoalCalories(baseTDEE, 'maintain');
      expect(goalCal).toBe(2500);
    });

    it('calculates weight gain calories (TDEE + 300)', () => {
      const goalCal = calculateGoalCalories(baseTDEE, 'gain');
      expect(goalCal).toBe(2800);
    });

    it('throws error for invalid goal', () => {
      expect(() => calculateGoalCalories(baseTDEE, 'invalid' as Goal)).toThrow(/Invalid goal/);
    });

    it('enforces minimum safe intake (1200 kcal)', () => {
      // Even with aggressive deficit, should not go below 1200
      const goalCal = calculateGoalCalories(1500, 'lose');
      expect(goalCal).toBe(VALIDATION.MIN_GOAL_CALORIES);
    });

    it('clamps to maximum calories', () => {
      const goalCal = calculateGoalCalories(VALIDATION.MAX_GOAL_CALORIES, 'gain');
      expect(goalCal).toBeLessThanOrEqual(VALIDATION.MAX_GOAL_CALORIES);
    });
  });

  // ============================================
  // CALCULATE ALL CALORIES TESTS
  // ============================================

  describe('calculateAllCalories', () => {
    it('calculates complete calorie metrics', () => {
      const result = calculateAllCalories({
        weightKg: 80,
        heightCm: 180,
        age: 30,
        gender: 'male',
        activityLevel: 'moderately_active',
        goal: 'lose',
      });

      expect(result.bmr).toBe(1780);
      expect(result.tdee).toBe(2759); // 1780 * 1.55
      expect(result.goalCalories).toBe(2259); // 2759 - 500
      expect(result.activityMultiplier).toBe(1.55);
      expect(result.goalAdjustment).toBe(-500);
    });

    it('returns realistic values for average user', () => {
      const result = calculateAllCalories({
        weightKg: 70,
        heightCm: 170,
        age: 35,
        gender: 'female',
        activityLevel: 'lightly_active',
        goal: 'maintain',
      });

      // Should be in realistic range
      expect(result.bmr).toBeGreaterThan(1200);
      expect(result.bmr).toBeLessThan(2000);
      expect(result.tdee).toBeGreaterThan(1600);
      expect(result.tdee).toBeLessThan(2800);
      expect(result.goalCalories).toBe(result.tdee);
    });
  });

  // ============================================
  // AGE CALCULATION TESTS
  // ============================================

  describe('calculateAge', () => {
    it('calculates age correctly when birthday has passed', () => {
      const birthDate = new Date('1990-01-15');
      const referenceDate = new Date('2026-06-15');
      expect(calculateAge(birthDate, referenceDate)).toBe(36);
    });

    it('calculates age correctly when birthday has not passed', () => {
      const birthDate = new Date('1990-08-15');
      const referenceDate = new Date('2026-06-15');
      expect(calculateAge(birthDate, referenceDate)).toBe(35);
    });

    it('calculates age correctly on birthday', () => {
      const birthDate = new Date('1990-06-15');
      const referenceDate = new Date('2026-06-15');
      expect(calculateAge(birthDate, referenceDate)).toBe(36);
    });

    it('calculates age correctly day before birthday', () => {
      const birthDate = new Date('1990-06-16');
      const referenceDate = new Date('2026-06-15');
      expect(calculateAge(birthDate, referenceDate)).toBe(35);
    });
  });

  // ============================================
  // MACRO CALCULATION TESTS
  // ============================================

  describe('calculateMacros', () => {
    it('calculates macros for weight loss goal', () => {
      const macros = calculateMacros(2000, 70, 'lose');

      // Protein: 70 * 1.8 = 126g
      expect(macros.proteinG).toBe(126);

      // Fat: 2000 * 0.30 / 9 = 67g
      expect(macros.fatG).toBe(67);

      // Carbs: remaining (2000 - 504 - 600) / 4 = 224g
      expect(macros.carbsG).toBeGreaterThan(200);
    });

    it('calculates macros for muscle gain goal', () => {
      const macros = calculateMacros(2800, 80, 'gain');

      // Higher protein for muscle building: 80 * 2.0 = 160g
      expect(macros.proteinG).toBe(160);

      // Fat: 2800 * 0.25 / 9 = 78g
      expect(macros.fatG).toBe(78);

      // More carbs for energy
      expect(macros.carbsG).toBeGreaterThan(300);
    });

    it('calculates macros for maintenance', () => {
      const macros = calculateMacros(2200, 65, 'maintain');

      // Protein: 65 * 1.6 = 104g
      expect(macros.proteinG).toBe(104);

      // Fat: 2200 * 0.25 / 9 = 61g
      expect(macros.fatG).toBe(61);

      expect(macros.carbsG).toBeGreaterThan(250);
    });

    it('ensures non-negative carbs', () => {
      // Edge case with low calories and high weight
      const macros = calculateMacros(1200, 100, 'lose');
      expect(macros.carbsG).toBeGreaterThanOrEqual(0);
    });
  });

  // ============================================
  // CONSTANTS TESTS
  // ============================================

  describe('Constants', () => {
    it('has all activity multipliers defined', () => {
      expect(ACTIVITY_MULTIPLIERS.sedentary).toBe(1.2);
      expect(ACTIVITY_MULTIPLIERS.lightly_active).toBe(1.375);
      expect(ACTIVITY_MULTIPLIERS.moderately_active).toBe(1.55);
      expect(ACTIVITY_MULTIPLIERS.very_active).toBe(1.725);
      expect(ACTIVITY_MULTIPLIERS.extremely_active).toBe(1.9);
    });

    it('has all goal adjustments defined', () => {
      expect(GOAL_ADJUSTMENTS.lose).toBe(-500);
      expect(GOAL_ADJUSTMENTS.maintain).toBe(0);
      expect(GOAL_ADJUSTMENTS.gain).toBe(300);
    });

    it('has sensible validation ranges', () => {
      expect(VALIDATION.MIN_WEIGHT_KG).toBeLessThan(VALIDATION.MAX_WEIGHT_KG);
      expect(VALIDATION.MIN_HEIGHT_CM).toBeLessThan(VALIDATION.MAX_HEIGHT_CM);
      expect(VALIDATION.MIN_AGE).toBeLessThan(VALIDATION.MAX_AGE);
      expect(VALIDATION.MIN_GOAL_CALORIES).toBe(1200); // Safe minimum
    });
  });

  // ============================================
  // REAL-WORLD SCENARIO TESTS
  // ============================================

  describe('Real-world scenarios', () => {
    it('calculates for typical male wanting to lose weight', () => {
      // 35 year old office worker, 90kg, 178cm, wants to lose weight
      const result = calculateAllCalories({
        weightKg: 90,
        heightCm: 178,
        age: 35,
        gender: 'male',
        activityLevel: 'sedentary',
        goal: 'lose',
      });

      // Should be around 1900-2100 for sedentary male
      expect(result.goalCalories).toBeGreaterThan(1700);
      expect(result.goalCalories).toBeLessThan(2200);
    });

    it('calculates for athletic female maintaining weight', () => {
      // 28 year old gym-goer, 62kg, 168cm, maintenance
      const result = calculateAllCalories({
        weightKg: 62,
        heightCm: 168,
        age: 28,
        gender: 'female',
        activityLevel: 'very_active',
        goal: 'maintain',
      });

      // Very active female should be around 2200-2500
      expect(result.goalCalories).toBeGreaterThan(2100);
      expect(result.goalCalories).toBeLessThan(2600);
    });

    it('calculates for older person with moderate activity', () => {
      // 65 year old, 75kg, 165cm, wants to maintain
      const result = calculateAllCalories({
        weightKg: 75,
        heightCm: 165,
        age: 65,
        gender: 'diverse',
        activityLevel: 'moderately_active',
        goal: 'maintain',
      });

      // Older person, moderate activity
      expect(result.goalCalories).toBeGreaterThan(1800);
      expect(result.goalCalories).toBeLessThan(2400);
    });
  });
});
