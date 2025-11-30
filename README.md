# TNZ Driver App - React Native

Aplikacja mobilna dla kierowców transportu na żądanie (linia 904) z obsługą GPS w tle.

## Funkcje

- 📍 Śledzenie lokalizacji GPS w tle (nawet z wyłączonym ekranem)
- 🚌 Lista wszystkich kursów szkolnych z rozkładu
- ✓ Oznaczanie kursów jako wykonane
- 🔔 Powiadomienie foreground service podczas aktywnego GPS
- 🔄 Synchronizacja w czasie rzeczywistym z Firebase
- 📞 Szybki kontakt z dyspozytorem

## Wymagania

- Node.js (wersja 18 lub nowsza)
- npm lub yarn
- Konto Expo (darmowe)
- Android SDK (jeśli budujesz lokalnie)

## Instalacja

### 1. Zainstaluj zależności

```bash
cd tnz-driver-native
npm install
```

### 2. Zaloguj się do Expo

```bash
npx expo login
```

### 3. Skonfiguruj EAS Build

```bash
npm install -g eas-cli
eas login
eas build:configure
```

Podczas konfiguracji:
- Wybierz "All" gdy zapyta o platformy
- Expo automatycznie utworzy `eas.json`

### 4. Zaktualizuj Project ID

Otwórz `app.json` i zmień `extra.eas.projectId` na ID swojego projektu:

```json
"extra": {
  "eas": {
    "projectId": "your-actual-project-id"
  }
}
```

Project ID otrzymasz po pierwszym `eas build:configure`.

## Uruchomienie w trybie deweloperskim

### Expo Go (szybki podgląd - BEZ background GPS)

```bash
npm start
```

Następnie zeskanuj kod QR aplikacją Expo Go.

**UWAGA:** Background GPS nie działa w Expo Go! Potrzebujesz development build.

### Development Build (z background GPS)

```bash
eas build --profile development --platform android
```

Po zbudowaniu:
1. Zainstaluj APK na urządzeniu
2. Uruchom `npm start`
3. Naciśnij "a" aby otworzyć na Androidzie

## Budowanie APK

### APK testowe (internal distribution)

```bash
eas build --platform android --profile preview
```

### APK produkcyjne (do publikacji)

```bash
eas build --platform android --profile production
```

Po zakończeniu budowania otrzymasz link do pobrania APK.

## Publikacja w Google Play

### 1. Przygotuj assets produkcyjne

- Zamień placeholder `assets/icon.png` (1024x1024)
- Zamień placeholder `assets/splash.png` (1284x2778)
- Zamień placeholder `assets/adaptive-icon.png` (1024x1024)

### 2. Zbuduj produkcyjny bundle

```bash
eas build --platform android --profile production
```

### 3. Submit do Google Play

```bash
eas submit --platform android
```

## Uprawnienia Android

Aplikacja wymaga następujących uprawnień:

- `ACCESS_FINE_LOCATION` - dokładna lokalizacja GPS
- `ACCESS_COARSE_LOCATION` - przybliżona lokalizacja
- `ACCESS_BACKGROUND_LOCATION` - lokalizacja w tle
- `FOREGROUND_SERVICE` - serwis w tle
- `FOREGROUND_SERVICE_LOCATION` - serwis lokalizacji w tle

## Struktura projektu

```
tnz-driver-native/
├── App.js                    # Main app z NavigationContainer i Background Task
├── app.json                  # Konfiguracja Expo
├── package.json              # Zależności
├── babel.config.js           # Konfiguracja Babel
├── src/
│   ├── screens/
│   │   └── HomeScreen.js     # Główny ekran z listą kursów
│   └── config/
│       ├── firebase.js       # Konfiguracja Firebase
│       └── schedules.js      # Rozkład jazdy
└── assets/                   # Ikony i splash screens
```

## Firebase

Aplikacja używa Firebase Realtime Database do:

- `savedSchedules/` - zamówione przystanki dla poszczególnych kursów
- `driverLocation/` - bieżąca pozycja GPS kierowcy
- `driverGPSEnabled` - status włączenia/wyłączenia GPS

## Rozwiązywanie problemów

### GPS nie działa w tle

1. Upewnij się, że testujesz na fizycznym urządzeniu (nie w emulatorze)
2. Sprawdź czy aplikacja ma uprawnienia do lokalizacji w tle w ustawieniach Androida
3. Użyj development build lub production build (NIE Expo Go)

### Build fails

```bash
# Wyczyść cache i spróbuj ponownie
eas build:clear
eas build --platform android
```

### Aplikacja się crashuje

Sprawdź logi:

```bash
npx react-native log-android
```

## Kontakt

W przypadku problemów sprawdź dokumentację Expo:
- https://docs.expo.dev
- https://docs.expo.dev/build/introduction/
- https://docs.expo.dev/versions/latest/sdk/location/
