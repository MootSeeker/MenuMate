/**
 * Food Search Service
 *
 * Service für die Suche nach Lebensmitteln in OpenFoodFacts und eigenen Custom Foods
 * Implementiert Issue #31 (Food Search) und #38 (Integrate Custom Foods)
 */

import { supabase } from '@/lib/supabase';
import {
  FoodSearchResult,
  NutritionInfo,
  CustomFoodRow,
  mapCustomFoodRowToCustomFood,
} from '../types';

/**
 * OpenFoodFacts API Response Types
 */
interface OpenFoodFactsProduct {
  code: string;
  product_name?: string;
  product_name_de?: string;
  brands?: string;
  nutriments?: {
    'energy-kcal_100g'?: number;
    'energy-kcal'?: number;
    proteins_100g?: number;
    carbohydrates_100g?: number;
    fat_100g?: number;
  };
  serving_size?: string;
  serving_quantity?: number;
  image_url?: string;
  image_front_small_url?: string;
}

interface OpenFoodFactsSearchResponse {
  count: number;
  page: number;
  page_size: number;
  products: OpenFoodFactsProduct[];
}

interface OpenFoodFactsProductResponse {
  status: number;
  status_verbose: string;
  product?: OpenFoodFactsProduct;
}

/**
 * OpenFoodFacts API Basis-URL
 */
const OFF_BASE_URL = 'https://world.openfoodfacts.org';

/**
 * Timeout für API-Anfragen (in ms)
 */
const API_TIMEOUT = 10000;

/**
 * Fetch mit Timeout
 */
async function fetchWithTimeout(url: string, timeout: number = API_TIMEOUT): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'MenuMate - React Native App',
      },
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

/**
 * OpenFoodFacts Produkt zu FoodSearchResult konvertieren
 */
function mapOpenFoodFactsToSearchResult(product: OpenFoodFactsProduct): FoodSearchResult | null {
  // Produkt ohne Namen überspringen
  const name = product.product_name_de || product.product_name;
  if (!name) {
    return null;
  }

  // Nährwerte extrahieren (pro 100g)
  const nutriments = product.nutriments;
  const nutrition: NutritionInfo = {
    calories: Math.round(nutriments?.['energy-kcal_100g'] ?? nutriments?.['energy-kcal'] ?? 0),
    protein: Math.round((nutriments?.proteins_100g ?? 0) * 10) / 10,
    carbs: Math.round((nutriments?.carbohydrates_100g ?? 0) * 10) / 10,
    fat: Math.round((nutriments?.fat_100g ?? 0) * 10) / 10,
  };

  // Portionsgröße parsen
  let servingSize: number | undefined;
  let servingUnit: string | undefined;

  if (product.serving_quantity) {
    servingSize = product.serving_quantity;
    servingUnit = 'g';
  } else if (product.serving_size) {
    const match = product.serving_size.match(/(\d+(?:\.\d+)?)\s*(g|ml)?/i);
    if (match) {
      servingSize = parseFloat(match[1]);
      servingUnit = match[2]?.toLowerCase() || 'g';
    }
  }

  return {
    id: `off_${product.code}`,
    name,
    brand: product.brands || undefined,
    nutritionPer100g: nutrition,
    servingSize,
    servingUnit,
    imageUrl: product.image_front_small_url || product.image_url || undefined,
    barcode: product.code,
    source: 'openfoodfacts',
  };
}

/**
 * In OpenFoodFacts suchen
 */
export async function searchOpenFoodFacts(query: string): Promise<FoodSearchResult[]> {
  if (!query || query.length < 2) {
    return [];
  }

  try {
    const encodedQuery = encodeURIComponent(query);
    const url = `${OFF_BASE_URL}/cgi/search.pl?search_terms=${encodedQuery}&search_simple=1&action=process&json=1&page_size=20&lc=de`;

    const response = await fetchWithTimeout(url);

    if (!response.ok) {
      throw new Error(`OpenFoodFacts API error: ${response.status}`);
    }

    const data: OpenFoodFactsSearchResponse = await response.json();

    return data.products
      .map(mapOpenFoodFactsToSearchResult)
      .filter((result): result is FoodSearchResult => result !== null);
  } catch (error) {
    console.error('OpenFoodFacts search error:', error);
    return [];
  }
}

/**
 * Produkt per Barcode in OpenFoodFacts suchen
 */
export async function getProductByBarcode(barcode: string): Promise<FoodSearchResult | null> {
  if (!barcode) {
    return null;
  }

  try {
    const url = `${OFF_BASE_URL}/api/v0/product/${barcode}.json`;

    const response = await fetchWithTimeout(url);

    if (!response.ok) {
      return null;
    }

    const data: OpenFoodFactsProductResponse = await response.json();

    if (data.status !== 1 || !data.product) {
      return null;
    }

    return mapOpenFoodFactsToSearchResult(data.product);
  } catch (error) {
    console.error('OpenFoodFacts barcode lookup error:', error);
    return null;
  }
}

/**
 * In Custom Foods (Supabase) suchen
 */
export async function searchCustomFoods(query: string): Promise<FoodSearchResult[]> {
  if (!query || query.length < 2) {
    return [];
  }

  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.user) {
      return [];
    }

    const { data, error } = await supabase
      .from('custom_foods')
      .select('*')
      .eq('user_id', session.user.id)
      .ilike('name', `%${query}%`)
      .order('name')
      .limit(20);

    if (error) {
      console.error('Custom foods search error:', error);
      return [];
    }

    return (data as CustomFoodRow[]).map((row) => {
      const customFood = mapCustomFoodRowToCustomFood(row);
      return {
        id: `custom_${customFood.id}`,
        name: customFood.name,
        brand: customFood.brand,
        nutritionPer100g: customFood.nutritionPer100g,
        servingSize: customFood.defaultServingSize,
        servingUnit: customFood.defaultServingUnit,
        source: 'custom' as const,
      };
    });
  } catch (error) {
    console.error('Custom foods search error:', error);
    return [];
  }
}

/**
 * Alle Custom Foods des Nutzers laden
 */
export async function getAllCustomFoods(): Promise<FoodSearchResult[]> {
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.user) {
      return [];
    }

    const { data, error } = await supabase
      .from('custom_foods')
      .select('*')
      .eq('user_id', session.user.id)
      .order('name');

    if (error) {
      console.error('Get all custom foods error:', error);
      return [];
    }

    return (data as CustomFoodRow[]).map((row) => {
      const customFood = mapCustomFoodRowToCustomFood(row);
      return {
        id: `custom_${customFood.id}`,
        name: customFood.name,
        brand: customFood.brand,
        nutritionPer100g: customFood.nutritionPer100g,
        servingSize: customFood.defaultServingSize,
        servingUnit: customFood.defaultServingUnit,
        source: 'custom' as const,
      };
    });
  } catch (error) {
    console.error('Get all custom foods error:', error);
    return [];
  }
}

/**
 * Zuletzt verwendete Lebensmittel laden
 */
export async function getRecentFoods(limit: number = 20): Promise<FoodSearchResult[]> {
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.user) {
      return [];
    }

    // Distinct Namen aus den letzten 30 Tagen
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const dateString = thirtyDaysAgo.toISOString().split('T')[0];

    const { data, error } = await supabase
      .from('food_entries')
      .select('name, brand, calories, protein, carbs, fat, amount, unit')
      .eq('user_id', session.user.id)
      .gte('date', dateString)
      .order('created_at', { ascending: false })
      .limit(100);

    if (error) {
      console.error('Get recent foods error:', error);
      return [];
    }

    // Duplikate entfernen (nach Name)
    const seen = new Set<string>();
    const uniqueFoods: FoodSearchResult[] = [];

    for (const row of data) {
      const key = `${row.name}_${row.brand || ''}`;
      if (seen.has(key)) continue;
      seen.add(key);

      // Nährwerte zurückrechnen auf 100g
      const factor = row.amount > 0 ? 100 / row.amount : 1;

      uniqueFoods.push({
        id: `recent_${key}`,
        name: row.name,
        brand: row.brand || undefined,
        nutritionPer100g: {
          calories: Math.round(row.calories * factor),
          protein: Math.round(row.protein * factor * 10) / 10,
          carbs: Math.round(row.carbs * factor * 10) / 10,
          fat: Math.round(row.fat * factor * 10) / 10,
        },
        servingSize: row.amount,
        servingUnit: row.unit,
        source: 'recent',
      });

      if (uniqueFoods.length >= limit) break;
    }

    return uniqueFoods;
  } catch (error) {
    console.error('Get recent foods error:', error);
    return [];
  }
}

/**
 * Kombinierte Suche in OpenFoodFacts und Custom Foods
 * Issue #38: Integrate Custom Foods in Search
 */
export async function searchAllFoods(query: string): Promise<FoodSearchResult[]> {
  if (!query || query.length < 2) {
    return [];
  }

  // Parallel suchen
  const [offResults, customResults] = await Promise.all([
    searchOpenFoodFacts(query),
    searchCustomFoods(query),
  ]);

  // Custom Foods zuerst, dann OpenFoodFacts
  // Custom Foods sind für den Nutzer relevanter
  return [...customResults, ...offResults];
}

/**
 * Export Types für einfachere Imports
 */
export type { FoodSearchResult };
