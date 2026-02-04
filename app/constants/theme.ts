/**
 * MenuMate Design System - Theme Colors
 *
 * These constants mirror the Tailwind config and can be used
 * programmatically where NativeWind classes aren't available.
 */

export const colors = {
  // Primary - Fresh Green (Health & Vitality)
  primary: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
    950: '#052e16',
  },
  // Secondary - Warm Orange (Energy & Appetite)
  secondary: {
    50: '#fff7ed',
    100: '#ffedd5',
    200: '#fed7aa',
    300: '#fdba74',
    400: '#fb923c',
    500: '#f97316',
    600: '#ea580c',
    700: '#c2410c',
    800: '#9a3412',
    900: '#7c2d12',
    950: '#431407',
  },
  // Accent - Teal (Trust & Calm)
  accent: {
    50: '#f0fdfa',
    100: '#ccfbf1',
    200: '#99f6e4',
    300: '#5eead4',
    400: '#2dd4bf',
    500: '#14b8a6',
    600: '#0d9488',
    700: '#0f766e',
    800: '#115e59',
    900: '#134e4a',
    950: '#042f2e',
  },
  // Semantic Colors
  success: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
  },
  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
  },
  error: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
  },
  info: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
  },
  // Macro Nutrient Colors
  macro: {
    protein: '#3b82f6',
    carbs: '#f59e0b',
    fat: '#ef4444',
  },
} as const;

export const lightTheme = {
  background: {
    DEFAULT: '#ffffff',
    secondary: '#f9fafb',
    tertiary: '#f3f4f6',
  },
  surface: {
    DEFAULT: '#ffffff',
    elevated: '#ffffff',
  },
  foreground: {
    DEFAULT: '#111827',
    secondary: '#4b5563',
    tertiary: '#9ca3af',
    inverse: '#ffffff',
  },
  border: {
    DEFAULT: '#e5e7eb',
    strong: '#d1d5db',
  },
} as const;

export const darkTheme = {
  background: {
    DEFAULT: '#111827',
    secondary: '#1f2937',
    tertiary: '#374151',
  },
  surface: {
    DEFAULT: '#1f2937',
    elevated: '#374151',
  },
  foreground: {
    DEFAULT: '#f9fafb',
    secondary: '#d1d5db',
    tertiary: '#6b7280',
    inverse: '#111827',
  },
  border: {
    DEFAULT: '#374151',
    strong: '#4b5563',
  },
} as const;

// Type exports for type-safe theme usage
export type Colors = typeof colors;
export type LightTheme = typeof lightTheme;
export type DarkTheme = typeof darkTheme;
export type ThemeColors = LightTheme | DarkTheme;

// Helper function to get theme based on color scheme
export function getTheme(colorScheme: 'light' | 'dark'): ThemeColors {
  return colorScheme === 'dark' ? darkTheme : lightTheme;
}
