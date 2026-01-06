# BodyPlan Project Instructions

## Project Context
**BodyPlan** is a self-hosted health and fitness PWA (Progressive Web App) designed for tracking BMI, weight, and calories. The core philosophy is "Product-based tracking" (menus/items) rather than manually entering calories.

## Technology Stack
- **Frontend**: React (Vite) + Mobile-First CSS (Tailwind/Standard). PWA capabilities (Manifest, Service Worker).
- **Backend**: Node.js + Express.
- **Database**: MongoDB (running in Docker on Home Server).
- **Environment**: Managed via Docker Compose for easy deployment on a home server.

## Architecture
- **Client-Server**: API-based communication. The frontend consumes the backend REST API.
- **Mobile Focus**: The frontend must be responsive and optimized for mobile viewports (iPhone), using "Add to Home Screen" for the app experience.
- **Data Source**: OpenFoodFacts API for product data, local MongoDB for user logs.

## Development Workflow
- **Plan**: Refer to `ENTWICKLUNGSPLAN.md` for the current roadmap and phase definitions.
- **Languages**: 
  - User prompts are in **German**.
  - Code variables/functions should be in **English**.
  - Documentation/Comments should be in **English**.

## Conventions
- **Files**:
  - `bodyplan-frontend/`: React application.
  - `bodyplan-backend/`: Express API.
- **Git**: Commit messages should be descriptive.

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
