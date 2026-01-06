# MenuMate

Eine intelligente Kalorien-Tracking-App für iOS und Android. Mahlzeiten fotografieren, Nährwerte tracken, Fortschritt überwachen.

## Features

- **Intelligentes Kalorien-Tracking**: Klassisches Tagebuch (Frühstück, Mittag, Abend, Snacks).
- **AI Foto-Scan**: Fotografiere dein Essen – die AI erkennt es und schätzt die Kalorien.
- **Barcode-Scanner**: Integration mit OpenFoodFacts für Produktdaten.
- **BMI & Gewichts-Tracking**: Überwache deinen Fortschritt über Zeit.
- **Gamification**: Streaks und Punkte für Motivation.
- **Apple Health Sync**: Bidirektionale Synchronisation.

## Tech Stack

- **Frontend**: React Native (Expo), TypeScript
- **Backend**: Supabase (PostgreSQL, Auth, Edge Functions)
- **AI**: Google Gemini 1.5 Flash (Bilderkennung)
- **Styling**: NativeWind (Tailwind CSS)

## Schnellstart

### Voraussetzungen

- [Node.js](https://nodejs.org/) v20 oder neuer
- [Git](https://git-scm.com/)
- Smartphone mit **Expo Go** App ([iOS](https://apps.apple.com/app/expo-go/id982107779) / [Android](https://play.google.com/store/apps/details?id=host.exp.exponent))

### Installation

```bash
# Repository klonen
git clone https://github.com/your-username/MenuMate.git
cd MenuMate

# Dependencies installieren
cd app
npm install
```

### App starten (Development)

```bash
cd app
npx expo start
```

Es erscheint ein QR-Code im Terminal:
- **iOS**: Öffne die Kamera-App und scanne den Code.
- **Android**: Öffne die Expo Go App und tippe "Scan QR code".

> **Wichtig**: Dein Handy muss im gleichen WLAN wie dein Computer sein.

### Weitere Befehle

| Befehl | Beschreibung |
|--------|--------------|
| `npx expo start --clear` | Startet mit geleertem Cache |
| `npx expo start --android` | Öffnet direkt im Android Emulator |
| `npx expo start --ios` | Öffnet direkt im iOS Simulator (nur macOS) |
| `npx expo start --web` | Öffnet im Web-Browser |

## Projektstruktur

```
MenuMate/
├── Docs/                   # Projekt-Dokumentation
│   ├── Features.md         # Feature-Spezifikation
│   ├── TechStack.md        # Technologie-Entscheidungen
│   └── Development.md      # Entwicklungsrichtlinien
├── app/                    # Expo React Native App
│   ├── app/                # Screens & Navigation (Expo Router)
│   ├── components/         # Wiederverwendbare UI-Komponenten
│   ├── features/           # Feature-Module (auth, journal, scan, etc.)
│   ├── hooks/              # Custom React Hooks
│   ├── lib/                # Konfigurationen (Supabase, etc.)
│   └── types/              # TypeScript Definitionen
└── README.md
```

## Dokumentation

- [Features.md](Docs/Features.md) – Was die App können soll
- [TechStack.md](Docs/TechStack.md) – Technische Architektur
- [Development.md](Docs/Development.md) – Code-Konventionen & CI/CD

## Lizenz

MIT

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit changes
4. Push and create a PR