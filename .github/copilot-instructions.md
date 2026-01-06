# MenuMate Project Instructions

## Project Context
**MenuMate** is an intelligent calorie tracking application designed to help users maintain a balanced diet by helping them log meals and monitor their nutritional intake. The app also allows users to scan meals by taking pictures, leveraging image recognition to identify food items and estimate their calorie content. The application integrates also a BMI monitor so users can track their weight and health progress over time. This project aims to provide a seamless and user-friendly experience for health-conscious individuals looking to manage their diet effectively.

### Core Features
1. **Intelligent Calorie Tracking**: Classic diary structure (Breakfast, Lunch, Dinner, Snacks).
2. **AI Meal Scan**: Photo recognition via Google Gemini 1.5 Flash.
3. **Barcode Scanner**: OpenFoodFacts API integration.
4. **TDEE Calculator**: Automatic daily calorie goal calculation.
5. **Weight & BMI Tracking**: Progress monitoring over time.
6. **Apple Health / Health Connect**: Bidirectional sync.
7. **Gamification**: Streaks and point system for motivation.

### App Navigation (Bottom Tabs)
1. **Tagebuch** (Journal): Daily meal overview.
2. **Scan/Add**: Camera for AI scan or manual entry.
3. **Analyse** (Analytics): Weight charts, macro breakdown, progress.
4. **Profil** (Profile): Settings, goals, account.

## Technology Stack
- **Framework**: React Native (Expo SDK 54+, Managed Workflow)
- **Language**: TypeScript (Strict Mode)
- **Routing**: Expo Router (File-based)
- **Styling**: NativeWind (Tailwind CSS for React Native)
- **State**: Zustand (client), TanStack Query (server)
- **Forms**: React Hook Form + Zod
- **Backend**: Supabase (PostgreSQL, Auth, Edge Functions, Storage)
- **AI**: Google Gemini 1.5 Flash (via Supabase Edge Functions)
- **Auth**: Email/Password only (MVP)
- **Language**: German (MVP), i18n via Edge Functions later

## Code Conventions (MUST FOLLOW)
- **No `any`**: All types must be explicit. Using `any` is strictly forbidden.
- **Feature-First Structure**: Group files by feature (`/features/auth`, `/features/journal`), not by type.
- **Custom Hooks**: Separate business logic from UI (`useAuth.ts` vs `LoginScreen.tsx`).
- **Naming**:
  - Components: `PascalCase` (e.g., `PrimaryButton.tsx`)
  - Functions/Variables: `camelCase` (e.g., `calculateTotalCalories`)
  - Hooks: `use` prefix (e.g., `useAuth`)
  - Constants: `UPPER_SNAKE_CASE` (e.g., `MAX_DAILY_CALORIES`)
- **Absolute Imports**: Use `@/components/Button` instead of `../../components/Button`.
- **Early Return**: Avoid deeply nested if/else blocks.
- **Immutability**: Always use spread operator for state updates, never `push`.

## Project Structure
```
MenuMate/
├── Docs/                   # Documentation
├── app/                    # Expo React Native App
│   ├── app/                # Screens & Navigation (Expo Router)
│   ├── components/ui/      # Reusable UI components (Atomic Design)
│   ├── features/           # Feature modules
│   │   ├── auth/           # Login, Register
│   │   ├── journal/        # Food diary, meal logging
│   │   ├── scan/           # Camera, AI processing
│   │   ├── analytics/      # Charts, progress
│   │   └── user/           # Profile, settings, TDEE
│   ├── hooks/              # App-wide custom hooks
│   ├── lib/                # Configurations (Supabase client, etc.)
│   └── types/              # Global TypeScript definitions
```

## Agent Behavior & Protocol
- **No Autonomous Assumptions**: Never make architectural or business logic decisions without user approval. When in doubt, ASK.
- **Self-Correction & Reflection**: actively question your own understanding of requirements. Verify if the proposed approach aligns with project goals before execution.
- **Task Management**:
  - Break down large user requests into smaller, logical implementation steps (work packages).
  - Inform the user immediately if a request is too complex to be handled in a single turn and propose a breakdown.
- **Transparency**:
  - Explain your reasoning and step-by-step plan BEFORE writing code.
  - The user must understand WHAT you are doing and WHY.
- **Factuality**: Do not invent APIs, libraries, or conventions that do not exist or haven't been confirmed. Stick to the known tech stack.
