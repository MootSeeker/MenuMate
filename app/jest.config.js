/** @type {import('jest').Config} */
module.exports = {
  preset: 'jest-expo',

  // Setup files to run before each test
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],

  // Transform TypeScript files
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@sentry/react-native|native-base|react-native-svg|@supabase/.*|@tanstack/.*|zustand|nativewind|react-native-reanimated)',
  ],

  // Module path aliases (matching tsconfig.json)
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },

  // Test file patterns
  testMatch: ['**/__tests__/**/*.test.[jt]s?(x)', '**/*.test.[jt]s?(x)', '**/*.spec.[jt]s?(x)'],

  // Files to ignore
  testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/.expo/'],

  // Coverage configuration
  collectCoverageFrom: [
    '**/*.{ts,tsx}',
    '!**/node_modules/**',
    '!**/coverage/**',
    '!**/.expo/**',
    '!**/babel.config.js',
    '!**/jest.config.js',
    '!**/jest.setup.js',
    '!**/tailwind.config.js',
    '!**/*.d.ts',
    '!**/app/_layout.tsx', // Exclude root layout from coverage
  ],

  coverageReporters: ['text', 'lcov', 'html'],

  // Coverage thresholds - CI will fail if coverage drops below these values
  coverageThreshold: {
    global: {
      statements: 60,
      branches: 50,
      functions: 60,
      lines: 60,
    },
  },

  // Clear mocks between tests
  clearMocks: true,

  // Verbose output
  verbose: true,
};
