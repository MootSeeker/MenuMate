/**
 * Jest Setup File
 * Runs before each test file
 */

// Import Jest Native matchers (built into @testing-library/react-native v12.4+)
import '@testing-library/react-native/extend-expect';

// Silence the warning: Animated: `useNativeDriver` is not supported
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');

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
