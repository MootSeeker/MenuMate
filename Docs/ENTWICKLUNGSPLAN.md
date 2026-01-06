# BodyPlan - Entwicklungsplan

## 📋 Projektidee

**BodyPlan** ist eine intelligente Gesundheits- und Fitness-App zur Unterstützung beim Gewichts- und Körperfettverlust durch:

- **BMI-Überwachung**: Kontinuierliche Verfolgung des Body-Mass-Index
- **Intelligentes Kalorien-Tracking**: Eingabe von konkreten Lebensmitteln, Produkten und Menüs statt manueller Kalorienzahlen
- **Produktdatenbank**: Automatische Kalorien- und Nährstoffberechnung basierend auf Lebensmittelnamen
- **Mobile-First**: iOS-App für unterwegs, damit du nicht immer einen PC dabei haben musst
- **Fortschrittsverfolgung**: Visualisierung deiner Erfolge und Entwicklung

### Kernfeatures

1. **BMI-Rechner & Tracker**
   - Eingabe von Größe und Gewicht
   - Automatische BMI-Berechnung
   - Historische Darstellung der BMI-Entwicklung

2. **Intelligentes Ernährungs-Tracking**
   - Suche nach Lebensmitteln (z.B. "Apfel", "Big Mac", "Spaghetti Carbonara")
   - Portionsgrößen-Auswahl
   - Automatische Kalorien- und Makronährstoff-Berechnung
   - Tagesübersicht und Kalorienbudget

3. **Produktdatenbank**
   - Integration von Lebensmitteldatenbanken (z.B. OpenFoodFacts API, USDA FoodData Central)
   - Eigene Produkte und Rezepte anlegen
   - Barcode-Scanner für schnelle Produkterfassung

4. **Fortschrittstracking**
   - Gewichtsverlauf (Diagramme)
   - Körperfett-Tracking (optional)
   - Zielsetzung und Meilensteine
   - Motivierende Statistiken

## 🎯 Projektziele

- **Kurzfristig**: Funktionierende Web-App mit Basis-Features (BMI, Kalorien-Tracking)
- **Mittelfristig**: Integration von Lebensmitteldatenbank und erweiterte Tracking-Features
- **Langfristig**: Native iOS-App mit Offline-Funktionalität

## 🛠 Technologie-Stack

### ✅ Gewählter Stack: Progressive Web App (PWA)

Wir starten mit einer **Web App (React)**, die für Mobile optimiert ist.

- **Frontend**: React (Vite) + PWA Features
- **Backend**: Node.js + Express
- **Datenbank**: MongoDB (flexibel für Produktdaten)
- **Hosting**: 
  - Backend & DB: Home Server (Docker Container, 24/7 erreichbar)
  - Frontend: Home Server (Static Serving) oder Vercel
- **Strategie**: Entwicklung am PC, Nutzung am iPhone als "Add to Home Screen" App. Später Migration zu React Native möglich.

## 📊 Benötigte Tools & Services

### Entwicklungs-Tools
- **IDE**: VS Code, Xcode (für iOS)
- **Version Control**: Git + GitHub
- **Package Manager**: npm/yarn oder pip
- **Testing**: Jest, Pytest

### APIs & Datenquellen
- **OpenFoodFacts API** (kostenlos, große Produktdatenbank)
- **USDA FoodData Central API** (kostenlos, US-fokussiert)
- **Nutritionix API** (teilweise kostenlos)
- **Edamam Nutrition API** (freemium)

### Backend & Hosting
- ****Node.js + Express**
- **Datenbank**: 
  - **MongoDB** (Empfohlen für flexible Produktdaten) oder PostgreSQL
  - Hosting: Docker Container auf Home Server
- **Hosting**: 
  - **Home Server**: 24/7 Betrieb, extern erreichbar
  - **Deployment**: Docker / Docker Compose
  - Vercel/Netlify (für Frontend)

### Zusätzliche Libraries
- **Charts/Visualisierung**: Chart.js, Recharts, D3.js
- **Barcode-Scanner**: QuaggaJS (Web), react-native-camera
- **Authentifizierung**: Firebase Auth, Supabase Auth
- **UI-Framework**: 
  - React: Material-UI, Tailwind CSS, Chakra UI
  - React Native: NativeBase, React Native Paper

## 📅 Entwicklungsplan (Phasen)
Web App & Infrastructure - 2-3 Wochen
**Ziel**: Lauffähige, responsive Web App, gehostet auf dem Home Server

- [ ] **Infrastructure**:
    - [ ] Home Server Setup (Docker, Node.js, MongoDB)
    - [ ] Port-Forwarding / Remote Access sicherstellen
- **Backend (API)**:
    - [ ] Express Server aufsetzen
    - [ ] MongoDB Schema für User/Tracking definieren
    - [ ] API-Endpoints für BMI/Gewicht erstellen
- **Frontend (React Web)**:
    - [ ] React Projekt mit Vite initialisieren
    - [ ] Screen: BMI Rechner
    - [ ] Screen: Gewichts-Input
    - [ ] Mobile-First Styling (CSS/Tailwind)

**Deliverable**: App im Browser auf dem iPhone aufrufbar, Daten auf Home Server.

### Phase 2: Die Datenbank & Suche - 2-3 Wochen
**Ziel**: Intelligentes Food-Tracking

- [ ] Integration OpenFoodFacts API
- [ ] Produktsuche und Detailansicht
- [ ] Speichern von konsumierten Lebensmitteln (Kalorien-Log)
- [ ] Tagesübersicht (Kalorien vs. Budget)
- [ ] **Barcode-Scanner (Web)**: Integration von `QuaggaJS` oder `html5-qrcode`

**Deliverable**: Menüs und Produkte tracken.

### Phase 3: PWA Features & Visualisierung - 1-2 Wochen
**Ziel**: "App-Feeling" auf dem iPhone

- [ ] PWA Manifest (Icon, Name, Theme Color)
- [ ] Service Worker (Offline Support für Basics)
- [ ] Diagramme für Gewichtsverlauf
- [ ] BMI-Verlauf / Statistiken

## 🚀 Quick Start - Erste Schritte

### 1. Backend aufsetzen (Home Server / Lokal)

```bash
mkdir bodyplan-backend
cd bodyplan-backend
npm init -y
npm install express mongoose cors dotenv
# Dockerfile erstellen
```

### 2. Frontend initialisieren (React)

```bash
npm create vite@latest bodyplan-frontend -- --template react
cd bodyplan-frontend
npm install
npm install axios react-router-dom
npm run dev
```

## 📚 Ressourcen & Learning

### APIs
- [OpenFoodFacts API Docs](https://openfoodfacts.github.io/api-documentation/)

### Tutorials
- [React Docs](https://react.dev/)
- [Express.js Guide](https://expressjs.com)
- [Mongoose (MongoDB) Docs](https://mongoosejs.com/)
- [MDN PWA Guide](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)n
- MyFitnessPal, Yazio


## 🎨 Nächste Schritte

1. **Entscheidung treffen**: Welcher Tech-Stack? (Empfehlung: React + Node.js)
2. **Projekt aufsetzen**: Grundstruktur erstellen
3. **Wireframes/Mockups**: Grobe UI-Skizzen der wichtigsten Screens
4. **MVP entwickeln**: Mit BMI-Rechner und Basis-Tracking starten
5. **Iterieren**: Testen, Feedback einholen, verbessern

---

**Bereit loszulegen?** Sag mir, mit welchem Tech-Stack du starten möchtest, und ich helfe dir beim Setup! 🚀
