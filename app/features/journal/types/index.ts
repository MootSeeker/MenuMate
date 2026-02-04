/**
 * Journal Feature Types
 *
 * TypeScript-Definitionen für das Tagebuch-Feature
 */

/**
 * Mahlzeit-Typen für das Tagebuch
 */
export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

/**
 * Mahlzeit-Konfiguration mit Icon und deutschem Namen
 */
export interface MealTypeConfig {
  type: MealType;
  name: string;
  icon: string;
  order: number;
}

/**
 * Konfiguration für alle Mahlzeit-Typen
 */
export const MEAL_TYPE_CONFIG: Record<MealType, MealTypeConfig> = {
  breakfast: {
    type: 'breakfast',
    name: 'Frühstück',
    icon: '🍳',
    order: 1,
  },
  lunch: {
    type: 'lunch',
    name: 'Mittagessen',
    icon: '🍝',
    order: 2,
  },
  dinner: {
    type: 'dinner',
    name: 'Abendessen',
    icon: '🍽️',
    order: 3,
  },
  snack: {
    type: 'snack',
    name: 'Snacks',
    icon: '🍎',
    order: 4,
  },
};

/**
 * Nährwert-Informationen
 */
export interface NutritionInfo {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

/**
 * Einzelner Lebensmittel-Eintrag im Tagebuch
 */
export interface FoodEntry {
  id: string;
  userId: string;
  date: string; // YYYY-MM-DD Format
  mealType: MealType;
  name: string;
  brand?: string;
  amount: number;
  unit: string;
  nutrition: NutritionInfo;
  imageUrl?: string;
  barcode?: string;
  isCustomFood: boolean;
  customFoodId?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Datenbank-Repräsentation eines Eintrags (snake_case)
 */
export interface FoodEntryRow {
  id: string;
  user_id: string;
  date: string;
  meal_type: MealType;
  name: string;
  brand: string | null;
  amount: number;
  unit: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  image_url: string | null;
  barcode: string | null;
  is_custom_food: boolean;
  custom_food_id: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Zusammenfassung für einen Tag
 */
export interface DailySummary {
  date: string;
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  entriesByMeal: Record<MealType, FoodEntry[]>;
  caloriesByMeal: Record<MealType, number>;
}

/**
 * Nutzer-Ziele für Nährwerte
 */
export interface NutritionGoals {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

/**
 * Suchergebnis für Lebensmittel
 */
export interface FoodSearchResult {
  id: string;
  name: string;
  brand?: string;
  nutritionPer100g: NutritionInfo;
  servingSize?: number;
  servingUnit?: string;
  imageUrl?: string;
  barcode?: string;
  source: 'openfoodfacts' | 'custom' | 'recent';
}

/**
 * Custom Food (eigene Lebensmittel)
 */
export interface CustomFood {
  id: string;
  userId: string;
  name: string;
  brand?: string;
  nutritionPer100g: NutritionInfo;
  defaultServingSize: number;
  defaultServingUnit: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Datenbank-Repräsentation eines Custom Foods
 */
export interface CustomFoodRow {
  id: string;
  user_id: string;
  name: string;
  brand: string | null;
  calories_per_100g: number;
  protein_per_100g: number;
  carbs_per_100g: number;
  fat_per_100g: number;
  default_serving_size: number;
  default_serving_unit: string;
  created_at: string;
  updated_at: string;
}

/**
 * Hilfsfunktion: FoodEntryRow zu FoodEntry konvertieren
 */
export function mapFoodEntryRowToFoodEntry(row: FoodEntryRow): FoodEntry {
  return {
    id: row.id,
    userId: row.user_id,
    date: row.date,
    mealType: row.meal_type,
    name: row.name,
    brand: row.brand ?? undefined,
    amount: row.amount,
    unit: row.unit,
    nutrition: {
      calories: row.calories,
      protein: row.protein,
      carbs: row.carbs,
      fat: row.fat,
    },
    imageUrl: row.image_url ?? undefined,
    barcode: row.barcode ?? undefined,
    isCustomFood: row.is_custom_food,
    customFoodId: row.custom_food_id ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

/**
 * Hilfsfunktion: FoodEntry zu FoodEntryRow konvertieren
 */
export function mapFoodEntryToFoodEntryRow(
  entry: Omit<FoodEntry, 'id' | 'createdAt' | 'updatedAt'>
): Omit<FoodEntryRow, 'id' | 'created_at' | 'updated_at'> {
  return {
    user_id: entry.userId,
    date: entry.date,
    meal_type: entry.mealType,
    name: entry.name,
    brand: entry.brand ?? null,
    amount: entry.amount,
    unit: entry.unit,
    calories: entry.nutrition.calories,
    protein: entry.nutrition.protein,
    carbs: entry.nutrition.carbs,
    fat: entry.nutrition.fat,
    image_url: entry.imageUrl ?? null,
    barcode: entry.barcode ?? null,
    is_custom_food: entry.isCustomFood,
    custom_food_id: entry.customFoodId ?? null,
  };
}

/**
 * Hilfsfunktion: CustomFoodRow zu CustomFood konvertieren
 */
export function mapCustomFoodRowToCustomFood(row: CustomFoodRow): CustomFood {
  return {
    id: row.id,
    userId: row.user_id,
    name: row.name,
    brand: row.brand ?? undefined,
    nutritionPer100g: {
      calories: row.calories_per_100g,
      protein: row.protein_per_100g,
      carbs: row.carbs_per_100g,
      fat: row.fat_per_100g,
    },
    defaultServingSize: row.default_serving_size,
    defaultServingUnit: row.default_serving_unit,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

/**
 * Hilfsfunktion: Nährwerte für eine bestimmte Menge berechnen
 */
export function calculateNutritionForAmount(
  nutritionPer100g: NutritionInfo,
  amountInGrams: number
): NutritionInfo {
  const factor = amountInGrams / 100;
  return {
    calories: Math.round(nutritionPer100g.calories * factor),
    protein: Math.round(nutritionPer100g.protein * factor * 10) / 10,
    carbs: Math.round(nutritionPer100g.carbs * factor * 10) / 10,
    fat: Math.round(nutritionPer100g.fat * factor * 10) / 10,
  };
}

/**
 * Hilfsfunktion: Leere Tages-Zusammenfassung erstellen
 */
export function createEmptyDailySummary(date: string): DailySummary {
  return {
    date,
    totalCalories: 0,
    totalProtein: 0,
    totalCarbs: 0,
    totalFat: 0,
    entriesByMeal: {
      breakfast: [],
      lunch: [],
      dinner: [],
      snack: [],
    },
    caloriesByMeal: {
      breakfast: 0,
      lunch: 0,
      dinner: 0,
      snack: 0,
    },
  };
}

/**
 * Hilfsfunktion: Einträge zu Tages-Zusammenfassung aggregieren
 */
export function aggregateEntriesToDailySummary(entries: FoodEntry[], date: string): DailySummary {
  const summary = createEmptyDailySummary(date);

  for (const entry of entries) {
    // Zum richtigen Meal-Typ hinzufügen
    summary.entriesByMeal[entry.mealType].push(entry);

    // Nährwerte summieren
    summary.totalCalories += entry.nutrition.calories;
    summary.totalProtein += entry.nutrition.protein;
    summary.totalCarbs += entry.nutrition.carbs;
    summary.totalFat += entry.nutrition.fat;

    // Kalorien pro Mahlzeit summieren
    summary.caloriesByMeal[entry.mealType] += entry.nutrition.calories;
  }

  // Makros runden
  summary.totalProtein = Math.round(summary.totalProtein * 10) / 10;
  summary.totalCarbs = Math.round(summary.totalCarbs * 10) / 10;
  summary.totalFat = Math.round(summary.totalFat * 10) / 10;

  return summary;
}
