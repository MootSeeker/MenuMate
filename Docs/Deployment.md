# MenuMate Deployment Guide

Dieses Dokument beschreibt den kompletten Build- und Deployment-Prozess für MenuMate.

## Inhaltsverzeichnis

1. [Voraussetzungen](#voraussetzungen)
2. [EAS Build Setup](#eas-build-setup)
3. [Build-Profile](#build-profile)
4. [Lokale Builds erstellen](#lokale-builds-erstellen)
5. [CI/CD mit GitHub Actions](#cicd-mit-github-actions)
6. [App Distribution](#app-distribution)
7. [Credentials Management](#credentials-management)
8. [Troubleshooting](#troubleshooting)

---

## Voraussetzungen

### Accounts

- **Expo Account**: [expo.dev](https://expo.dev) (kostenlos)
- **Apple Developer Account**: [developer.apple.com](https://developer.apple.com) ($99/Jahr für iOS Distribution)
- **Google Play Developer Account**: [play.google.com/console](https://play.google.com/console) ($25 einmalig)

### CLI Tools

```bash
# EAS CLI installieren
npm install -g eas-cli

# Login bei Expo
eas login

# Projekt konfigurieren (einmalig)
cd app
eas build:configure
```

---

## EAS Build Setup

### 1. Projekt mit EAS verknüpfen

```bash
cd app
eas build:configure
```

Dies erstellt/aktualisiert:
- `eas.json` - Build-Konfiguration
- `app.json` - EAS Project ID

### 2. EAS Project ID setzen

Nach `eas build:configure` wird eine Project ID generiert. Aktualisiere [app.json](../app/app.json):

```json
{
  "expo": {
    "extra": {
      "eas": {
        "projectId": "DEINE_PROJECT_ID"
      }
    },
    "updates": {
      "url": "https://u.expo.dev/DEINE_PROJECT_ID"
    }
  }
}
```

---

## Build-Profile

Die Konfiguration befindet sich in [eas.json](../app/eas.json):

| Profil | Zweck | Distribution | Android | iOS |
|--------|-------|--------------|---------|-----|
| `development` | Lokales Testing mit Dev Client | Internal | APK (Debug) | Simulator |
| `preview` | Alpha/Beta für Tester | Internal | APK | Device (Ad-Hoc) |
| `production` | Store Release | Store | AAB | App Store |

### Environment Variables

Jedes Profil kann eigene Environment Variables haben:

```json
{
  "build": {
    "preview": {
      "env": {
        "APP_ENV": "preview",
        "API_URL": "https://api-staging.menumate.app"
      }
    }
  }
}
```

---

## Lokale Builds erstellen

### Development Build (für lokales Testing)

```bash
# Android Development Client
eas build --profile development --platform android

# iOS Simulator Build
eas build --profile development --platform ios
```

### Preview Build (für Alpha/Beta Tester)

```bash
# Beide Plattformen
eas build --profile preview --platform all

# Nur Android
eas build --profile preview --platform android

# Nur iOS
eas build --profile preview --platform ios
```

### Production Build (für Store)

```bash
# Beide Plattformen
eas build --profile production --platform all
```

### Build-Status prüfen

```bash
# Alle Builds anzeigen
eas build:list

# Build-Details
eas build:view
```

---

## CI/CD mit GitHub Actions

### Automatische Preview Builds

Nach jedem Merge in `main` wird automatisch ein Preview-Build erstellt.

**Workflow:** [.github/workflows/preview-build.yml](../.github/workflows/preview-build.yml)

### GitHub Secrets einrichten

1. Gehe zu: Repository → Settings → Secrets and variables → Actions
2. Erstelle folgende Secrets:

| Secret | Beschreibung | Wie erstellen |
|--------|--------------|---------------|
| `EXPO_TOKEN` | EAS Authentication | expo.dev → Profile → Access Tokens |

### Manueller Build-Trigger

Der Workflow kann auch manuell gestartet werden:
1. Gehe zu: Actions → Preview Build → Run workflow
2. Wähle Branch und Plattform

---

## App Distribution

### Android: Google Play Internal Testing

1. **Play Console Setup**
   - Erstelle App in [Google Play Console](https://play.google.com/console)
   - Gehe zu: Testing → Internal Testing
   - Erstelle Tester-Liste (Email-Adressen)

2. **Build hochladen**
   ```bash
   # Manuell
   eas submit -p android --latest
   
   # Automatisch (nach Build)
   eas build --profile preview --platform android --auto-submit
   ```

3. **Tester einladen**
   - Kopiere den Internal Testing Link
   - Teile ihn mit deinen Testern

### iOS: TestFlight

1. **App Store Connect Setup**
   - Erstelle App in [App Store Connect](https://appstoreconnect.apple.com)
   - Gehe zu: TestFlight → Internal Testing
   - Füge Tester hinzu

2. **Build hochladen**
   ```bash
   # Manuell
   eas submit -p ios --latest
   
   # Automatisch (nach Build)
   eas build --profile preview --platform ios --auto-submit
   ```

3. **Tester einladen**
   - Tester erhalten Email mit TestFlight-Einladung
   - Alternativ: Public Link für externe Tester

---

## Credentials Management

### Android Keystore

Der Android Keystore wird automatisch von EAS verwaltet:

```bash
# Credentials anzeigen
eas credentials -p android

# Neuen Keystore generieren
eas credentials -p android --credential keystore
```

**Wichtig:** Keystore-Backup erstellen für den Fall eines Account-Verlusts!

```bash
# Keystore herunterladen
eas credentials -p android
# Wähle: Download credentials
```

### iOS Certificates & Provisioning

```bash
# Credentials anzeigen
eas credentials -p ios

# Apple Developer Account verbinden
eas credentials -p ios
# Wähle: Log in to your Apple Developer account
```

### Umgebungsvariablen für Secrets

Für sensible Daten (API Keys) nutze EAS Secrets:

```bash
# Secret setzen
eas secret:create --name SUPABASE_URL --value "https://..."

# Secrets anzeigen
eas secret:list
```

---

## Troubleshooting

### Build schlägt fehl

1. **Logs prüfen**
   ```bash
   eas build:view
   # Kopiere Build-ID und prüfe Logs auf expo.dev
   ```

2. **Lokaler Build-Test**
   ```bash
   # Ohne EAS (lokal)
   npx expo prebuild
   cd android && ./gradlew assembleDebug
   ```

3. **Cache leeren**
   ```bash
   eas build --clear-cache --profile preview --platform android
   ```

### iOS Provisioning Issues

```bash
# Alle Credentials zurücksetzen
eas credentials -p ios
# Wähle: Remove a provisioning profile
# Dann: Add a new provisioning profile
```

### Android APK wird nicht installiert

- Stelle sicher, dass "Unbekannte Quellen" aktiviert ist
- Prüfe, ob es ein Debug- oder Release-Build ist

---

## Nützliche Befehle

```bash
# EAS CLI Version
eas --version

# Whoami (eingeloggter User)
eas whoami

# Projekt-Info
eas project:info

# Build-Konfiguration validieren
eas build:configure --platform all

# Alle Builds einer App
eas build:list --platform all --status finished

# Build abbrechen
eas build:cancel

# OTA Update veröffentlichen
eas update --branch preview --message "Bug fixes"
```

---

## Weiterführende Ressourcen

- [EAS Build Documentation](https://docs.expo.dev/build/introduction/)
- [EAS Submit Documentation](https://docs.expo.dev/submit/introduction/)
- [EAS Update Documentation](https://docs.expo.dev/eas-update/introduction/)
- [Expo Credentials](https://docs.expo.dev/app-signing/managed-credentials/)
