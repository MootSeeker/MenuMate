# MenuMate - GitHub Issues (Detailliert)

> **Anleitung**: Jeder Issue-Block ist ein separates GitHub Issue. Sub-Issues sind eingerückt und werden als eigene Issues erstellt, dann im Parent verlinkt.
> 
> **Format:**
> - **Story Points**: 1 (trivial), 2 (klein), 3 (mittel), 5 (groß), 8 (sehr groß), 13 (epic)
> - **Acceptance Criteria**: Given/When/Then Format
> - **Dependencies**: "Blocked by: #issue-nummer"

---

# 🏗️ Epic 1: Projekt-Setup & Infrastruktur

---

## Issue: [SETUP-001] Supabase Projekt erstellen und Client konfigurieren

**Beschreibung:**
Erstelle ein neues Supabase-Projekt auf supabase.com und richte den Client in der App ein. Dies ist die Grundlage für alle Backend-Funktionen (Auth, Database, Storage, Edge Functions).

**Story Points:** 3

**Abhängigkeiten:** Keine

**Akzeptanzkriterien:**
- **Given** ein neues Supabase-Projekt existiert
- **When** ich die App starte
- **Then** kann der Supabase Client eine Verbindung herstellen (Health Check)

- **Given** die Environment Variables sind konfiguriert
- **When** ich `supabase.auth.getSession()` aufrufe
- **Then** erhalte ich eine valide Response (auch wenn null)

**Tasks:**
- [ ] Supabase-Projekt auf supabase.com erstellen
- [ ] `.env` Datei mit `EXPO_PUBLIC_SUPABASE_URL` und `EXPO_PUBLIC_SUPABASE_ANON_KEY` anlegen
- [ ] `.env.example` Datei für andere Entwickler erstellen
- [ ] `lib/supabase.ts` mit Client-Initialisierung erstellen
- [ ] AsyncStorage für Session-Persistierung konfigurieren
- [ ] Connection-Test in der App durchführen

**Labels:** `setup`, `backend`, `priority: high`

---

## Issue: [SETUP-002] Datenbank-Schema entwerfen (ERD)

**Beschreibung:**
Bevor wir Migrationen schreiben, muss das komplette Datenbankschema als Entity Relationship Diagram (ERD) dokumentiert werden. Dies dient als Referenz für alle Entwickler.

**Story Points:** 5

**Abhängigkeiten:** Blocked by: [SETUP-001]

**Akzeptanzkriterien:**
- **Given** das ERD ist erstellt
- **When** ein Entwickler die Datenbankstruktur verstehen möchte
- **Then** kann er alle Tabellen, Relationen und Felder im Diagramm nachschlagen

**Tasks:**
- [ ] ERD-Tool auswählen (dbdiagram.io, Mermaid, oder Supabase Schema Visualizer)
- [ ] Alle Entitäten identifizieren (Users, Profiles, FoodEntries, etc.)
- [ ] Relationen definieren (1:1, 1:n, n:m)
- [ ] Datentypen für alle Felder festlegen
- [ ] ERD als Bild/Code in `Docs/Database.md` speichern

**Vorgeschlagene Tabellen:**
```
profiles (1:1 mit auth.users)
├── id (UUID, FK -> auth.users.id)
├── display_name
├── gender (enum: male, female, diverse)
├── birth_date
├── height_cm
├── activity_level (enum)
├── goal (enum: lose, maintain, gain)
├── daily_calorie_goal
├── created_at
└── updated_at

food_entries
├── id (UUID)
├── user_id (FK -> profiles.id)
├── date
├── meal_type (enum: breakfast, lunch, dinner, snack)
├── food_name
├── calories
├── protein_g
├── carbs_g
├── fat_g
├── portion_size
├── portion_unit
├── source (enum: manual, openfoodfacts, ai_scan, custom)
├── image_url (nullable)
└── created_at

custom_foods
├── id (UUID)
├── user_id (FK -> profiles.id)
├── name
├── brand (nullable)
├── calories_per_100g
├── protein_per_100g
├── carbs_per_100g
├── fat_per_100g
├── default_portion_size
├── default_portion_unit
└── created_at

weight_logs
├── id (UUID)
├── user_id (FK -> profiles.id)
├── weight_kg
├── date
├── notes (nullable)
└── created_at

user_gamification
├── id (UUID)
├── user_id (FK -> profiles.id)
├── total_points
├── current_level
├── current_streak
├── longest_streak
├── last_activity_date
└── updated_at

point_transactions
├── id (UUID)
├── user_id (FK -> profiles.id)
├── points (kann negativ sein für Decay)
├── reason (enum: meal_logged, goal_reached, streak_bonus, decay)
├── created_at
```

**Labels:** `backend`, `database`, `documentation`, `priority: high`

---

## Issue: [SETUP-003] Datenbank-Migrationen erstellen

**Beschreibung:**
Basierend auf dem ERD werden die SQL-Migrationen für alle Tabellen erstellt und in Supabase ausgeführt.

**Story Points:** 5

**Abhängigkeiten:** Blocked by: [SETUP-002]

**Akzeptanzkriterien:**
- **Given** die Migrationen wurden ausgeführt
- **When** ich die Supabase Tabellen-Übersicht öffne
- **Then** sehe ich alle definierten Tabellen mit korrekten Spalten und Relationen

- **Given** Row Level Security ist aktiviert
- **When** ein User versucht, Daten eines anderen Users abzufragen
- **Then** wird die Anfrage blockiert (leeres Ergebnis)

**Tasks:**
- [ ] Migration für `profiles` Tabelle
- [ ] Migration für `food_entries` Tabelle
- [ ] Migration für `custom_foods` Tabelle
- [ ] Migration für `weight_logs` Tabelle
- [ ] Migration für `user_gamification` Tabelle
- [ ] Migration für `point_transactions` Tabelle
- [ ] Enum-Types erstellen (meal_type, activity_level, goal, food_source, point_reason)
- [ ] Foreign Key Constraints definieren
- [ ] Indexes für häufige Queries erstellen
- [ ] RLS Policies für alle Tabellen definieren

**Labels:** `backend`, `database`, `priority: high`

---

## Issue: [SETUP-004] TypeScript Types aus Supabase generieren

**Beschreibung:**
Supabase kann automatisch TypeScript-Typen aus dem Datenbankschema generieren. Diese werden in der App für Type-Safety verwendet.

**Story Points:** 2

**Abhängigkeiten:** Blocked by: [SETUP-003]

**Akzeptanzkriterien:**
- **Given** die Types wurden generiert
- **When** ich `supabase.from('food_entries').select('*')` aufrufe
- **Then** ist der Return-Type korrekt typisiert (kein `any`)

**Tasks:**
- [ ] Supabase CLI lokal installieren (`npm install -D supabase`)
- [ ] `supabase login` ausführen
- [ ] `supabase gen types typescript` Script in package.json hinzufügen
- [ ] Types in `types/supabase.ts` speichern
- [ ] Types in Supabase Client einbinden

**Labels:** `setup`, `backend`, `typescript`

---

## Issue: [SETUP-005] NativeWind (Tailwind CSS) konfigurieren

**Beschreibung:**
NativeWind v4 ermöglicht Tailwind CSS in React Native. Die Konfiguration muss korrekt eingerichtet werden, um Styling in der gesamten App zu ermöglichen.

**Story Points:** 3

**Abhängigkeiten:** Keine

**Akzeptanzkriterien:**
- **Given** NativeWind ist konfiguriert
- **When** ich `className="bg-blue-500 p-4 rounded-lg"` auf einer View verwende
- **Then** wird die View mit blauem Hintergrund, Padding und abgerundeten Ecken gerendert

- **Given** die App läuft
- **When** ich Hot Reload auslöse
- **Then** werden Tailwind-Klassen korrekt aktualisiert

**Tasks:**
- [ ] `metro.config.js` mit NativeWind Preset erstellen
- [ ] `babel.config.js` für NativeWind anpassen
- [ ] `tailwind.config.js` mit Content-Pfaden konfigurieren
- [ ] `global.css` mit Tailwind Directives erstellen
- [ ] `global.css` in Root Layout importieren
- [ ] `nativewind-env.d.ts` für TypeScript erstellen
- [ ] Test-Komponente mit verschiedenen Tailwind-Klassen erstellen
- [ ] Dark Mode Klassen testen (`dark:bg-gray-900`)

**Labels:** `setup`, `frontend`, `styling`, `priority: high`

---

## Issue: [SETUP-006] ESLint & Prettier konfigurieren

**Beschreibung:**
Code-Qualität und einheitliche Formatierung durch Linting und automatische Formatierung sicherstellen.

**Story Points:** 2

**Abhängigkeiten:** Keine

**Akzeptanzkriterien:**
- **Given** ESLint ist konfiguriert
- **When** ich Code mit Fehlern schreibe (z.B. `any` Type)
- **Then** zeigt ESLint einen Fehler an

- **Given** Prettier ist konfiguriert
- **When** ich eine Datei speichere
- **Then** wird sie automatisch formatiert

**Tasks:**
- [ ] `.eslintrc.js` mit React Native + TypeScript Rules erstellen
- [ ] `@typescript-eslint/no-explicit-any` als Error konfigurieren
- [ ] `.prettierrc` mit Projekt-Standards erstellen
- [ ] VS Code Settings für "Format on Save" dokumentieren
- [ ] `npm run lint` Script hinzufügen
- [ ] `npm run lint:fix` Script hinzufügen

**Labels:** `setup`, `tooling`, `code-quality`

---

## Issue: [SETUP-007] CI/CD Pipeline mit GitHub Actions

**Beschreibung:**
Automatisierte Checks bei jedem Pull Request, um Code-Qualität sicherzustellen.

**Story Points:** 5

**Abhängigkeiten:** Blocked by: [SETUP-006]

**Akzeptanzkriterien:**
- **Given** ein PR wird erstellt
- **When** der CI Workflow läuft
- **Then** werden Lint, TypeScript Check und Tests ausgeführt

- **Given** ein Check schlägt fehl
- **When** ich den PR anschaue
- **Then** sehe ich welcher Check fehlgeschlagen ist und warum

**Tasks:**
- [ ] `.github/workflows/ci.yml` erstellen
- [ ] Job: `npm ci` (Dependencies installieren)
- [ ] Job: `npm run lint` (ESLint)
- [ ] Job: `npm run typecheck` (tsc --noEmit)
- [ ] Job: `npm test` (Jest)
- [ ] Job: `npm audit --audit-level=high` (Security)
- [ ] Branch Protection Rule für `main` dokumentieren

**Labels:** `setup`, `devops`, `ci-cd`

---

## Issue: [SETUP-008] Absolute Imports konfigurieren

**Beschreibung:**
Absolute Imports (`@/components/Button`) statt relativer Pfade (`../../components/Button`) für bessere Lesbarkeit.

**Story Points:** 1

**Abhängigkeiten:** Keine

**Akzeptanzkriterien:**
- **Given** absolute Imports sind konfiguriert
- **When** ich `import { Button } from '@/components/ui/Button'` schreibe
- **Then** wird der Import korrekt aufgelöst (kein Fehler)

**Tasks:**
- [ ] `tsconfig.json` mit `baseUrl` und `paths` erweitern
- [ ] Babel Module Resolver konfigurieren (falls nötig)
- [ ] Bestehende Imports migrieren
- [ ] Dokumentation in `Development.md` ergänzen

**Labels:** `setup`, `dx`

---

# 🔐 Epic 2: Authentifizierung

---

## Issue: [AUTH-001] Auth Store mit Zustand erstellen

**Beschreibung:**
Globaler State für Authentifizierung, der Session, User-Daten und Auth-Status verwaltet.

**Story Points:** 3

**Abhängigkeiten:** Blocked by: [SETUP-001]

**Akzeptanzkriterien:**
- **Given** der Auth Store existiert
- **When** ich `useAuthStore()` aufrufe
- **Then** erhalte ich Zugriff auf `user`, `session`, `isLoading`, `isAuthenticated`

- **Given** eine Session existiert in AsyncStorage
- **When** die App startet
- **Then** wird der User automatisch eingeloggt

**Tasks:**
- [ ] `features/auth/stores/authStore.ts` erstellen
- [ ] State: `user`, `session`, `isLoading`, `isAuthenticated`
- [ ] Action: `initialize()` - Session aus AsyncStorage laden
- [ ] Action: `signIn(email, password)`
- [ ] Action: `signUp(email, password)`
- [ ] Action: `signOut()`
- [ ] Supabase Auth State Change Listener einrichten
- [ ] Unit Tests für Store Actions

**Labels:** `feature`, `auth`, `state-management`, `priority: high`

---

## Issue: [AUTH-002] Login Screen UI

**Beschreibung:**
Der Login-Screen ermöglicht bestehenden Usern die Anmeldung mit E-Mail und Passwort.

**Story Points:** 3

**Abhängigkeiten:** Blocked by: [AUTH-001], [SETUP-005]

**Akzeptanzkriterien:**
- **Given** ich bin auf dem Login Screen
- **When** ich gültige Credentials eingebe und "Anmelden" drücke
- **Then** werde ich zum Tagebuch weitergeleitet

- **Given** ich bin auf dem Login Screen
- **When** ich ungültige Credentials eingebe
- **Then** sehe ich eine Fehlermeldung

- **Given** der Login läuft
- **When** ich warte
- **Then** sehe ich einen Loading-Indicator und der Button ist disabled

**Tasks:**
- [ ] `features/auth/screens/LoginScreen.tsx` erstellen
- [ ] Logo/App-Name Header
- [ ] E-Mail Input mit Keyboard Type "email-address"
- [ ] Passwort Input mit secureTextEntry
- [ ] "Passwort vergessen?" Link (Platzhalter)
- [ ] "Anmelden" Button
- [ ] Link zu Registrierung
- [ ] React Hook Form Integration
- [ ] Zod Validierung (E-Mail Format, Passwort min. 1 Zeichen)
- [ ] Error State Anzeige
- [ ] Loading State Anzeige

**Labels:** `feature`, `auth`, `frontend`, `priority: high`

---

### Sub-Issue: [AUTH-002-A] Login Formular Validierung

**Beschreibung:**
Client-seitige Validierung der Login-Eingaben mit React Hook Form und Zod.

**Story Points:** 2

**Abhängigkeiten:** Blocked by: [AUTH-002]

**Akzeptanzkriterien:**
- **Given** ich gebe eine ungültige E-Mail ein
- **When** ich das Feld verlasse oder Submit drücke
- **Then** sehe ich "Bitte gib eine gültige E-Mail-Adresse ein"

- **Given** ich lasse das Passwort-Feld leer
- **When** ich Submit drücke
- **Then** sehe ich "Passwort ist erforderlich"

**Tasks:**
- [ ] Zod Schema für Login erstellen
- [ ] `useForm` mit `zodResolver` konfigurieren
- [ ] Fehlermeldungen unter den Inputs anzeigen
- [ ] Input-Rahmen bei Fehler rot färben
- [ ] Fehlermeldungen auf Deutsch

**Labels:** `feature`, `auth`, `validation`

---

## Issue: [AUTH-003] Registrierungs Screen UI

**Beschreibung:**
Der Registrierungs-Screen ermöglicht neuen Usern die Erstellung eines Accounts.

**Story Points:** 3

**Abhängigkeiten:** Blocked by: [AUTH-001], [SETUP-005]

**Akzeptanzkriterien:**
- **Given** ich bin auf dem Registrierungs-Screen
- **When** ich gültige Daten eingebe und "Registrieren" drücke
- **Then** erhalte ich eine Bestätigung und werde zum Onboarding weitergeleitet

- **Given** die E-Mail ist bereits registriert
- **When** ich "Registrieren" drücke
- **Then** sehe ich "Diese E-Mail ist bereits registriert"

**Tasks:**
- [ ] `features/auth/screens/RegisterScreen.tsx` erstellen
- [ ] E-Mail Input
- [ ] Passwort Input
- [ ] Passwort bestätigen Input
- [ ] "Registrieren" Button
- [ ] Link zu Login ("Bereits ein Konto?")
- [ ] React Hook Form Integration
- [ ] Loading & Error States

**Labels:** `feature`, `auth`, `frontend`, `priority: high`

---

### Sub-Issue: [AUTH-003-A] Registrierung Formular Validierung

**Beschreibung:**
Erweiterte Validierung für die Registrierung inkl. Passwort-Anforderungen.

**Story Points:** 2

**Abhängigkeiten:** Blocked by: [AUTH-003]

**Akzeptanzkriterien:**
- **Given** ich gebe ein Passwort mit weniger als 8 Zeichen ein
- **When** ich Submit drücke
- **Then** sehe ich "Passwort muss mindestens 8 Zeichen lang sein"

- **Given** Passwort und Bestätigung stimmen nicht überein
- **When** ich Submit drücke
- **Then** sehe ich "Passwörter stimmen nicht überein"

**Tasks:**
- [ ] Zod Schema für Registrierung erstellen
- [ ] Passwort-Regeln: min. 8 Zeichen, mind. 1 Zahl
- [ ] Passwort-Bestätigung muss übereinstimmen
- [ ] Passwort-Stärke-Indikator (optional)
- [ ] Alle Fehlermeldungen auf Deutsch

**Labels:** `feature`, `auth`, `validation`

---

## Issue: [AUTH-004] Protected Routes & Auth Guard

**Beschreibung:**
Nicht authentifizierte User werden automatisch zur Login-Seite weitergeleitet.

**Story Points:** 3

**Abhängigkeiten:** Blocked by: [AUTH-001]

**Akzeptanzkriterien:**
- **Given** ich bin nicht eingeloggt
- **When** ich versuche das Tagebuch zu öffnen
- **Then** werde ich zum Login weitergeleitet

- **Given** ich bin eingeloggt
- **When** ich die App öffne
- **Then** lande ich direkt im Tagebuch (nicht Login)

**Tasks:**
- [ ] `components/AuthGuard.tsx` erstellen
- [ ] Auth-Status aus Store prüfen
- [ ] Loading State während Session-Check anzeigen
- [ ] Redirect zu `/login` wenn nicht authentifiziert
- [ ] Expo Router Layout anpassen
- [ ] Auth-Routes (login, register) für eingeloggte User sperren

**Labels:** `feature`, `auth`, `navigation`, `priority: high`

---

## Issue: [AUTH-005] Logout Funktionalität

**Beschreibung:**
User können sich aus der App ausloggen.

**Story Points:** 1

**Abhängigkeiten:** Blocked by: [AUTH-001]

**Akzeptanzkriterien:**
- **Given** ich bin eingeloggt
- **When** ich auf "Abmelden" drücke
- **Then** werde ich ausgeloggt und zum Login-Screen weitergeleitet

- **Given** ich mich ausgeloggt habe
- **When** ich die App neu starte
- **Then** bin ich weiterhin ausgeloggt

**Tasks:**
- [ ] Logout Button im Profil-Screen
- [ ] Confirmation Dialog ("Wirklich abmelden?")
- [ ] `signOut()` Action aufrufen
- [ ] Session aus AsyncStorage löschen
- [ ] Redirect zu Login

**Labels:** `feature`, `auth`

---

# 👤 Epic 3: Onboarding & User-Profil

---

## Issue: [ONBOARD-001] Onboarding Flow Architektur

**Beschreibung:**
Multi-Step Wizard für neue User, um alle notwendigen Daten zu erfassen. Der Flow besteht aus 4 Schritten.

**Story Points:** 2

**Abhängigkeiten:** Blocked by: [AUTH-003]

**Akzeptanzkriterien:**
- **Given** ein neuer User hat sich registriert
- **When** er zum ersten Mal die App öffnet
- **Then** wird er durch den Onboarding-Flow geleitet

- **Given** der User ist mitten im Onboarding
- **When** er die App schließt und wieder öffnet
- **Then** setzt er am gleichen Schritt fort (Persistierung)

**Tasks:**
- [ ] Onboarding State Store erstellen
- [ ] Step-Tracking (currentStep, completedSteps)
- [ ] Temporäre Daten zwischen Steps speichern
- [ ] Navigation zwischen Steps
- [ ] Progress-Indicator Komponente
- [ ] "Überspringen" Option (falls erlaubt)

**Labels:** `feature`, `onboarding`, `architecture`, `priority: high`

---

### Sub-Issue: [ONBOARD-001-A] Onboarding Step 1: Persönliche Daten

**Beschreibung:**
Erfassung von Geschlecht und Geburtsdatum.

**Story Points:** 3

**Abhängigkeiten:** Blocked by: [ONBOARD-001]

**Akzeptanzkriterien:**
- **Given** ich bin auf Step 1
- **When** ich Geschlecht und Geburtsdatum eingebe
- **Then** kann ich zu Step 2 weitergehen

- **Given** ich habe kein Geschlecht ausgewählt
- **When** ich "Weiter" drücke
- **Then** sehe ich einen Fehler "Bitte wähle dein Geschlecht"

**Tasks:**
- [ ] `features/onboarding/screens/Step1PersonalScreen.tsx`
- [ ] Geschlecht-Auswahl (Männlich, Weiblich, Divers) als Buttons/Cards
- [ ] Geburtsdatum-Picker
- [ ] Alter aus Geburtsdatum berechnen
- [ ] Validierung: Geschlecht erforderlich, Alter zwischen 13-120
- [ ] "Weiter" Button

**Labels:** `feature`, `onboarding`, `frontend`

---

### Sub-Issue: [ONBOARD-001-B] Onboarding Step 2: Körperdaten

**Beschreibung:**
Erfassung von Größe und aktuellem Gewicht.

**Story Points:** 3

**Abhängigkeiten:** Blocked by: [ONBOARD-001]

**Akzeptanzkriterien:**
- **Given** ich bin auf Step 2
- **When** ich Größe und Gewicht eingebe
- **Then** kann ich zu Step 3 weitergehen

- **Given** ich gebe unrealistische Werte ein (z.B. 500kg)
- **When** ich "Weiter" drücke
- **Then** sehe ich einen Validierungsfehler

**Tasks:**
- [ ] `features/onboarding/screens/Step2BodyScreen.tsx`
- [ ] Größe Input (in cm) mit Slider oder Nummernfeld
- [ ] Gewicht Input (in kg) mit Dezimalstellen
- [ ] Validierung: Größe 100-250cm, Gewicht 30-300kg
- [ ] BMI Vorschau anzeigen (optional)
- [ ] "Zurück" und "Weiter" Buttons

**Labels:** `feature`, `onboarding`, `frontend`

---

### Sub-Issue: [ONBOARD-001-C] Onboarding Step 3: Aktivitätslevel

**Beschreibung:**
Auswahl des täglichen Aktivitätslevels für die TDEE-Berechnung.

**Story Points:** 2

**Abhängigkeiten:** Blocked by: [ONBOARD-001]

**Akzeptanzkriterien:**
- **Given** ich bin auf Step 3
- **When** ich ein Aktivitätslevel auswähle
- **Then** kann ich zu Step 4 weitergehen

**Aktivitätslevel:**
| Level | Name | Beschreibung | Faktor |
|-------|------|--------------|--------|
| 1 | Sedentär | Wenig oder keine Bewegung, Bürojob | 1.2 |
| 2 | Leicht aktiv | Leichte Bewegung 1-3 Tage/Woche | 1.375 |
| 3 | Moderat aktiv | Moderate Bewegung 3-5 Tage/Woche | 1.55 |
| 4 | Sehr aktiv | Intensive Bewegung 6-7 Tage/Woche | 1.725 |
| 5 | Extrem aktiv | Sehr intensive Bewegung, körperliche Arbeit | 1.9 |

**Tasks:**
- [ ] `features/onboarding/screens/Step3ActivityScreen.tsx`
- [ ] 5 Auswahl-Cards mit Icon, Name und Beschreibung
- [ ] Visuelle Hervorhebung der Auswahl
- [ ] "Zurück" und "Weiter" Buttons

**Labels:** `feature`, `onboarding`, `frontend`

---

### Sub-Issue: [ONBOARD-001-D] Onboarding Step 4: Ziel auswählen

**Beschreibung:**
User wählt sein Diät-Ziel und sieht die berechnete Kalorienempfehlung.

**Story Points:** 3

**Abhängigkeiten:** Blocked by: [ONBOARD-001], [ONBOARD-002]

**Akzeptanzkriterien:**
- **Given** ich bin auf Step 4
- **When** ich "Abnehmen" auswähle
- **Then** sehe ich mein TDEE minus Defizit als Empfehlung

- **Given** ich habe ein Ziel ausgewählt
- **When** ich "Fertig" drücke
- **Then** werden alle Daten gespeichert und ich lande im Tagebuch

**Ziele:**
| Ziel | Beschreibung | Kalorien-Anpassung |
|------|--------------|-------------------|
| Abnehmen | Gewicht verlieren | TDEE - 500 kcal |
| Halten | Gewicht halten | TDEE |
| Zunehmen | Muskeln aufbauen | TDEE + 300 kcal |

**Tasks:**
- [ ] `features/onboarding/screens/Step4GoalScreen.tsx`
- [ ] 3 Ziel-Cards mit Icon und Beschreibung
- [ ] TDEE-Berechnung im Hintergrund ausführen
- [ ] Empfohlene Kalorien prominent anzeigen
- [ ] "Anpassen" Option für manuelle Überschreibung
- [ ] Makro-Verteilung Vorschlag (optional)
- [ ] "Fertig" Button
- [ ] Alle Daten an Supabase senden
- [ ] Profil in `profiles` Tabelle erstellen

**Labels:** `feature`, `onboarding`, `frontend`, `priority: high`

---

## Issue: [ONBOARD-002] TDEE Berechnungslogik

**Beschreibung:**
Implementierung der Mifflin-St Jeor Formel zur Berechnung des täglichen Kalorienbedarfs.

**Story Points:** 3

**Abhängigkeiten:** Keine

**Akzeptanzkriterien:**
- **Given** ich rufe `calculateTDEE()` mit gültigen Parametern auf
- **When** die Berechnung ausgeführt wird
- **Then** erhalte ich einen realistischen TDEE-Wert (1200-4000 kcal)

- **Given** verschiedene Eingabewerte
- **When** ich die Unit Tests ausführe
- **Then** sind alle Berechnungen korrekt (verifiziert gegen Online-Rechner)

**Formeln:**
```typescript
// BMR (Basal Metabolic Rate)
// Männer: BMR = 10 × Gewicht(kg) + 6.25 × Größe(cm) - 5 × Alter + 5
// Frauen: BMR = 10 × Gewicht(kg) + 6.25 × Größe(cm) - 5 × Alter - 161

// TDEE (Total Daily Energy Expenditure)
// TDEE = BMR × Aktivitätsfaktor
```

**Tasks:**
- [ ] `features/user/utils/calculateTDEE.ts` erstellen
- [ ] `calculateBMR(weight, height, age, gender)` Funktion
- [ ] `calculateTDEE(bmr, activityLevel)` Funktion
- [ ] `calculateGoalCalories(tdee, goal)` Funktion
- [ ] TypeScript Interfaces für Parameter
- [ ] Unit Tests mit verschiedenen Szenarien
- [ ] Edge Cases behandeln (minimale/maximale Werte)

**Labels:** `feature`, `onboarding`, `logic`, `priority: high`

---

## Issue: [ONBOARD-003] Profil in Datenbank speichern

**Beschreibung:**
Nach Abschluss des Onboardings werden alle Daten in Supabase gespeichert.

**Story Points:** 2

**Abhängigkeiten:** Blocked by: [SETUP-003], [ONBOARD-001-D]

**Akzeptanzkriterien:**
- **Given** der User schließt das Onboarding ab
- **When** die Daten gespeichert werden
- **Then** existiert ein Eintrag in der `profiles` Tabelle

- **Given** das Speichern fehlschlägt
- **When** ein Netzwerkfehler auftritt
- **Then** sieht der User eine Fehlermeldung mit Retry-Option

**Tasks:**
- [ ] Supabase Insert für `profiles` Tabelle
- [ ] Error Handling für Netzwerkfehler
- [ ] Retry-Mechanismus
- [ ] Loading State während des Speicherns
- [ ] Onboarding-Status in Profil speichern (`onboarding_completed: true`)

**Labels:** `feature`, `onboarding`, `backend`

---

## Issue: [PROFILE-001] Profil Screen UI

**Beschreibung:**
Screen zur Anzeige und Bearbeitung der User-Daten.

**Story Points:** 3

**Abhängigkeiten:** Blocked by: [ONBOARD-003]

**Akzeptanzkriterien:**
- **Given** ich bin auf dem Profil-Screen
- **When** die Daten geladen sind
- **Then** sehe ich Name, Ziel, Kalorien-Ziel, Level und Punkte

**Tasks:**
- [ ] `features/user/screens/ProfileScreen.tsx`
- [ ] Avatar/Initialen Anzeige
- [ ] Aktuelle Statistiken (Level, Punkte, Streak)
- [ ] Ziele-Übersicht (Kalorien, Makros)
- [ ] "Ziele bearbeiten" Button
- [ ] "Einstellungen" Button
- [ ] "Abmelden" Button
- [ ] Pull-to-Refresh

**Labels:** `feature`, `user`, `frontend`

---

### Sub-Issue: [PROFILE-001-A] Ziele bearbeiten Screen

**Beschreibung:**
User kann Kalorien- und Makro-Ziele manuell anpassen.

**Story Points:** 3

**Abhängigkeiten:** Blocked by: [PROFILE-001]

**Akzeptanzkriterien:**
- **Given** ich öffne "Ziele bearbeiten"
- **When** ich mein Kalorienziel auf 2000 ändere
- **Then** wird der neue Wert gespeichert und im Tagebuch verwendet

**Tasks:**
- [ ] `features/user/screens/EditGoalsScreen.tsx`
- [ ] Kalorien-Ziel Input
- [ ] Protein-Ziel Input (g oder %)
- [ ] Kohlenhydrate-Ziel Input
- [ ] Fett-Ziel Input
- [ ] "TDEE neu berechnen" Button (führt durch Mini-Wizard)
- [ ] Validierung (keine negativen Werte)
- [ ] "Speichern" Button

**Labels:** `feature`, `user`, `frontend`

---

# 📓 Epic 4: Tagebuch (Journal)

---

## Issue: [JOURNAL-001] Tagebuch Hauptscreen

**Beschreibung:**
Der zentrale Screen der App – zeigt alle Mahlzeiten eines Tages mit Fortschrittsanzeige.

**Story Points:** 5

**Abhängigkeiten:** Blocked by: [SETUP-003], [PROFILE-001]

**Akzeptanzkriterien:**
- **Given** ich öffne das Tagebuch
- **When** die Daten geladen sind
- **Then** sehe ich das heutige Datum, Kalorien-Fortschritt und alle 4 Mahlzeiten-Kategorien

- **Given** ich habe 1500 von 2000 kcal gegessen
- **When** ich das Tagebuch öffne
- **Then** zeigt der Fortschrittsbalken 75% an

**Tasks:**
- [ ] `features/journal/screens/JournalScreen.tsx`
- [ ] Datum-Header mit Navigation (< Heute >)
- [ ] Kalorien-Fortschrittsring (gegessen / Ziel)
- [ ] Verbleibende Kalorien Anzeige
- [ ] Makro-Übersicht (Protein, Carbs, Fett als kleine Bars)
- [ ] ScrollView mit 4 Mahlzeiten-Sections
- [ ] Pull-to-Refresh
- [ ] Empty State für Tage ohne Einträge

**Labels:** `feature`, `journal`, `frontend`, `priority: high`

---

### Sub-Issue: [JOURNAL-001-A] Datum Navigation

**Beschreibung:**
User kann zwischen Tagen navigieren und ein Datum aus dem Kalender wählen.

**Story Points:** 2

**Abhängigkeiten:** Blocked by: [JOURNAL-001]

**Akzeptanzkriterien:**
- **Given** ich bin auf dem heutigen Tag
- **When** ich auf "<" drücke
- **Then** sehe ich die Daten von gestern

- **Given** ich drücke auf das Datum
- **When** der Kalender öffnet
- **Then** kann ich ein beliebiges vergangenes Datum wählen

**Tasks:**
- [ ] Datum-State (selectedDate)
- [ ] Pfeil-Buttons für prev/next Tag
- [ ] Kalender-Popup bei Tap auf Datum
- [ ] "Heute" wird visuell hervorgehoben
- [ ] Keine Navigation in die Zukunft erlaubt

**Labels:** `feature`, `journal`, `frontend`

---

### Sub-Issue: [JOURNAL-001-B] Mahlzeiten-Section Komponente

**Beschreibung:**
Wiederverwendbare Komponente für eine Mahlzeiten-Kategorie (z.B. Frühstück).

**Story Points:** 3

**Abhängigkeiten:** Blocked by: [JOURNAL-001]

**Akzeptanzkriterien:**
- **Given** die Section hat Einträge
- **When** ich sie anschaue
- **Then** sehe ich den Kategorie-Namen, Gesamt-Kalorien und alle Einträge

- **Given** die Section ist leer
- **When** ich sie anschaue
- **Then** sehe ich "Noch keine Einträge" und den "+" Button

**Tasks:**
- [ ] `features/journal/components/MealSection.tsx`
- [ ] Header: Icon, Name (Frühstück etc.), Summe Kalorien
- [ ] Liste der Food Entries
- [ ] "+" Button zum Hinzufügen
- [ ] Collapsible (optional)

**Meal Types:**
- `breakfast` - 🍳 Frühstück
- `lunch` - 🍝 Mittagessen
- `dinner` - 🍽️ Abendessen
- `snack` - 🍎 Snacks

**Labels:** `feature`, `journal`, `component`

---

### Sub-Issue: [JOURNAL-001-C] Food Entry Komponente

**Beschreibung:**
Einzelner Eintrag innerhalb einer Mahlzeit.

**Story Points:** 2

**Abhängigkeiten:** Blocked by: [JOURNAL-001-B]

**Akzeptanzkriterien:**
- **Given** ich sehe einen Food Entry
- **When** ich ihn anschaue
- **Then** sehe ich Name, Portion und Kalorien

- **Given** ich swipe nach links
- **When** der Delete-Button erscheint
- **Then** kann ich den Eintrag löschen

**Tasks:**
- [ ] `features/journal/components/FoodEntryItem.tsx`
- [ ] Food Name (primär)
- [ ] Portion/Menge (sekundär)
- [ ] Kalorien (rechts)
- [ ] Swipe-to-Delete mit Confirmation
- [ ] Tap öffnet Detail/Edit Screen

**Labels:** `feature`, `journal`, `component`

---

## Issue: [JOURNAL-002] Food Entries aus Datenbank laden

**Beschreibung:**
React Query Hook zum Laden der Tagebuch-Einträge für ein bestimmtes Datum.

**Story Points:** 3

**Abhängigkeiten:** Blocked by: [SETUP-003], [SETUP-004]

**Akzeptanzkriterien:**
- **Given** ich öffne das Tagebuch für heute
- **When** die Query ausgeführt wird
- **Then** erhalte ich alle `food_entries` mit `date = today` für den aktuellen User

- **Given** die Daten sind geladen
- **When** ich einen neuen Eintrag hinzufüge
- **Then** wird die Liste automatisch aktualisiert (Cache Invalidation)

**Tasks:**
- [ ] `features/journal/hooks/useFoodEntries.ts`
- [ ] React Query Hook mit Supabase Query
- [ ] Filter nach `date` und `user_id`
- [ ] Gruppierung nach `meal_type`
- [ ] Summen-Berechnung (Kalorien, Makros)
- [ ] Loading & Error States

**Labels:** `feature`, `journal`, `data-fetching`, `priority: high`

---

## Issue: [JOURNAL-003] Eintrag hinzufügen - Modal öffnen

**Beschreibung:**
Wenn User "+" drückt, öffnet sich ein Modal mit Optionen zum Hinzufügen.

**Story Points:** 2

**Abhängigkeiten:** Blocked by: [JOURNAL-001-B]

**Akzeptanzkriterien:**
- **Given** ich drücke "+" bei Frühstück
- **When** das Modal öffnet
- **Then** sehe ich Optionen: "Suchen", "Barcode scannen", "Foto aufnehmen", "Manuell eingeben"

**Tasks:**
- [ ] Add-Modal oder Bottom Sheet
- [ ] 4 Optionen mit Icons
- [ ] Navigation zu entsprechendem Screen
- [ ] Meal-Type als Parameter übergeben

**Optionen:**
- 🔍 Lebensmittel suchen → Search Screen
- 📷 Foto aufnehmen → Camera Screen
- 📊 Barcode scannen → Barcode Screen
- ✏️ Manuell eingeben → Manual Entry Screen

**Labels:** `feature`, `journal`, `frontend`

---

## Issue: [JOURNAL-004] Lebensmittel-Suche Screen

**Beschreibung:**
Screen zum Suchen von Lebensmitteln in OpenFoodFacts und eigenen Custom Foods.

**Story Points:** 5

**Abhängigkeiten:** Blocked by: [JOURNAL-003], [FOOD-001]

**Akzeptanzkriterien:**
- **Given** ich bin auf dem Such-Screen
- **When** ich "Apfel" eingebe
- **Then** sehe ich Ergebnisse von OpenFoodFacts und meinen Custom Foods

- **Given** ich wähle ein Ergebnis aus
- **When** ich die Portion anpasse und "Hinzufügen" drücke
- **Then** wird der Eintrag zum Tagebuch hinzugefügt

**Tasks:**
- [ ] `features/journal/screens/FoodSearchScreen.tsx`
- [ ] Suchfeld mit Debounce (300ms)
- [ ] Tabs: "Alle", "Meine Lebensmittel", "Kürzlich"
- [ ] Ergebnis-Liste mit Name, Marke, Kalorien pro 100g
- [ ] Tap öffnet Portion-Auswahl
- [ ] Loading State während Suche
- [ ] Empty State "Keine Ergebnisse"

**Labels:** `feature`, `journal`, `frontend`, `priority: high`

---

### Sub-Issue: [JOURNAL-004-A] Portion Auswahl Screen

**Beschreibung:**
Nach Auswahl eines Lebensmittels kann der User die Portion/Menge festlegen.

**Story Points:** 3

**Abhängigkeiten:** Blocked by: [JOURNAL-004]

**Akzeptanzkriterien:**
- **Given** ich habe "Apfel" ausgewählt
- **When** ich die Menge auf 150g setze
- **Then** sehe ich die berechneten Nährwerte für 150g

- **Given** ich drücke "Hinzufügen"
- **When** der Eintrag gespeichert wird
- **Then** lande ich zurück im Tagebuch und sehe den neuen Eintrag

**Tasks:**
- [ ] `features/journal/screens/PortionSelectScreen.tsx`
- [ ] Food-Name und Bild (falls vorhanden)
- [ ] Mengen-Input (numerisch)
- [ ] Einheit-Auswahl (g, ml, Stück, Portion)
- [ ] Live-Berechnung der Nährwerte
- [ ] Nährwert-Anzeige (Kalorien, Protein, Carbs, Fett)
- [ ] "Hinzufügen" Button
- [ ] Entry in Supabase speichern

**Labels:** `feature`, `journal`, `frontend`

---

## Issue: [JOURNAL-005] Manueller Eintrag Screen

**Beschreibung:**
User kann komplett manuell Nährwerte eingeben (für Lebensmittel ohne Datenbank-Eintrag).

**Story Points:** 3

**Abhängigkeiten:** Blocked by: [JOURNAL-003]

**Akzeptanzkriterien:**
- **Given** ich bin auf dem manuellen Eingabe-Screen
- **When** ich Name und Kalorien eingebe und "Hinzufügen" drücke
- **Then** wird ein neuer Eintrag erstellt (Makros optional)

**Tasks:**
- [ ] `features/journal/screens/ManualEntryScreen.tsx`
- [ ] Name Input (Pflicht)
- [ ] Kalorien Input (Pflicht)
- [ ] Protein Input (optional)
- [ ] Kohlenhydrate Input (optional)
- [ ] Fett Input (optional)
- [ ] Portion/Menge Input
- [ ] "Als Custom Food speichern" Checkbox
- [ ] Validierung
- [ ] "Hinzufügen" Button

**Labels:** `feature`, `journal`, `frontend`

---

## Issue: [JOURNAL-006] Eintrag löschen

**Beschreibung:**
User kann einen Tagebuch-Eintrag löschen.

**Story Points:** 1

**Abhängigkeiten:** Blocked by: [JOURNAL-001-C]

**Akzeptanzkriterien:**
- **Given** ich swipe einen Eintrag nach links
- **When** ich "Löschen" drücke
- **Then** wird der Eintrag aus der Datenbank entfernt und die Liste aktualisiert

**Tasks:**
- [ ] Swipe-Action Komponente
- [ ] Confirmation Dialog
- [ ] Supabase Delete
- [ ] Cache Invalidation
- [ ] Toast "Eintrag gelöscht"

**Labels:** `feature`, `journal`, `backend`

---

## Issue: [JOURNAL-007] Eintrag bearbeiten

**Beschreibung:**
User kann einen bestehenden Eintrag bearbeiten (Menge ändern).

**Story Points:** 2

**Abhängigkeiten:** Blocked by: [JOURNAL-001-C], [JOURNAL-004-A]

**Akzeptanzkriterien:**
- **Given** ich tippe auf einen Eintrag
- **When** der Edit-Screen öffnet
- **Then** sehe ich die aktuellen Werte vorausgefüllt

- **Given** ich ändere die Menge und drücke "Speichern"
- **When** der Update ausgeführt wird
- **Then** werden die neuen Werte im Tagebuch angezeigt

**Tasks:**
- [ ] Edit-Screen (ähnlich wie Portion-Select)
- [ ] Vorausfüllen mit bestehenden Werten
- [ ] Supabase Update
- [ ] Cache Invalidation

**Labels:** `feature`, `journal`, `frontend`

---

# 🥗 Epic 5: Food Data & API Integration

---

## Issue: [FOOD-001] OpenFoodFacts API Service

**Beschreibung:**
Service-Layer für die Kommunikation mit der OpenFoodFacts API.

**Story Points:** 3

**Abhängigkeiten:** Keine

**Akzeptanzkriterien:**
- **Given** ich suche nach "Nutella"
- **When** die API aufgerufen wird
- **Then** erhalte ich eine Liste von Produkten mit Nährwerten

- **Given** ich scanne Barcode "4008400401027"
- **When** die API aufgerufen wird
- **Then** erhalte ich die Produktdaten (Hanuta)

**API Endpoints:**
- Suche: `GET https://world.openfoodfacts.org/cgi/search.pl?search_terms={query}&json=1`
- Barcode: `GET https://world.openfoodfacts.org/api/v0/product/{barcode}.json`

**Tasks:**
- [ ] `lib/openfoodfacts.ts` erstellen
- [ ] `searchProducts(query: string)` Funktion
- [ ] `getProductByBarcode(barcode: string)` Funktion
- [ ] Response Types definieren
- [ ] Nährwerte normalisieren (pro 100g)
- [ ] Error Handling (Produkt nicht gefunden, Netzwerk)
- [ ] Caching mit React Query

**Labels:** `feature`, `api-integration`, `priority: high`

---

## Issue: [FOOD-002] Custom Foods erstellen

**Beschreibung:**
User kann eigene Lebensmittel anlegen, die in der Suche erscheinen.

**Story Points:** 3

**Abhängigkeiten:** Blocked by: [SETUP-003]

**Akzeptanzkriterien:**
- **Given** ich bin auf dem "Neues Lebensmittel" Screen
- **When** ich alle Daten eingebe und speichere
- **Then** erscheint das Lebensmittel in meiner Suche unter "Meine Lebensmittel"

**Tasks:**
- [ ] `features/journal/screens/CreateCustomFoodScreen.tsx`
- [ ] Formular: Name, Marke (optional), Nährwerte pro 100g
- [ ] Standard-Portionsgröße
- [ ] Validierung
- [ ] In `custom_foods` Tabelle speichern
- [ ] Toast "Lebensmittel gespeichert"

**Labels:** `feature`, `journal`, `frontend`

---

### Sub-Issue: [FOOD-002-A] Custom Foods in Suche integrieren

**Beschreibung:**
Die Suche soll sowohl OpenFoodFacts als auch Custom Foods durchsuchen.

**Story Points:** 2

**Abhängigkeiten:** Blocked by: [FOOD-001], [FOOD-002]

**Akzeptanzkriterien:**
- **Given** ich habe ein Custom Food "Omas Apfelkuchen" erstellt
- **When** ich nach "Apfelkuchen" suche
- **Then** erscheint mein Custom Food in den Ergebnissen (markiert als "Mein Lebensmittel")

**Tasks:**
- [ ] Parallel-Suche in OpenFoodFacts + Supabase `custom_foods`
- [ ] Ergebnisse zusammenführen
- [ ] Custom Foods visuell unterscheiden (Badge/Icon)
- [ ] "Meine Lebensmittel" Tab zeigt nur Custom Foods

**Labels:** `feature`, `journal`, `data-fetching`

---

## Issue: [FOOD-003] Kürzlich verwendete Lebensmittel

**Beschreibung:**
Quick-Access zu häufig/kürzlich geloggten Lebensmitteln.

**Story Points:** 2

**Abhängigkeiten:** Blocked by: [JOURNAL-002]

**Akzeptanzkriterien:**
- **Given** ich öffne die Suche
- **When** ich auf "Kürzlich" tippe
- **Then** sehe ich meine letzten 20 geloggten Lebensmittel

**Tasks:**
- [ ] Query: Distinct Food Names aus `food_entries` der letzten 30 Tage
- [ ] Sortiert nach Häufigkeit oder Datum
- [ ] "Kürzlich" Tab in der Suche
- [ ] Quick-Add direkt aus der Liste

**Labels:** `feature`, `journal`, `nice-to-have`

---

# 📸 Epic 6: AI Meal Scan

---

## Issue: [SCAN-001] Kamera Screen implementieren

**Beschreibung:**
Screen zum Aufnehmen von Fotos für die AI-Analyse.

**Story Points:** 3

**Abhängigkeiten:** Keine

**Akzeptanzkriterien:**
- **Given** ich öffne den Kamera-Screen
- **When** die Kamera-Berechtigung erteilt wurde
- **Then** sehe ich die Live-Kamera-Vorschau

- **Given** ich drücke den Aufnahme-Button
- **When** das Foto aufgenommen wird
- **Then** sehe ich eine Vorschau mit "Analysieren" und "Neu aufnehmen" Buttons

**Tasks:**
- [ ] `features/scan/screens/CameraScreen.tsx`
- [ ] `expo-camera` Integration
- [ ] Kamera-Berechtigung anfragen
- [ ] Live-Vorschau
- [ ] Aufnahme-Button (mittig, groß)
- [ ] Flash-Toggle (optional)
- [ ] Foto-Preview nach Aufnahme
- [ ] "Analysieren" Button
- [ ] "Neu aufnehmen" Button
- [ ] "Aus Galerie wählen" Option

**Labels:** `feature`, `scan`, `frontend`, `priority: high`

---

## Issue: [SCAN-002] Bild zu Supabase Storage hochladen

**Beschreibung:**
Aufgenommene Fotos werden in Supabase Storage gespeichert.

**Story Points:** 2

**Abhängigkeiten:** Blocked by: [SETUP-001], [SCAN-001]

**Akzeptanzkriterien:**
- **Given** ich habe ein Foto aufgenommen
- **When** ich "Analysieren" drücke
- **Then** wird das Bild zu Supabase Storage hochgeladen

- **Given** der Upload erfolgreich war
- **When** ich das Ergebnis sehe
- **Then** ist das Bild mit dem Food Entry verknüpft

**Tasks:**
- [ ] Supabase Storage Bucket `meal-photos` erstellen
- [ ] Bucket Policies (nur eigener User kann lesen)
- [ ] `features/scan/services/uploadImage.ts`
- [ ] Bild komprimieren vor Upload
- [ ] Unique Filename generieren
- [ ] Public URL zurückgeben

**Labels:** `feature`, `scan`, `backend`

---

## Issue: [SCAN-003] Supabase Edge Function für Gemini AI

**Beschreibung:**
Serverless Function die das Bild an Google Gemini sendet und die Analyse zurückgibt.

**Story Points:** 5

**Abhängigkeiten:** Blocked by: [SCAN-002]

**Akzeptanzkriterien:**
- **Given** ich sende ein Bild an die Edge Function
- **When** Gemini das Bild analysiert
- **Then** erhalte ich ein JSON mit erkannten Gerichten und Nährwert-Schätzungen

**Response Format:**
```json
{
  "success": true,
  "foods": [
    {
      "name": "Spaghetti Bolognese",
      "confidence": 0.92,
      "estimated_portion_g": 350,
      "nutrition": {
        "calories": 520,
        "protein_g": 22,
        "carbs_g": 65,
        "fat_g": 18
      }
    }
  ]
}
```

**Tasks:**
- [ ] `supabase/functions/analyze-meal/index.ts` erstellen
- [ ] Gemini API Key als Secret speichern
- [ ] Bild als Base64 oder URL empfangen
- [ ] Prompt für Food Recognition optimieren
- [ ] Structured Output (JSON) anfordern
- [ ] Error Handling (API Limit, ungültiges Bild)
- [ ] Response Validation mit Zod
- [ ] Logging für Debugging

**Prompt Beispiel:**
```
Analyze this food image. Identify all visible food items and estimate their nutritional values.
Return a JSON object with the following structure:
- foods: array of identified items, each with:
  - name (German)
  - confidence (0-1)
  - estimated_portion_g
  - nutrition: { calories, protein_g, carbs_g, fat_g }
```

**Labels:** `feature`, `scan`, `backend`, `ai`, `priority: high`

---

### Sub-Issue: [SCAN-003-A] AI Analyse UI (Loading State)

**Beschreibung:**
Während die AI das Bild analysiert, sieht der User einen ansprechenden Loading-State.

**Story Points:** 2

**Abhängigkeiten:** Blocked by: [SCAN-003]

**Akzeptanzkriterien:**
- **Given** ich habe ein Foto aufgenommen und "Analysieren" gedrückt
- **When** die Analyse läuft
- **Then** sehe ich einen animierten Loading-Indicator mit dem Bild im Hintergrund

**Tasks:**
- [ ] Loading Screen Komponente
- [ ] Aufgenommenes Bild als Hintergrund (blurred)
- [ ] Animierter Spinner oder Pulsing Effekt
- [ ] Text "Analysiere dein Essen..."
- [ ] Timeout Handling (max 30 Sekunden)

**Labels:** `feature`, `scan`, `frontend`, `ux`

---

### Sub-Issue: [SCAN-003-B] AI Ergebnis Screen

**Beschreibung:**
Anzeige der AI-Analyse mit Möglichkeit zur Anpassung vor dem Speichern.

**Story Points:** 3

**Abhängigkeiten:** Blocked by: [SCAN-003]

**Akzeptanzkriterien:**
- **Given** die AI-Analyse ist fertig
- **When** ich den Ergebnis-Screen sehe
- **Then** sehe ich das Bild, erkannte Gerichte und geschätzte Nährwerte

- **Given** die Schätzung ist falsch
- **When** ich "Bearbeiten" drücke
- **Then** kann ich Name und Nährwerte manuell anpassen

**Tasks:**
- [ ] `features/scan/screens/ScanResultScreen.tsx`
- [ ] Aufgenommenes Bild anzeigen
- [ ] Liste erkannter Foods mit Confidence-Badge
- [ ] Nährwerte pro Item
- [ ] Gesamt-Summe
- [ ] "Bearbeiten" pro Item
- [ ] "Zum Tagebuch hinzufügen" Button
- [ ] Meal-Type Auswahl (welche Mahlzeit?)
- [ ] Einträge in `food_entries` speichern

**Labels:** `feature`, `scan`, `frontend`, `priority: high`

---

### Sub-Issue: [SCAN-003-C] AI Fehler Handling

**Beschreibung:**
Graceful Error Handling wenn die AI das Bild nicht erkennen kann.

**Story Points:** 2

**Abhängigkeiten:** Blocked by: [SCAN-003-B]

**Akzeptanzkriterien:**
- **Given** die AI kann nichts erkennen
- **When** das Ergebnis leer ist
- **Then** sehe ich "Kein Essen erkannt. Versuche ein anderes Foto oder gib manuell ein."

- **Given** ein Netzwerkfehler tritt auf
- **When** die Analyse fehlschlägt
- **Then** sehe ich eine Fehlermeldung mit "Erneut versuchen" Button

**Tasks:**
- [ ] Error States definieren (no_food, api_error, timeout)
- [ ] Passende UI für jeden Error State
- [ ] Retry Button
- [ ] Fallback zu manueller Eingabe
- [ ] User-freundliche Fehlermeldungen (Deutsch)

**Labels:** `feature`, `scan`, `error-handling`

---

# 📊 Epic 7: Barcode Scanner

---

## Issue: [BARCODE-001] Barcode Scanner Screen

**Beschreibung:**
Screen zum Scannen von Produkt-Barcodes.

**Story Points:** 3

**Abhängigkeiten:** Blocked by: [FOOD-001]

**Akzeptanzkriterien:**
- **Given** ich öffne den Barcode-Scanner
- **When** ich einen Barcode vor die Kamera halte
- **Then** wird der Barcode erkannt und das Produkt von OpenFoodFacts geladen

- **Given** das Produkt existiert nicht in OpenFoodFacts
- **When** der Barcode gescannt wird
- **Then** sehe ich "Produkt nicht gefunden" mit Option zur manuellen Eingabe

**Tasks:**
- [ ] `features/scan/screens/BarcodeScreen.tsx`
- [ ] `expo-camera` Barcode Scanning aktivieren
- [ ] Scanner-Overlay (Rahmen für Barcode)
- [ ] Vibrieren bei erfolgreichem Scan
- [ ] OpenFoodFacts API Call mit Barcode
- [ ] Produkt gefunden → Portion-Select Screen
- [ ] Produkt nicht gefunden → Error State mit Manual-Option
- [ ] Flashlight Toggle

**Labels:** `feature`, `scan`, `frontend`, `priority: medium`

---

# 📈 Epic 8: Analyse & Fortschritt

---

## Issue: [ANALYTICS-001] Analyse Tab Screen

**Beschreibung:**
Hauptscreen für Statistiken und Fortschritts-Übersicht.

**Story Points:** 3

**Abhängigkeiten:** Blocked by: [JOURNAL-002], [WEIGHT-001]

**Akzeptanzkriterien:**
- **Given** ich öffne den Analyse-Tab
- **When** die Daten geladen sind
- **Then** sehe ich Gewichtsverlauf, Kalorien-Durchschnitt und Makro-Verteilung

**Tasks:**
- [ ] `features/analytics/screens/AnalyticsScreen.tsx`
- [ ] Section: Gewichtsverlauf (Chart)
- [ ] Section: Kalorien letzte 7 Tage (Balken)
- [ ] Section: Makro-Durchschnitt (Pie Chart)
- [ ] Zeitraum-Filter (Woche, Monat, Jahr)
- [ ] Pull-to-Refresh

**Labels:** `feature`, `analytics`, `frontend`, `priority: high`

---

## Issue: [WEIGHT-001] Gewicht eintragen

**Beschreibung:**
User kann sein aktuelles Gewicht loggen.

**Story Points:** 2

**Abhängigkeiten:** Blocked by: [SETUP-003]

**Akzeptanzkriterien:**
- **Given** ich öffne "Gewicht eintragen"
- **When** ich 75.5 kg eingebe und speichere
- **Then** wird ein neuer Eintrag in `weight_logs` erstellt

**Tasks:**
- [ ] `features/analytics/screens/AddWeightScreen.tsx` oder Modal
- [ ] Gewicht Input (kg mit Dezimalstellen)
- [ ] Datum (default: heute)
- [ ] Notizen (optional)
- [ ] In Supabase speichern
- [ ] BMI automatisch berechnen und anzeigen
- [ ] Success Toast

**Labels:** `feature`, `analytics`, `frontend`

---

### Sub-Issue: [WEIGHT-001-A] Gewichtsverlauf Chart

**Beschreibung:**
Liniendiagramm des Gewichtsverlaufs über Zeit.

**Story Points:** 5

**Abhängigkeiten:** Blocked by: [WEIGHT-001]

**Akzeptanzkriterien:**
- **Given** ich habe mehrere Gewichtseinträge
- **When** ich das Chart anschaue
- **Then** sehe ich eine Linie mit meinem Gewichtsverlauf

- **Given** ich wähle "Letzter Monat"
- **When** das Chart neu lädt
- **Then** zeigt es nur Daten der letzten 30 Tage

**Tasks:**
- [ ] Chart-Library evaluieren (Victory Native Recommended)
- [ ] `features/analytics/components/WeightChart.tsx`
- [ ] Linien-Chart mit Datenpunkten
- [ ] Zeitraum-Filter (7 Tage, 30 Tage, 90 Tage, 1 Jahr, Alles)
- [ ] Trend-Linie (optional)
- [ ] Start- und Zielgewicht markieren
- [ ] Interaktion: Tap auf Punkt zeigt Details

**Labels:** `feature`, `analytics`, `frontend`, `chart`

---

### Sub-Issue: [WEIGHT-001-B] BMI Berechnung und Anzeige

**Beschreibung:**
Automatische BMI-Berechnung basierend auf Gewicht und Größe.

**Story Points:** 2

**Abhängigkeiten:** Blocked by: [WEIGHT-001], [ONBOARD-003]

**Akzeptanzkriterien:**
- **Given** ich bin 180cm groß und wiege 75kg
- **When** ich meinen BMI anschaue
- **Then** sehe ich 23.1 (Normalgewicht)

**BMI Kategorien:**
| BMI | Kategorie |
|-----|-----------|
| < 18.5 | Untergewicht |
| 18.5 - 24.9 | Normalgewicht |
| 25.0 - 29.9 | Übergewicht |
| ≥ 30.0 | Adipositas |

**Tasks:**
- [ ] `features/analytics/utils/calculateBMI.ts`
- [ ] BMI Formel: Gewicht(kg) / (Größe(m))²
- [ ] Kategorie-Zuordnung
- [ ] BMI-Anzeige Komponente mit Farb-Indikator
- [ ] Unit Tests

**Labels:** `feature`, `analytics`, `logic`

---

## Issue: [ANALYTICS-002] Kalorien-Statistik Chart

**Beschreibung:**
Balkendiagramm der täglichen Kalorien.

**Story Points:** 3

**Abhängigkeiten:** Blocked by: [JOURNAL-002]

**Akzeptanzkriterien:**
- **Given** ich schaue die Kalorien-Statistik an
- **When** die Daten geladen sind
- **Then** sehe ich Balken für jeden Tag mit Ziel-Linie

**Tasks:**
- [ ] `features/analytics/components/CaloriesChart.tsx`
- [ ] Balken pro Tag
- [ ] Ziel-Linie horizontal
- [ ] Grün wenn unter Ziel, Rot wenn drüber
- [ ] Durchschnitt der Periode anzeigen
- [ ] Zeitraum wählbar

**Labels:** `feature`, `analytics`, `frontend`, `chart`

---

## Issue: [ANALYTICS-003] Makro-Verteilung Chart

**Beschreibung:**
Kreisdiagramm der Makronährstoff-Verteilung.

**Story Points:** 3

**Abhängigkeiten:** Blocked by: [JOURNAL-002]

**Akzeptanzkriterien:**
- **Given** ich schaue die Makro-Verteilung an
- **When** ich heute 100g Protein, 200g Carbs, 50g Fett gegessen habe
- **Then** sehe ich ein Pie Chart mit entsprechender Verteilung

**Tasks:**
- [ ] `features/analytics/components/MacrosChart.tsx`
- [ ] Pie/Donut Chart
- [ ] Farben: Protein (blau), Carbs (gelb), Fett (rot)
- [ ] Prozentuale Anzeige
- [ ] Absolute Gramm-Werte
- [ ] Vergleich mit Ziel-Verteilung (optional)

**Labels:** `feature`, `analytics`, `frontend`, `chart`

---

# 🏆 Epic 9: Gamification

---

## Issue: [GAME-001] Gamification Store und Basis-Logik

**Beschreibung:**
Zustand Store und Backend-Logik für das Punkte- und Level-System.

**Story Points:** 5

**Abhängigkeiten:** Blocked by: [SETUP-003]

**Akzeptanzkriterien:**
- **Given** ich logge eine Mahlzeit
- **When** der Eintrag gespeichert wird
- **Then** werden mir Punkte gutgeschrieben

- **Given** ich habe 1000 Punkte
- **When** ich mein Level anschaue
- **Then** zeigt es Level 5 (basierend auf Punkteschwellen)

**Level-System (100 Level):**
```typescript
// Exponentielle Skalierung - herausfordernd aber erreichbar
// Level 1: 0 Punkte
// Level 10: ~5.000 Punkte
// Level 25: ~31.250 Punkte
// Level 50: ~125.000 Punkte
// Level 75: ~281.250 Punkte
// Level 100: ~500.000 Punkte

function getRequiredPoints(level: number): number {
  return Math.floor(50 * Math.pow(level, 2));
}

function getLevelFromPoints(points: number): number {
  return Math.floor(Math.sqrt(points / 50));
}
```

**Punkte-Vergabe:**
| Aktion | Punkte |
|--------|--------|
| Mahlzeit loggen | +10 |
| Alle 4 Mahlzeiten geloggt | +25 Bonus |
| Tagesziel Kalorien erreicht (±100) | +50 |
| Tagesziel Protein erreicht | +20 |
| Tagesziel alle Makros erreicht | +30 Bonus |
| 7-Tage-Streak | +100 Bonus |
| 30-Tage-Streak | +500 Bonus |
| 100-Tage-Streak | +2000 Bonus |

**Tasks:**
- [ ] `features/gamification/stores/gamificationStore.ts`
- [ ] `features/gamification/utils/pointsCalculator.ts`
- [ ] `features/gamification/utils/levelCalculator.ts`
- [ ] Punkte-Vergabe bei Journal-Actions (via Hooks)
- [ ] Level-Berechnung aus Gesamtpunkten
- [ ] Level-Up Detection
- [ ] Daten mit `user_gamification` Tabelle syncen
- [ ] Unit Tests für alle Berechnungen

**Labels:** `feature`, `gamification`, `backend`, `priority: high`

---

### Sub-Issue: [GAME-001-A] Punkte-Decay bei Inaktivität

**Beschreibung:**
Punkte verfallen teilweise, wenn der User inaktiv ist.

**Story Points:** 3

**Abhängigkeiten:** Blocked by: [GAME-001]

**Akzeptanzkriterien:**
- **Given** ich war 1 Tag inaktiv
- **When** ich die App am nächsten Tag öffne
- **Then** wurden mir X% meiner Punkte abgezogen

- **Given** der Decay wurde angewendet
- **When** ich meine Transaktionen anschaue
- **Then** sehe ich einen negativen Eintrag mit Grund "Inaktivität"

**Decay-Regeln (Vorschlag - wird später finalisiert):**
| Inaktive Tage | Decay |
|---------------|-------|
| 1 Tag | 0% (Gnade) |
| 2 Tage | 2% der Punkte |
| 3 Tage | 5% der Punkte |
| 4+ Tage | 5% pro Tag (max 50% total) |

**Tasks:**
- [ ] Decay-Berechnung implementieren
- [ ] `last_activity_date` in `user_gamification` prüfen
- [ ] Decay beim App-Start anwenden (wenn inaktiv)
- [ ] Negative Punkte-Transaktion erstellen
- [ ] User über Decay informieren (Toast/Modal)
- [ ] Decay-Regeln konfigurierbar machen (für spätere Anpassung)
- [ ] Maximalen Decay begrenzen (User soll nicht auf 0 fallen)

**Labels:** `feature`, `gamification`, `backend`

---

## Issue: [GAME-002] Streak-System implementieren

**Beschreibung:**
Tägliche Nutzungsserien tracken und belohnen.

**Story Points:** 3

**Abhängigkeiten:** Blocked by: [GAME-001], [JOURNAL-002]

**Akzeptanzkriterien:**
- **Given** ich habe heute mindestens 1 Mahlzeit geloggt
- **When** ich morgen auch 1 Mahlzeit logge
- **Then** erhöht sich mein Streak auf 2

- **Given** ich habe einen Streak von 10 Tagen
- **When** ich einen Tag nichts logge
- **Then** wird mein Streak auf 0 zurückgesetzt

**Tasks:**
- [ ] `features/gamification/utils/streakCalculator.ts`
- [ ] Prüfen ob heute bereits geloggt wurde
- [ ] Streak erhöhen bei neuem Tag mit Log
- [ ] Streak-Reset bei verpasstem Tag
- [ ] `longest_streak` updaten wenn übertroffen
- [ ] Streak-Bonus bei Meilensteinen (7, 30, 100 Tage)
- [ ] Streak-Schutz kaufen? (Nice-to-have für später)

**Labels:** `feature`, `gamification`, `logic`, `priority: high`

---

## Issue: [GAME-003] Gamification UI im Profil

**Beschreibung:**
Anzeige von Level, Punkten und Streak im Profil-Screen.

**Story Points:** 3

**Abhängigkeiten:** Blocked by: [GAME-001], [PROFILE-001]

**Akzeptanzkriterien:**
- **Given** ich öffne mein Profil
- **When** die Daten geladen sind
- **Then** sehe ich mein Level, Gesamtpunkte, aktuellen Streak und längsten Streak

**Tasks:**
- [ ] Level-Badge Komponente (visuell ansprechend)
- [ ] Fortschrittsbalken zum nächsten Level
- [ ] Punkte-Anzeige
- [ ] Streak-Anzeige mit Flammen-Icon 🔥
- [ ] Längster Streak Anzeige
- [ ] "Punktehistorie" Link

**Labels:** `feature`, `gamification`, `frontend`

---

### Sub-Issue: [GAME-003-A] Streak-Anzeige im Tagebuch

**Beschreibung:**
Der aktuelle Streak wird prominent im Tagebuch angezeigt.

**Story Points:** 2

**Abhängigkeiten:** Blocked by: [GAME-002], [JOURNAL-001]

**Akzeptanzkriterien:**
- **Given** ich habe einen Streak von 5 Tagen
- **When** ich das Tagebuch öffne
- **Then** sehe ich "🔥 5 Tage" prominent angezeigt

**Tasks:**
- [ ] Streak-Badge Komponente
- [ ] Position im Tagebuch Header
- [ ] Animation bei Streak-Erhöhung
- [ ] Warnung wenn Streak in Gefahr (z.B. 22 Uhr noch nichts geloggt)

**Labels:** `feature`, `gamification`, `frontend`, `ux`

---

### Sub-Issue: [GAME-003-B] Level-Up Celebration

**Beschreibung:**
Visuelle Feier wenn der User ein neues Level erreicht.

**Story Points:** 2

**Abhängigkeiten:** Blocked by: [GAME-001]

**Akzeptanzkriterien:**
- **Given** ich erreiche genug Punkte für Level 6
- **When** das Level-Up erkannt wird
- **Then** sehe ich eine Celebration Animation/Modal

**Tasks:**
- [ ] Level-Up Detection im Store
- [ ] Celebration Modal/Overlay
- [ ] Konfetti Animation (react-native-confetti oder Lottie)
- [ ] "Level X erreicht!" Text
- [ ] Sound-Effekt (optional)
- [ ] Neues Level-Badge anzeigen

**Labels:** `feature`, `gamification`, `frontend`, `ux`

---

## Issue: [GAME-004] Punktehistorie Screen

**Beschreibung:**
Übersicht aller Punkte-Transaktionen.

**Story Points:** 2

**Abhängigkeiten:** Blocked by: [GAME-001]

**Akzeptanzkriterien:**
- **Given** ich öffne die Punktehistorie
- **When** die Daten geladen sind
- **Then** sehe ich alle Transaktionen mit Datum, Grund und Punkten

**Tasks:**
- [ ] `features/gamification/screens/PointsHistoryScreen.tsx`
- [ ] Liste aus `point_transactions` Tabelle
- [ ] Datum, Grund, Punkte (+/-) pro Eintrag
- [ ] Farbcodierung (grün = positiv, rot = negativ/decay)
- [ ] Pagination / Infinite Scroll
- [ ] Filter nach Zeitraum (optional)

**Labels:** `feature`, `gamification`, `frontend`, `nice-to-have`

---

# ❤️ Epic 10: Health Integration

---

## Issue: [HEALTH-001] Apple HealthKit Setup

**Beschreibung:**
Integration mit Apple Health für Gewichtsdaten.

**Story Points:** 5

**Abhängigkeiten:** Blocked by: [WEIGHT-001]

**Akzeptanzkriterien:**
- **Given** ich habe HealthKit-Berechtigung erteilt
- **When** ich ein Gewicht in der App logge
- **Then** wird es auch in Apple Health geschrieben

- **Given** ich habe Gewicht in Apple Health eingetragen
- **When** ich die App öffne
- **Then** wird das Gewicht in die App importiert

**Tasks:**
- [ ] HealthKit Expo Plugin evaluieren (expo-apple-healthkit oder react-native-health)
- [ ] Berechtigungen konfigurieren (Info.plist)
- [ ] Berechtigung anfragen beim User (Opt-in)
- [ ] Gewicht lesen aus HealthKit
- [ ] Gewicht schreiben zu HealthKit
- [ ] Sync-Logik (Konflikte vermeiden)
- [ ] Toggle in Einstellungen (HealthKit an/aus)
- [ ] Aktivitätskalorien lesen (optional - für TDEE-Anpassung)

**Labels:** `feature`, `health`, `ios`, `priority: medium`

---

## Issue: [HEALTH-002] Health Connect Setup (Android)

**Beschreibung:**
Integration mit Google Health Connect für Android.

**Story Points:** 5

**Abhängigkeiten:** Blocked by: [WEIGHT-001]

**Akzeptanzkriterien:**
- **Given** ich habe Health Connect Berechtigung erteilt
- **When** ich ein Gewicht in der App logge
- **Then** wird es auch in Health Connect geschrieben

**Tasks:**
- [ ] Health Connect Plugin evaluieren (react-native-health-connect)
- [ ] Berechtigungen konfigurieren
- [ ] Berechtigung anfragen
- [ ] Gewicht lesen
- [ ] Gewicht schreiben
- [ ] Toggle in Einstellungen

**Labels:** `feature`, `health`, `android`, `priority: medium`

---

# 🎨 Epic 11: Design System & UI

---

## Issue: [DESIGN-001] Farbschema definieren

**Beschreibung:**
Primär- und Akzentfarben für Light und Dark Mode festlegen.

**Story Points:** 2

**Abhängigkeiten:** Blocked by: [SETUP-005]

**Akzeptanzkriterien:**
- **Given** das Farbschema ist definiert
- **When** ich `bg-primary` verwende
- **Then** wird die Primary Color angewendet

**Tasks:**
- [ ] Farben in Designstudie definieren (User-Entscheidung ausstehend)
- [ ] `tailwind.config.js` mit Custom Colors erweitern
- [ ] Light Mode Palette
- [ ] Dark Mode Palette
- [ ] Semantic Colors (success, error, warning, info)
- [ ] Color Documentation in `Docs/Design.md`

**Labels:** `design`, `styling`, `priority: high`

---

## Issue: [DESIGN-002] Typography System

**Beschreibung:**
Schriftgrößen und -stile standardisieren.

**Story Points:** 2

**Abhängigkeiten:** Blocked by: [SETUP-005]

**Akzeptanzkriterien:**
- **Given** ich verwende `text-heading-1`
- **When** die Komponente rendert
- **Then** ist die Schrift korrekt gestylt (Größe, Gewicht)

**Tasks:**
- [ ] Font-Familie wählen (System Font oder Custom)
- [ ] Custom Font einbinden (falls gewünscht)
- [ ] Heading Styles (H1-H4)
- [ ] Body Styles (Large, Normal, Small)
- [ ] Caption Style
- [ ] Tailwind Config erweitern

**Labels:** `design`, `styling`

---

## Issue: [DESIGN-003] Button Komponente

**Beschreibung:**
Wiederverwendbare Button-Komponente mit verschiedenen Varianten.

**Story Points:** 2

**Abhängigkeiten:** Blocked by: [DESIGN-001]

**Akzeptanzkriterien:**
- **Given** ich verwende `<Button variant="primary">Text</Button>`
- **When** die Komponente rendert
- **Then** sehe ich einen Button im Primary-Stil

**Varianten:**
- Primary (gefüllt, Primary Color)
- Secondary (gefüllt, Secondary Color)
- Outline (Rahmen, transparent)
- Ghost (nur Text)
- Destructive (für Löschen, rot)

**Tasks:**
- [ ] `components/ui/Button.tsx`
- [ ] Props: variant, size (sm, md, lg), disabled, loading, icon
- [ ] Loading State mit Spinner
- [ ] Disabled State (visuell + funktional)
- [ ] Pressable Feedback (opacity/scale)
- [ ] Accessibility (accessibilityLabel, accessibilityRole)

**Labels:** `design`, `component`, `frontend`

---

## Issue: [DESIGN-004] Input Komponente

**Beschreibung:**
Wiederverwendbare Input-Komponente für Formulare.

**Story Points:** 2

**Abhängigkeiten:** Blocked by: [DESIGN-001]

**Akzeptanzkriterien:**
- **Given** ich verwende `<Input label="E-Mail" error="Ungültig" />`
- **When** die Komponente rendert
- **Then** sehe ich ein Label, Input-Feld und Fehlermeldung

**Tasks:**
- [ ] `components/ui/Input.tsx`
- [ ] Props: label, placeholder, error, disabled, type, leftIcon, rightIcon
- [ ] Label über dem Input
- [ ] Error State (roter Rahmen, Fehlermeldung darunter)
- [ ] Password Type (mit Show/Hide Toggle)
- [ ] Number Type (numerische Tastatur)
- [ ] Integration mit React Hook Form (via `forwardRef`)

**Labels:** `design`, `component`, `frontend`

---

## Issue: [DESIGN-005] Card Komponente

**Beschreibung:**
Container-Komponente für Cards.

**Story Points:** 1

**Abhängigkeiten:** Blocked by: [DESIGN-001]

**Akzeptanzkriterien:**
- **Given** ich verwende `<Card>Inhalt</Card>`
- **When** die Komponente rendert
- **Then** sehe ich einen Container mit Schatten und abgerundeten Ecken

**Tasks:**
- [ ] `components/ui/Card.tsx`
- [ ] Props: padding, shadow, pressable, variant
- [ ] Varianten: elevated, outlined, flat
- [ ] Pressable State (falls clickable)

**Labels:** `design`, `component`, `frontend`

---

## Issue: [DESIGN-006] Weitere UI Komponenten

**Beschreibung:**
Zusätzliche wiederverwendbare Komponenten.

**Story Points:** 3

**Abhängigkeiten:** Blocked by: [DESIGN-001]

**Tasks:**
- [ ] `components/ui/Avatar.tsx` (Bild oder Initialen)
- [ ] `components/ui/Badge.tsx` (Status-Anzeige)
- [ ] `components/ui/ProgressBar.tsx` (Fortschrittsanzeige)
- [ ] `components/ui/ProgressRing.tsx` (Kreisförmiger Fortschritt)
- [ ] `components/ui/Divider.tsx` (Trennlinie)
- [ ] `components/ui/Toast.tsx` (Benachrichtigung)
- [ ] `components/ui/Modal.tsx` (Dialog)
- [ ] `components/ui/BottomSheet.tsx` (Sheet von unten)

**Labels:** `design`, `component`, `frontend`

---

## Issue: [DESIGN-007] Dark/Light Mode Toggle

**Beschreibung:**
User kann zwischen Dark und Light Mode wechseln.

**Story Points:** 3

**Abhängigkeiten:** Blocked by: [DESIGN-001]

**Akzeptanzkriterien:**
- **Given** ich bin in den Einstellungen
- **When** ich "Dark Mode" auswähle
- **Then** wechselt die gesamte App sofort zu Dark Mode

**Optionen:**
- System (folgt OS-Einstellung)
- Hell
- Dunkel

**Tasks:**
- [ ] Theme Store mit Zustand
- [ ] Persistierung in AsyncStorage
- [ ] `useColorScheme` Hook anpassen/wrappen
- [ ] Toggle/Selector in Einstellungen
- [ ] Sofortiges Umschalten ohne Reload
- [ ] Respektiere System-Präferenz als Default

**Labels:** `feature`, `styling`, `frontend`

---

# 🧪 Epic 12: Testing

---

## Issue: [TEST-001] Jest & Testing Library Setup

**Beschreibung:**
Test-Infrastruktur für Unit und Component Tests.

**Story Points:** 3

**Abhängigkeiten:** Keine

**Akzeptanzkriterien:**
- **Given** Jest ist konfiguriert
- **When** ich `npm test` ausführe
- **Then** werden alle Tests ausgeführt

**Tasks:**
- [ ] Jest Konfiguration in `jest.config.js`
- [ ] React Native Testing Library installieren
- [ ] Mock für Supabase Client
- [ ] Mock für AsyncStorage
- [ ] Mock für Navigation (expo-router)
- [ ] Mock für expo-camera
- [ ] Beispiel-Test erstellen
- [ ] `npm test` Script hinzufügen
- [ ] `npm test:watch` Script hinzufügen
- [ ] `npm test:coverage` Script hinzufügen

**Labels:** `testing`, `setup`

---

## Issue: [TEST-002] Unit Tests für Berechnungslogik

**Beschreibung:**
Tests für TDEE, BMI und Punkte-Berechnungen.

**Story Points:** 3

**Abhängigkeiten:** Blocked by: [TEST-001], [ONBOARD-002], [WEIGHT-001-B], [GAME-001]

**Akzeptanzkriterien:**
- **Given** verschiedene Eingabewerte
- **When** ich die Tests ausführe
- **Then** sind alle Berechnungen korrekt

**Tasks:**
- [ ] Tests für `calculateBMR()` - verschiedene Geschlechter, Alter
- [ ] Tests für `calculateTDEE()` - alle Aktivitätslevel
- [ ] Tests für `calculateBMI()` - Grenzwerte der Kategorien
- [ ] Tests für `calculatePoints()` - alle Aktionen
- [ ] Tests für `calculateLevel()` - Schwellenwerte
- [ ] Tests für Streak-Berechnung
- [ ] Tests für Decay-Berechnung
- [ ] Edge Cases abdecken (0, negative, sehr große Zahlen)

**Labels:** `testing`, `logic`

---

## Issue: [TEST-003] Component Tests für kritische UI

**Beschreibung:**
Tests für wichtige UI-Komponenten.

**Story Points:** 3

**Abhängigkeiten:** Blocked by: [TEST-001], [DESIGN-003], [DESIGN-004]

**Akzeptanzkriterien:**
- **Given** ich rendere einen Button mit loading=true
- **When** der Test läuft
- **Then** ist der Spinner sichtbar und der Button disabled

**Tasks:**
- [ ] Tests für Button Komponente (alle Varianten, States)
- [ ] Tests für Input Komponente (Error State, Password Toggle)
- [ ] Tests für FoodEntryItem (Render, Delete Action)
- [ ] Tests für MealSection (Empty State, With Items)
- [ ] Snapshot Tests (nur für stabile Komponenten)

**Labels:** `testing`, `frontend`

---

# 🚀 Epic 13: Release & Deployment

---

## Issue: [RELEASE-001] EAS Build konfigurieren

**Beschreibung:**
Expo Application Services für automatisierte Builds.

**Story Points:** 3

**Abhängigkeiten:** Keine

**Akzeptanzkriterien:**
- **Given** EAS ist konfiguriert
- **When** ich `eas build --profile preview` ausführe
- **Then** wird ein Test-Build erstellt

**Tasks:**
- [ ] EAS CLI installieren (`npm install -g eas-cli`)
- [ ] `eas.json` erstellen
- [ ] Development Profile (für Expo Go kompatible Builds)
- [ ] Preview Profile (internes Testing via TestFlight/Internal Track)
- [ ] Production Profile (Store Release)
- [ ] `eas.json` Secrets konfigurieren (API Keys)
- [ ] Erster Build testen

**Labels:** `devops`, `release`

---

## Issue: [RELEASE-002] App Store Assets

**Beschreibung:**
Grafiken für App Store und Play Store Listings.

**Story Points:** 3

**Abhängigkeiten:** Blocked by: [DESIGN-001]

**Akzeptanzkriterien:**
- **Given** alle Assets sind erstellt
- **When** ich den Store-Eintrag anlege
- **Then** habe ich alle benötigten Grafiken

**Assets:**
- App Icon (1024x1024, verschiedene Auflösungen)
- Splash Screen
- Screenshots (6.5" und 5.5" für iOS, verschiedene für Android)
- Feature Graphic (Android, 1024x500)
- Promotional Banner (optional)

**Tasks:**
- [ ] App Icon Design (passt zur Marke)
- [ ] Splash Screen Design
- [ ] Screenshot-Erstellung (echte App-Screens mit Mockup-Rahmen)
- [ ] Feature Graphic Design
- [ ] Assets exportieren in korrekten Größen
- [ ] `app.json` mit Asset-Pfaden aktualisieren

**Labels:** `design`, `release`

---

## Issue: [RELEASE-003] Store Listing vorbereiten

**Beschreibung:**
Metadaten und Texte für die App Stores.

**Story Points:** 2

**Abhängigkeiten:** Keine

**Akzeptanzkriterien:**
- **Given** alle Texte sind geschrieben
- **When** ich die Stores einreiche
- **Then** habe ich alle erforderlichen Informationen

**Tasks:**
- [ ] App Name: "MenuMate"
- [ ] Untertitel/Kurzbeschreibung (80 Zeichen)
- [ ] Vollständige Beschreibung (4000 Zeichen, mit Features)
- [ ] Keywords (iOS, komma-separiert)
- [ ] Kategorie: Health & Fitness
- [ ] Datenschutzerklärung URL erstellen/hosten
- [ ] Support E-Mail einrichten
- [ ] Support URL (z.B. GitHub Issues oder Website)
- [ ] Altersfreigabe (selbst deklariert: 4+/Everyone)
- [ ] Screenshots Beschreibungen

**Labels:** `release`, `documentation`

---

## Issue: [RELEASE-004] GitHub Actions für EAS Deployment

**Beschreibung:**
Automatisierte Builds und Deployments via GitHub Actions.

**Story Points:** 3

**Abhängigkeiten:** Blocked by: [SETUP-007], [RELEASE-001]

**Akzeptanzkriterien:**
- **Given** ein PR wird gemerged
- **When** der CD Workflow läuft
- **Then** wird ein Preview Build erstellt

- **Given** ein Release Tag wird erstellt (v1.0.0)
- **When** der Release Workflow läuft
- **Then** werden Production Builds für iOS und Android erstellt

**Tasks:**
- [ ] `.github/workflows/preview.yml` - Preview Build bei PR merge
- [ ] `.github/workflows/release.yml` - Production Build bei Tag
- [ ] EAS CLI in GitHub Action installieren
- [ ] `EXPO_TOKEN` Secret in GitHub hinzufügen
- [ ] Build-Status als Comment im PR posten (optional)
- [ ] Store Submit Workflow (optional, manueller Trigger für mehr Kontrolle)

**Labels:** `devops`, `ci-cd`, `release`

---

# 📋 Label-Übersicht

| Label | Beschreibung | Farbe (Vorschlag) |
|-------|--------------|-------------------|
| `setup` | Projekt-Konfiguration | #0052CC |
| `feature` | Neue Funktionalität | #0E8A16 |
| `frontend` | UI/UX Arbeit | #1D76DB |
| `backend` | Supabase/API Arbeit | #5319E7 |
| `auth` | Authentifizierung | #B60205 |
| `onboarding` | Onboarding Flow | #FBCA04 |
| `journal` | Tagebuch Feature | #006B75 |
| `scan` | Kamera/AI Feature | #D93F0B |
| `analytics` | Statistiken/Charts | #0075CA |
| `gamification` | Streaks/Punkte/Level | #7057FF |
| `health` | HealthKit/Connect | #E99695 |
| `design` | Styling/Visuals | #F9D0C4 |
| `component` | Wiederverwendbare Komponente | #BFD4F2 |
| `testing` | Tests | #BFDADC |
| `devops` | CI/CD/Builds | #333333 |
| `release` | Store/Deployment | #000000 |
| `priority: high` | Muss für MVP | #B60205 |
| `priority: medium` | Wichtig nach MVP | #FBCA04 |
| `nice-to-have` | Optional | #C2E0C6 |
| `api-integration` | Externe APIs | #D4C5F9 |
| `state-management` | Zustand/Store | #C5DEF5 |
| `validation` | Formular-Validierung | #FEF2C0 |
| `navigation` | Routing/Navigation | #D4C5F9 |
| `logic` | Business-Logik | #BFDADC |
| `chart` | Diagramme/Visualisierung | #C2E0C6 |
| `error-handling` | Fehlerbehandlung | #E99695 |
| `ux` | User Experience | #F9D0C4 |
| `dx` | Developer Experience | #BFD4F2 |
| `documentation` | Dokumentation | #0075CA |
| `database` | Datenbankschema | #5319E7 |
| `typescript` | TypeScript-spezifisch | #1D76DB |
| `tooling` | Dev-Tools | #333333 |
| `code-quality` | Linting/Formatting | #BFDADC |
| `ai` | KI/Machine Learning | #D93F0B |
| `ios` | iOS-spezifisch | #000000 |
| `android` | Android-spezifisch | #0E8A16 |
| `architecture` | Architektur-Entscheidungen | #C5DEF5 |
