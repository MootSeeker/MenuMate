# Development Environment & Workflow

## 1. IDE Guidelines
**Primary IDE:** [Visual Studio Code](https://code.visualstudio.com/)
*Why?* VS Code ist der Industriestandard für React Native & TypeScript Entwicklung. Es ist leichtgewichtig, kostenlos und bietet durch das riesige Extension-Ökosystem die beste Unterstützung für unseren Tech-Stack.

### Recommended VS Code Extensions
Nutze diese Extensions für optimale Produktivität:
- **Expo Tools**: Für Debugging und Autocomplete in `app.json`.
- **ESLint**: Um Code-Qualität und Fehler frühzeitig zu erkennen.
- **Prettier - Code formatter**: Für automatische Code-Formatierung beim Speichern.
- **Tailwind CSS IntelliSense**: Für Autocomplete der NativeWind Klassen.
- **ES7+ React/Redux/React-Native snippets**: Für schnelle Code-Snippets (`rafce` etc.).

## 2. Cross-Platform Development (Windows & MacOS)
Da wir **Expo** nutzen, ist die Entwicklung auf beiden Betriebssystemen nahtlos möglich.

### Setup Unterschiede
- **MacOS**: Kann iOS Simulatoren (Xcode) und Android Emulatoren nutzen.
- **Windows**: Kann Android Emulatoren nutzen. Für iOS-Tests muss ein **physisches iPhone** mit der "Expo Go" App verwendet werden (oder ein Cloud Build).

## 3. Prerequisites
- **Node.js**: LTS Version (v20 oder neuer empfohlen).
- **Git**: Für Version Control.
- **Package Manager**: `npm` (Standard) oder `bun`/`yarn` (optional, wir bleiben vorerst bei npm).
- **Mobile Device**: Installation der **Expo Go** App auf deinem Smartphone (iOS & Android) zum Live-Testen.

## 4. Testing Strategy
- **Unit Testing**: [Jest](https://jestjs.io/) (Standard Framework)
- **Component Testing**: [React Native Testing Library](https://callstack.github.io/react-native-testing-library/) (User-centric I/O testing)
- **Scope**:
    - Business Logic (e.g., TDEE calculation helpers).
    - Critical Components (Input forms, lists).
    - *Not* simple UI components (Snapshot testing only if critical).

## 5. CI/CD Pipeline (GitHub Actions)
Wir nutzen GitHub Workflows für eine vollautomatisierte Release-Pipeline.

### CI: Quality Gate (Pull Request Checks)
Jeder PR muss diese Checks bestehen, bevor er gemerged werden kann:
- **Linting**: Static Analysis mit `eslint` (fängt Style-Fehler & Anti-Patterns).
- **TypeScript Check**: Validierung der Typensicherheit (`tsc --noEmit`).
- **Testing**: Ausführung aller Unit- & Integrationstests (`jest`).
- **Dependency Audit**: Sicherheitscheck der npm-Pakete (`npm audit`).

### CD: Deployment & Release Automation
Nach einem Merge auf `main` oder via manuellem "Dispatch" Trigger:
1.  **Preview Builds (Development)**:
    - Erstellt automatisch einen "Preview Channel" Build via **EAS (Expo Application Services)**.
    - QR-Code wird im PR-Kommentar gepostet (Tester können Features sofort probieren).
2.  **Production Deployment (Release)**:
    - **OTA Updates**: Für reine JavaScript-Änderungen (schnell, ohne Store-Review) via `eas update`.
    - **Native Builds**: Erstellen von `.ipa` (iOS) und `.aab` (Android) via `eas build --profile production`.
    - **Store Upload**: Automatischer Upload zu TestFlight (iOS) und Google Play Console (Android) via `eas submit`.

## 6. Code Style & Conventions
Wir setzen auf strikte Standards für wartbaren, skalierbaren Enterprise-Code.

### Architecture & Design Patterns
- **Feature-First Structure**: Dateien werden nach Features gruppiert (z.B. `/features/auth`, `/features/food-logger`), nicht technisch (kein riesiger `/components` Ordner).
- **Custom Hooks**: Business-Logik wird strikt von der UI getrennt (`useFoodLog.ts` vs `FoodLogScreen.tsx`).
- **Atomic Design**: UI-Komponenten werden in `atoms` (Buttons), `molecules` (Form Fields) und `organisms` (Cards) unterteilt.

### TypeScript Rules
- **No `any`**: Die Verwendung von `any` ist strikt verboten. Alle Typen müssen explizit definiert werden.
- **Interfaces preferiert**: Wir nutzen `interface` für Objekt-Strukturen und `type` für Unions/Primitives.
- **Strict Null Checks**: Wir behandeln `null` und `undefined` explizit.

### Naming Conventions
- **Components**: `PascalCase` (z.B. `PrimaryButton.tsx`).
- **Functions/Vars**: `camelCase` (z.B. `calculateTotalCalories`).
- **Hooks**: `use` Prefix (z.B. `useAuth`).
- **Constants**: `UPPER_SNAKE_CASE` für globale Konstanten (z.B. `MAX_DAILY_CALORIES`).

### Best Practices
- **Early Return**: Vermeidung von tief verschachtelten `if/else` Blöcken.
- **Immutability**: State-Updates erfolgen immer immutable (kein `push`, sondern spread operator `...`).
- **Clean Imports**: Absolute Imports nutzen (z.B. `@/components/Button`) statt `../../components/Button`.
- **Error Handling**: `try/catch` in async Funktionen und Nutzung von Error Boundaries für UI-Fehler.
