/**
 * Journal Feature
 *
 * Haupt-Export für das Tagebuch-Feature
 */

// Types
export * from './types';

// Stores
export {
  useJournalStore,
  dateToString,
  stringToDate,
  isToday,
  formatDateForDisplay,
} from './stores';

// Hooks
export {
  useFoodEntries,
  useDailySummary,
  useAddFoodEntry,
  useUpdateFoodEntry,
  useDeleteFoodEntry,
  useCalorieProgress,
  useMacroProgress,
  useFoodSearch,
  foodEntriesKeys,
  foodSearchKeys,
} from './hooks';

// Components
export {
  DateNavigation,
  MealSection,
  MealSectionCompact,
  FoodEntryItem,
  FoodEntryItemCompact,
} from './components';

// Screens
export { JournalScreen, FoodSearchScreen } from './screens';

// Services
export {
  searchOpenFoodFacts,
  getProductByBarcode,
  searchCustomFoods,
  getAllCustomFoods,
  getRecentFoods,
  searchAllFoods,
} from './services';
