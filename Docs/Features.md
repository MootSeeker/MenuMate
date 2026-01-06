# MenuMate - Feature Specification

## Overview
MenuMate ist eine intelligente Kalorien-Tracking-App für Smartphones, die Nutzern hilft, ihre Ernährung einfach zu protokollieren und ihren Diät-Fortschritt zu überwachen.

## Geplante Hauptfunktionen

### 1. Intelligentes Kalorien-Tracking
- **Tagebuch-Struktur**: Klassische Unterteilung (Frühstück, Mittagessen, Abendessen, Snacks).
- **Datenquellen**:
    - **AI-Scan**: Automatische Erkennung via Foto.
    - **Datenbank**: Suche & Barcode-Scan via **OpenFoodFacts API**.
    - **Manuell**: Erstellung eigener "Custom Foods".

### 2. Onboarding & Personalisierung
- **TDEE Berechnung**: Automatische Ermittlung des Kalorienbedarfs (Formel-basiert auf Alter, Größe, Gewicht, Aktivität).
- **Ziele**: Auswahl "Abnehmen/Zunehmen/Halten" → App berechnet Empfehlung.
- **Anpassung**: Nutzer kann Kalorien- und Makro-Ziele manuell überschreiben.

### 3. Visuelle Mahlzeitenerfassung (AI)
- **Foto-Scan**: Nutzer machen ein Foto ihrer Mahlzeit.
- **Technologie**: Google Gemini 1.5 Flash (via Supabase Edge Functions).
- **Funktion**: Erkennung des Gerichts, Schätzung der Portion und Nährwerte.

### 4. Gesundheits- & Fortschrittsüberwachung
- **Gewichtstracking**: Logging inkl. BMI-Monitor.
- **Health-Integration**: Bidirektionale Synchronisation mit **Apple Health** / Health Connect (Gewicht lesen, Aktivitätskalorien lesen).

### 5. Gamification & Motivation
- **Streaks**:
    - **Basis**: Zählt als erledigt, sobald mindestens eine Mahlzeit eingetragen wurde.
- **Punkte-System**:
    - **Basis-Punkte**: Für das Einloggen von Essen (siehe Streak).
    - **Bonus-Punkte**: Erhöhte Punktzahl für das Erreichen der Tagesziele (Kalorien/Makros) → Anreiz zur Disziplin.
- **Challenges**: Visuelles Feedback bei Erreichen von Tageszielen.
- **UI-Fokus**: Belohnendes Design.

### 6. Plattform & Technische Rahmenbedingungen
- **Framework**: React Native (Expo).
- **Netzwerk**: "Online First" Ansatz.
- **Backend & Auth**: **Supabase** (PostgreSQL, Edge Functions).
    - **Login**: Vorerst nur E-Mail & Passwort.
- **Sprache**: Deutsch (Start). Spätere Übersetzung geplant via Supabase Edge Functions.
- **Design System**: Support für Light/Dark Mode (System-Override möglich). Akzentfarbe wird später definiert.

### 7. App Struktur (Navigation)
- **Typ**: Bottom Tab Bar.
- **Tabs**:
    1.  **Tagebuch**: Hauptübersicht Mahlzeiten heute.
    2.  **Scan/Add**: Zentraler Button für Foto/Suche.
    3.  **Analyse**: Gewichtskurve, Makro-Details, Fortschritt.
    4.  **Profil**: Einstellungen, Ziele, Account.

## Tech-Stack Entscheidung (Entwurf)
- **Frontend**: React Native (via Expo Framework) - TypeScript.
- **Backend**: Supabase.
- **AI**: Start mit kostengünstigen Cloud-Modellen (z.B. Gemini Flash) vs. On-Device ML (Abwägung Performance vs. Kosten).
- **Integration**: Expo Health / Apple HealthKit.
