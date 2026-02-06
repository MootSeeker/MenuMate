# MenuMate Testing Guide

Dieses Dokument beschreibt die Testing-Strategie und Best Practices für MenuMate.

## Inhaltsverzeichnis

1. [Test-Setup](#test-setup)
2. [Test-Struktur](#test-struktur)
3. [Test-Typen](#test-typen)
4. [Mocking-Strategie](#mocking-strategie)
5. [Best Practices](#best-practices)
6. [Coverage-Ziele](#coverage-ziele)
7. [CI/CD Integration](#cicd-integration)

---

## Test-Setup

### Dependencies

Die folgenden Testing-Libraries sind bereits installiert:

| Library | Zweck |
|---------|-------|
| `jest` | Test Runner |
| `jest-expo` | Expo-spezifische Jest-Konfiguration |
| `@testing-library/react-native` | React Native Testing Utilities |
| `@testing-library/jest-native` | Jest Matcher für React Native |

### Tests ausführen

```bash
cd app

# Alle Tests ausführen
npm test

# Tests im Watch-Mode
npm run test:watch

# Tests mit Coverage Report
npm run test:coverage

# Einzelne Test-Datei
npm test -- journalStore.test.ts

# Tests mit Pattern
npm test -- --testPathPattern="stores"
```

### Konfiguration

- **Jest Config:** [jest.config.js](../app/jest.config.js)
- **Setup File:** [jest.setup.js](../app/jest.setup.js)
- **Mocks:** [\_\_mocks\_\_/](../app/__mocks__/)

---

## Test-Struktur

### Datei-Organisation

Tests werden in `__tests__/` Ordnern neben dem zu testenden Code platziert:

```
features/
├── journal/
│   ├── stores/
│   │   ├── journalStore.ts
│   │   └── __tests__/
│   │       └── journalStore.test.ts
│   └── utils/
│       ├── calculations.ts
│       └── __tests__/
│           └── calculations.test.ts
```

### Namenskonvention

- Test-Dateien: `*.test.ts` oder `*.test.tsx`
- Spec-Dateien: `*.spec.ts` (alternative Konvention)
- Test-Ordner: `__tests__/`

### AAA Pattern (Arrange-Act-Assert)

```typescript
describe('calculateTotal', () => {
  it('should sum all meal calories', () => {
    // Arrange - Setup test data
    const meals = [
      { calories: 400 },
      { calories: 600 },
      { calories: 300 },
    ];

    // Act - Execute the function
    const result = calculateTotal(meals);

    // Assert - Verify the result
    expect(result).toBe(1300);
  });
});
```

---

## Test-Typen

### 1. Unit Tests

Testen einzelne Funktionen oder kleine Module isoliert.

**Beispiele:**
- Utility-Funktionen
- Store Actions
- Helper-Funktionen
- Validierungslogik

```typescript
// features/journal/utils/__tests__/dateUtils.test.ts
describe('dateToString', () => {
  it('should format date as YYYY-MM-DD', () => {
    const date = new Date(2026, 1, 6);
    expect(dateToString(date)).toBe('2026-02-06');
  });
});
```

### 2. Component Tests

Testen React Native Components inkl. Rendering und Interaktionen.

```typescript
// components/__tests__/Button.test.tsx
import { render, fireEvent } from '@testing-library/react-native';
import { Button } from '../Button';

describe('Button', () => {
  it('should call onPress when pressed', () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <Button onPress={onPress}>Click me</Button>
    );

    fireEvent.press(getByText('Click me'));

    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
```

### 3. Store Tests

Testen Zustand-Stores (Zustand) mit State-Changes.

```typescript
// features/auth/stores/__tests__/authStore.test.ts
import { act, renderHook } from '@testing-library/react-native';
import { useAuthStore } from '../authStore';

describe('useAuthStore', () => {
  beforeEach(() => {
    // Reset store state
    useAuthStore.setState({ user: null });
  });

  it('should update user on sign in', async () => {
    const { result } = renderHook(() => useAuthStore());

    await act(async () => {
      await result.current.signIn('test@example.com', 'password');
    });

    expect(result.current.isAuthenticated).toBe(true);
  });
});
```

### 4. Integration Tests

Testen das Zusammenspiel mehrerer Module.

```typescript
// app/__tests__/navigation.test.tsx
describe('Navigation Flow', () => {
  it('should redirect to login when not authenticated', () => {
    mockUseAuthStore.mockReturnValue({ isAuthenticated: false });
    
    // Test navigation logic...
  });
});
```

---

## Mocking-Strategie

### AsyncStorage

```typescript
// __mocks__/asyncStorage.ts
export default {
  getItem: jest.fn(() => Promise.resolve(null)),
  setItem: jest.fn(() => Promise.resolve()),
  removeItem: jest.fn(() => Promise.resolve()),
  clear: jest.fn(() => Promise.resolve()),
};
```

### Supabase

```typescript
// __mocks__/supabase.ts
export const supabase = {
  auth: {
    getSession: jest.fn(),
    signInWithPassword: jest.fn(),
    signUp: jest.fn(),
    signOut: jest.fn(),
  },
};
```

### Expo Router

```typescript
jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  }),
  useSegments: () => ['(tabs)'],
  Link: ({ children }) => children,
}));
```

### Expo Camera

```typescript
// __mocks__/expoCamera.ts
export const Camera = {
  useCameraPermissions: () => [{ granted: true }, jest.fn()],
};
```

---

## Best Practices

### ✅ Do's

1. **Teste Verhalten, nicht Implementierung**
   ```typescript
   // ✅ Good: Testet das Ergebnis
   expect(result.current.isAuthenticated).toBe(true);

   // ❌ Bad: Testet interne Implementierung
   expect(setState).toHaveBeenCalledWith({ user: mockUser });
   ```

2. **Nutze beschreibende Test-Namen**
   ```typescript
   // ✅ Good
   it('should not allow navigation to future dates');

   // ❌ Bad
   it('test navigation');
   ```

3. **Isoliere Tests voneinander**
   ```typescript
   beforeEach(() => {
     jest.clearAllMocks();
     useStore.setState(initialState);
   });
   ```

4. **Teste Edge Cases**
   ```typescript
   describe('calculateAge', () => {
     it('should handle leap year birthdays');
     it('should handle future birth dates');
     it('should handle missing data');
   });
   ```

5. **Nutze Test Data Builders für komplexe Objekte**
   ```typescript
   const createMockUser = (overrides = {}) => ({
     id: 'test-id',
     email: 'test@example.com',
     ...overrides,
   });
   ```

### ❌ Don'ts

1. **Keine "Magic Numbers"**
   ```typescript
   // ✅ Good
   const EXPECTED_BMR = 1780;
   expect(bmr).toBe(EXPECTED_BMR);

   // ❌ Bad
   expect(bmr).toBe(1780);
   ```

2. **Keine Tests die immer bestehen**
   ```typescript
   // ❌ Bad - immer true
   expect(true).toBe(true);
   ```

3. **Keine API-Calls in Unit Tests**
   ```typescript
   // ✅ Good - gemockt
   mockFetch.mockResolvedValue({ data: mockData });

   // ❌ Bad - echter API Call
   const response = await fetch('https://api.example.com');
   ```

---

## Coverage-Ziele

### Minimum Coverage Thresholds

| Metrik | Ziel |
|--------|------|
| Statements | 60% |
| Branches | 50% |
| Functions | 60% |
| Lines | 60% |

### Priorisierte Test-Bereiche

1. **Kritische Business Logic** (80%+)
   - TDEE/BMR Berechnungen
   - Nutrition Tracking
   - Auth Flow

2. **State Management** (70%+)
   - Zustand Stores
   - Data Persistence

3. **UI Components** (50%+)
   - Core Components (Button, Input, Card)
   - Screens mit komplexer Logik

4. **Utilities** (80%+)
   - Date/Number Formatter
   - Validation Functions

### Coverage Report generieren

```bash
npm run test:coverage
```

Der Report wird in `app/coverage/` generiert:
- `coverage/lcov-report/index.html` - HTML Report
- `coverage/lcov.info` - LCOV Format für CI

---

## CI/CD Integration

### GitHub Actions

Tests laufen automatisch bei:
- Push zu `main`
- Pull Requests

**Workflow:** [.github/workflows/ci.yml](../.github/workflows/ci.yml)

### Coverage im CI

```yaml
- name: Run tests
  run: npm test -- --coverage --ci

- name: Upload coverage report
  uses: actions/upload-artifact@v4
  with:
    name: coverage-report
    path: ./app/coverage/
```

### Fail bei Coverage Drop

In `jest.config.js`:

```javascript
coverageThreshold: {
  global: {
    statements: 60,
    branches: 50,
    functions: 60,
    lines: 60,
  },
},
```

---

## Fehlerbehebung

### Häufige Probleme

**"Cannot find module '@/...'"**
- Prüfe `moduleNameMapper` in jest.config.js

**"Jest encountered an unexpected token"**
- Füge das Modul zu `transformIgnorePatterns` hinzu

**"Timeout - Async callback was not invoked"**
- Nutze `await act(async () => { ... })`
- Erhöhe Timeout: `jest.setTimeout(10000)`

**Store State wird zwischen Tests nicht zurückgesetzt**
- Füge `beforeEach` mit State Reset hinzu

---

## Weiterführende Ressourcen

- [React Native Testing Library](https://callstack.github.io/react-native-testing-library/)
- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Testing Library Cheatsheet](https://testing-library.com/docs/react-native-testing-library/cheatsheet)
- [JavaScript Testing Best Practices](https://github.com/goldbergyoni/javascript-testing-best-practices)
