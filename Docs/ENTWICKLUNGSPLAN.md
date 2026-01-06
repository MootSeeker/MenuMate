# MenuMate - Development Plan

## 📋 Project Idea

**MenuMate** is an intelligent health and fitness app designed to support weight and body fat loss through:

- **BMI Monitoring**: Continuous tracking of Body Mass Index
- **Smart Calorie Tracking**: Input of specific foods, products, and menus instead of manual calorie numbers
- **Product Database**: Automatic calorie and nutrient calculation based on food names
- **Mobile-First**: iOS app for on-the-go use, so you don't always need a PC
- **Progress Tracking**: Visualization of your successes and development

### Core Features

1. **User System**
   - User registration and login (email + password)
   - Personal profile (name, gender, age, height)
   - Authentication (JWT for sessions)
   - Optional: 2FA or SSO (social media) later

2. **BMI Calculator & Tracker**
   - Input of height, weight, gender, age (from user profile)
   - Automatic BMI calculation (weight / height², adjusted for gender/age)
   - BMI categories (underweight, normal, overweight, obese)
   - Historical BMI tracking per user

3. **Smart Nutrition Tracking**
   - Search for foods (e.g., "Apple", "Big Mac", "Spaghetti Carbonara")
   - Portion size selection
   - Automatic calorie and macronutrient calculation
   - Daily overview and personalized calorie budget (based on user profile)
   - User-specific calorie logs and goals

4. **Product Database**
   - Integration of food databases (e.g., OpenFoodFacts API, USDA FoodData Central)
   - Create custom products and recipes
   - Barcode scanner for quick product capture

5. **Progress Tracking**
   - Weight progress (charts)
   - Body fat tracking (optional)
   - Goal setting and milestones
   - Motivating statistics

## 🎯 Project Goals

- **Short-term**: Functional web app with user system, BMI calculation, and basic calorie tracking
- **Medium-term**: Integration of food database and advanced tracking features
- **Long-term**: Native iOS app with offline functionality

## 👤 User Management

- **Authentication**: Password-based login/register, JWT for secure sessions. Optional 2FA or SSO (e.g., Google, Apple) later.
- **Profile**: Personal data (name, email, gender, age, height) for BMI and calorie calculations.
- **Data Privacy**: Self-hosted, user data stored securely in MongoDB.
- **Integration**: Profile linked to all tracking (BMI, calories, progress) for personalized experience.

## 🛠 Technology Stack

### ✅ Chosen Stack: Progressive Web App (PWA)

We start with a **web app (React)** optimized for mobile.

- **Frontend**: React (Vite) + PWA features
- **Backend**: Node.js + Express
- **Database**: MongoDB (flexible for product data)
- **Hosting**:
  - Backend & DB: Home Server (Docker container, 24/7 accessible)
  - Frontend: Home Server (static serving) or Vercel
- **Strategy**: Development on PC, usage on iPhone as "Add to Home Screen" app. Later migration to React Native possible.

## 📊 Required Tools & Services

### Development Tools
- **IDE**: VS Code, Xcode (for iOS)
- **Version Control**: Git + GitHub
- **Package Manager**: npm/yarn or pip
- **Testing**: Jest, Pytest

### APIs & Data Sources
- **OpenFoodFacts API** (primary, free, EU-focused for European nutrition tables)
- **USDA FoodData Central API** (optional, free, US-focused – selectable by location)
- **Nutritionix API** (partially free)
- **Edamam Nutrition API** (freemium)

### Backend & Hosting
- **Node.js + Express**
- **Database**:
  - **MongoDB** (recommended for flexible product data) or PostgreSQL
  - Hosting: Docker container on Home Server
- **Hosting**:
  - **Home Server**: 24/7 operation, externally accessible
  - **Deployment**: Docker / Docker Compose
  - Vercel/Netlify (for frontend)

### Additional Libraries
- **Charts/Visualization**: Chart.js, Recharts, D3.js
- **Barcode Scanner**: QuaggaJS (Web), react-native-camera
- **Authentication**: Firebase Auth, Supabase Auth
- **UI Framework**:
  - React: Material-UI, Tailwind CSS, Chakra UI
  - React Native: NativeBase, React Native Paper

## 📅 Development Plan (Phases)

### Phase 1: MVP Web App & Infrastructure - 2-3 Weeks
**Goal**: Functional, responsive web app with user system and BMI calculation hosted on the home server

- [ ] **Infrastructure**:
    - [ ] Home Server Setup (Docker, Node.js, MongoDB)
    - [ ] Ensure Port-Forwarding / Remote Access
- **User System**:
    - [ ] User Registration/Login (email + password)
    - [ ] Personal Profile (name, gender, age, height)
    - [ ] Authentication (JWT for sessions)
    - [ ] Database schema for users (MongoDB)
- **BMI Calculation**:
    - [ ] Input form: Height, weight, gender, age (from profile)
    - [ ] BMI formula: weight / (height^2), adjusted for gender/age if needed
    - [ ] Display BMI with category (underweight, normal, overweight)
    - [ ] Save BMI history per user
- **Backend (API)**:
    - [ ] Express Server setup
    - [ ] MongoDB schema for users and BMI tracking
    - [ ] API endpoints for user auth, profile, and BMI
- **Frontend (React Web)**:
    - [ ] Initialize React project with Vite
    - [ ] Screens: Login/Register, Profile, BMI Calculator
    - [ ] Mobile-First Styling (CSS/Tailwind)

**Deliverable**: User can register, create profile, and calculate BMI. Data stored on home server.

### Phase 2: The Database & Search - 2-3 Weeks
**Goal**: Smart food tracking, user-specific

- [ ] **Location-Based API Selection**: User can choose region (EU/US) in settings to switch between OpenFoodFacts and USDA
- [ ] Integrate OpenFoodFacts API (primary)
- [ ] Product search and detail view
- [ ] Save consumed foods (calorie log)
- [ ] Daily overview per user (calories vs. personal budget)
- [ ] History: Weight, BMI, calorie logs per user
- [ ] **Barcode Scanner (Web)**: Integrate `QuaggaJS` or `html5-qrcode`

**Deliverable**: Track menus and products, personalized per user.

### Phase 3: PWA Features & Visualization - 1-2 Weeks
**Goal**: "App feeling" on iPhone

- [ ] PWA Manifest (icon, name, theme color)
- [ ] Service Worker (offline support for basics)
- [ ] Charts for weight progress
- [ ] BMI progress / statistics

## 🚀 Quick Start - First Steps

### 1. Set up Backend (Home Server / Local)

```bash
mkdir menumate-backend
cd menumate-backend
npm init -y
npm install express mongoose cors dotenv
# Create Dockerfile
```

### 2. Initialize Frontend (React)

```bash
npm create vite@latest menumate-frontend -- --template react
cd menumate-frontend
npm install
npm install axios react-router-dom
npm run dev
```

## 📚 Resources & Learning

### APIs
- [OpenFoodFacts API Docs](https://openfoodfacts.github.io/api-documentation/)

### Tutorials
- [React Docs](https://react.dev/)
- [Express.js Guide](https://expressjs.com)
- [Mongoose (MongoDB) Docs](https://mongoosejs.com/)
- [MDN PWA Guide](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)

### Design Inspiration
- MyFitnessPal, Yazio

## 🎨 Next Steps

1. **Decide**: Which tech stack? (Recommendation: React + Node.js)
2. **Set up project**: Create basic structure
3. **Wireframes/Mockups**: Rough UI sketches of main screens
4. **Develop MVP**: Start with BMI calculator and basic tracking
5. **Iterate**: Test, gather feedback, improve

---

**Ready to get started?** Tell me which tech stack you want to start with, and I'll help with the setup! 🚀
