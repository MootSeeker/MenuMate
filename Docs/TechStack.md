# MenuMate - Technology Stack

## Core Architecture
**Type:** Cross-Platform Mobile Application
**Approch:** React Native (managed via Expo)

## Frontend (Mobile App)
- **Framework:** [Expo](https://expo.dev/) (SDK 52+)
  - *Why:* De-facto standard for React Native in 2026. Handles native builds, OTA updates, and simplifies development.
- **Language:** TypeScript
- **Styling:** [NativeWind](https://www.nativewind.dev/) (Tailwind CSS for React Native)
  - *Why:* Rapid UI development, consistency across platforms, popular 'utility-first' approach.
- **Navigation:** [Expo Router](https://docs.expo.dev/router/introduction/)
  - *Why:* File-based routing (similar to Next.js), deep linking support out-of-the-box.
- **Data Fetching:** [TanStack Query (React Query)](https://tanstack.com/query/latest)
  - *Why:* Best-in-class for async server state management, caching, and background updates.
- **Local State:** [Zustand](https://github.com/pmndrs/zustand) (if global client-state is needed) or React Context.
- **Forms:** React Hook Form + Zod (Validation).

## Backend & Infrastructure ("Serverless")
- **Platform:** [Supabase](https://supabase.com/)
  - **Database:** PostgreSQL
  - **Auth:** Supabase Auth (Email/Password only for MVP).
  - **Storage:** Supabase Storage (User meal photos).
  - **Logic:** Supabase Edge Functions (Deno/TypeScript) for secure API calls, AI processing and future translations.

## Artificial Intelligence
- **Model:** Google Gemini 1.5 Flash
- **Integration:** Via Supabase Edge Functions.
- **Capabilities:** Multimodal (Vision) - Can analyze images uploaded by users to identify food items and estimate nutritional values.
- **Cost Tier:** Free Tier (within rate limits) for MVP.

## Native Integration
- **Health:** `expo-health-connect` (Android) / `apple-healthkit` (via Expo Plugins).
- **Camera:** `expo-camera`.
