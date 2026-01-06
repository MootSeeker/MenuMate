# MenuMate - Development Plan

## 📋 Project Idea

**MenuMate** is an intelligent health and fitness app designed to support weight and body fat loss through:

- **BMI Monitoring**: Continuous tracking of Body Mass Index
- **Smart Calorie Tracking**: Input of specific foods, products, and menus instead of manual calorie numbers
- **Product Database**: Automatic calorie and nutrient calculation based on food names
- **Mobile-First**: iOS app for on-the-go use, so you don't always need a PC
- **Progress Tracking**: Visualization of your successes and development

### Core Features

1. **BMI Calculator & Tracker**
   - Input of height and weight
   - Automatic BMI calculation
   - Historical display of BMI development

2. **Smart Nutrition Tracking**
   - Search for foods (e.g., "Apple", "Big Mac", "Spaghetti Carbonara")
   - Portion size selection
   - Automatic calorie and macronutrient calculation
   - Daily overview and calorie budget

3. **Product Database**
   - Integration of food databases (e.g., OpenFoodFacts API, USDA FoodData Central)
   - Create custom products and recipes
   - Barcode scanner for quick product capture

4. **Progress Tracking**
   - Weight progress (charts)
   - Body fat tracking (optional)
   - Goal setting and milestones
   - Motivating statistics

## 🎯 Project Goals

- **Short-term**: Functional web app with basic features (BMI, calorie tracking)
- **Medium-term**: Integration of food database and advanced tracking features
- **Long-term**: Native iOS app with offline functionality

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
- **OpenFoodFacts API** (free, large product database)
- **USDA FoodData Central API** (free, US-focused)
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
**Goal**: Functional, responsive web app hosted on the home server

- [ ] **Infrastructure**:
    - [ ] Home Server Setup (Docker, Node.js, MongoDB)
    - [ ] Ensure Port-Forwarding / Remote Access
- **Backend (API)**:
    - [ ] Set up Express server
    - [ ] Define MongoDB schema for user/tracking
    - [ ] Create API endpoints for BMI/weight
- **Frontend (React Web)**:
    - [ ] Initialize React project with Vite
    - [ ] Screen: BMI Calculator
    - [ ] Screen: Weight Input
    - [ ] Mobile-First Styling (CSS/Tailwind)

**Deliverable**: App accessible in browser on iPhone, data on home server.

### Phase 2: The Database & Search - 2-3 Weeks
**Goal**: Smart food tracking

- [ ] Integrate OpenFoodFacts API
- [ ] Product search and detail view
- [ ] Save consumed foods (calorie log)
- [ ] Daily overview (calories vs. budget)
- [ ] **Barcode Scanner (Web)**: Integrate `QuaggaJS` or `html5-qrcode`

**Deliverable**: Track menus and products.

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
