# Tester Onboarding Guide

Willkommen als Beta-Tester für MenuMate! Diese Anleitung erklärt, wie du die App auf deinem Gerät installierst und Feedback gibst.

---

## Android Tester (Google Play Internal Testing)

### Schritt 1: Einladung annehmen

1. Du erhältst einen **Internal Testing Link** per Email oder Chat
2. Öffne den Link auf deinem Android-Gerät
3. Melde dich mit deinem Google-Konto an
4. Akzeptiere die Einladung zum Test

### Schritt 2: App installieren

1. Nach Akzeptieren der Einladung wirst du zum Play Store weitergeleitet
2. Klicke auf **Installieren**
3. Die App erscheint als "MenuMate" in deiner App-Liste

### Schritt 3: Updates erhalten

- Updates werden automatisch über den Play Store installiert
- Aktiviere Auto-Updates für die App im Play Store

### Troubleshooting Android

**"App nicht verfügbar"**
- Prüfe, ob du mit dem richtigen Google-Konto angemeldet bist
- Warte 10-15 Minuten nach Einladung, bis die App sichtbar ist

**"Nicht kompatibel mit diesem Gerät"**
- Mindestanforderung: Android 6.0 (API Level 23)
- Kontaktiere das Team für eine APK-Direktinstallation

---

## iOS Tester (TestFlight)

### Schritt 1: TestFlight installieren

1. Öffne den [App Store](https://apps.apple.com/app/testflight/id899247664)
2. Suche nach "TestFlight" (Apple App)
3. Installiere die TestFlight App

### Schritt 2: Einladung annehmen

**Per Email:**
1. Du erhältst eine Email von Apple mit dem Betreff "You're invited to test MenuMate"
2. Öffne die Email auf deinem iPhone/iPad
3. Klicke auf **View in TestFlight**
4. TestFlight öffnet sich und zeigt MenuMate

**Per Public Link:**
1. Öffne den TestFlight-Link auf deinem Gerät
2. TestFlight öffnet sich automatisch
3. Tippe auf **Accept**

### Schritt 3: App installieren

1. In TestFlight, tippe auf **MenuMate**
2. Tippe auf **Install**
3. Die App erscheint auf deinem Home Screen

### Schritt 4: Updates erhalten

- TestFlight zeigt dir neue Updates mit einem blauen Punkt
- Tippe auf **Update** um die neueste Version zu installieren
- Aktiviere Benachrichtigungen in TestFlight für Update-Alerts

### Troubleshooting iOS

**TestFlight zeigt keine Einladung**
- Prüfe deine Email (auch Spam-Ordner)
- Stelle sicher, dass du mit der eingeladenen Apple ID angemeldet bist

**"Build nicht mehr verfügbar"**
- TestFlight Builds laufen nach 90 Tagen ab
- Warte auf den nächsten Build oder kontaktiere das Team

---

## Feedback geben

### In-App Feedback (bevorzugt)

1. Schüttle dein Gerät (Shake-Gesture) für den Feedback-Dialog
2. Oder: Profil → Feedback senden

### TestFlight Feedback (iOS)

1. Öffne TestFlight
2. Wähle MenuMate
3. Tippe auf **Send Beta Feedback**
4. Schreibe dein Feedback und füge Screenshots hinzu

### GitHub Issues

Für detaillierte Bug Reports:

1. Gehe zu: [github.com/mootseeker/MenuMate/issues](https://github.com/mootseeker/MenuMate/issues)
2. Klicke auf **New Issue**
3. Wähle **Bug Report** oder **Feature Request**
4. Fülle das Template aus

### Bug Report Template

```
**Gerät:** iPhone 14 / Samsung Galaxy S23
**OS Version:** iOS 17.2 / Android 14
**App Version:** 1.0.0 (Build 42)

**Beschreibung:**
Was ist passiert?

**Schritte zum Reproduzieren:**
1. Öffne die App
2. Gehe zu...
3. Tippe auf...

**Erwartetes Verhalten:**
Was sollte passieren?

**Screenshots:**
(Falls vorhanden)
```

---

## Release Notes

### Version 1.0.0-preview.1 (Aktuell)

**Neue Features:**
- 📔 Tagebuch mit Mahlzeiten-Tracking
- 🍔 Barcode-Scanner für Lebensmittel
- 📊 Nährwert-Analyse und Statistiken
- 👤 Profil mit TDEE-Berechnung
- 🎯 Ziel-Setting für Kalorien und Makros

**Bekannte Einschränkungen:**
- AI Meal Scan noch nicht aktiviert
- Keine Offline-Unterstützung
- Keine Apple Health / Health Connect Integration

---

## FAQ

### Wie sicher sind meine Daten?

- Alle Daten werden verschlüsselt übertragen (HTTPS/TLS)
- Daten werden in der EU gespeichert (Supabase)
- Du kannst jederzeit deinen Account und alle Daten löschen

### Werden meine Test-Daten in die finale App übernommen?

- Nein, Beta-Daten werden vor dem Release zurückgesetzt
- Erstelle dir bei Release einen neuen Account

### Wie oft gibt es Updates?

- Preview Builds werden nach jedem Merge in `main` erstellt
- In der Regel 1-2x pro Woche neue Versionen

### An wen wende ich mich bei Problemen?

- **Email:** beta@menumate.app
- **GitHub Issues:** [mootseeker/MenuMate](https://github.com/mootseeker/MenuMate/issues)
- **Discord:** (Link wird geteilt)

---

## Danke fürs Testen! 🙏

Dein Feedback hilft uns, MenuMate besser zu machen. Jeder Bug Report und jede Anregung ist wertvoll!
