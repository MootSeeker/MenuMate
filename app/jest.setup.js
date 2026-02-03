/**
 * Jest Setup File
 * Runs before each test file
 */

// Import built-in matchers from @testing-library/react-native
// Note: In v12.4+, matchers are auto-extended when using the library

// ============================================
// Module Mocks
// ============================================

// Mock AsyncStorage
jest.mock(
  '@react-native-async-storage/async-storage',
  () => require('./__mocks__/asyncStorage').default
);

// Mock expo-router
jest.mock('expo-router', () => require('./__mocks__/expoRouter'));

// Mock expo-camera (only if installed)
try {
  require.resolve('expo-camera');
  jest.mock('expo-camera', () => require('./__mocks__/expoCamera'));
} catch {
  // expo-camera not installed, skip mock
}

// Mock @supabase/supabase-js
jest.mock('@supabase/supabase-js', () => ({
  createClient: require('./__mocks__/supabase').createClient,
}));

// ============================================
// React Native Mocks
// ============================================

// Mock react-native-reanimated
jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.default.call = () => {};
  return Reanimated;
});

// Mock console.warn for specific warnings we want to suppress in tests
const originalWarn = console.warn;
console.warn = (...args) => {
  // Suppress specific React Native warnings during tests
  if (
    typeof args[0] === 'string' &&
    (args[0].includes('Animated: `useNativeDriver`') ||
      args[0].includes('componentWillReceiveProps has been renamed'))
  ) {
    return;
  }
  originalWarn.call(console, ...args);
};

// Set up global test timeout
jest.setTimeout(10000);
