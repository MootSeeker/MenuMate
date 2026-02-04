/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
    './features/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        // Primary - Fresh Green (Health & Vitality)
        primary: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e', // Main primary color
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
          500: '#f97316', // Main secondary color
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
          500: '#14b8a6', // Main accent color
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
        // Background colors (Light Mode defaults)
        background: {
          DEFAULT: '#ffffff',
          secondary: '#f9fafb',
          tertiary: '#f3f4f6',
        },
        // Surface colors for cards, modals, etc.
        surface: {
          DEFAULT: '#ffffff',
          elevated: '#ffffff',
        },
        // Text colors
        foreground: {
          DEFAULT: '#111827',
          secondary: '#4b5563',
          tertiary: '#9ca3af',
          inverse: '#ffffff',
        },
        // Border colors
        border: {
          DEFAULT: '#e5e7eb',
          strong: '#d1d5db',
        },
        // Macro colors (for nutrition tracking)
        macro: {
          protein: '#3b82f6', // Blue
          carbs: '#f59e0b', // Yellow/Amber
          fat: '#ef4444', // Red
        },
      },
      // Typography
      fontSize: {
        // Headings
        'heading-1': ['32px', { lineHeight: '40px', fontWeight: '700' }],
        'heading-2': ['24px', { lineHeight: '32px', fontWeight: '700' }],
        'heading-3': ['20px', { lineHeight: '28px', fontWeight: '600' }],
        'heading-4': ['18px', { lineHeight: '24px', fontWeight: '600' }],
        // Body
        'body-lg': ['18px', { lineHeight: '28px', fontWeight: '400' }],
        'body-md': ['16px', { lineHeight: '24px', fontWeight: '400' }],
        'body-sm': ['14px', { lineHeight: '20px', fontWeight: '400' }],
        // Caption & Labels
        caption: ['12px', { lineHeight: '16px', fontWeight: '400' }],
        label: ['14px', { lineHeight: '20px', fontWeight: '500' }],
      },
      // Spacing (consistent with 4px grid)
      spacing: {
        4.5: '18px',
        13: '52px',
        15: '60px',
        18: '72px',
        22: '88px',
      },
      // Border radius
      borderRadius: {
        '4xl': '32px',
      },
      // Box shadow
      boxShadow: {
        'card-sm': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        card: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        'card-lg':
          '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
      },
    },
  },
  darkMode: 'class',
  plugins: [],
};
