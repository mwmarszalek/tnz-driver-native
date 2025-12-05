# TNZ Driver App - React Native

Aplikacja mobilna dla kierowców transportu na żądanie (linia 904) z obsługą GPS w tle.

## Funkcje

- 📍 Śledzenie lokalizacji GPS w tle (nawet z wyłączonym ekranem)
- 🚌 Lista wszystkich kursów szkolnych z rozkładu
- ✓ Oznaczanie kursów jako wykonane (manualne i automatyczne)
- 🔔 Powiadomienie foreground service podczas aktywnego GPS
- 🔄 Synchronizacja w czasie rzeczywistym z Firebase
- 📞 Szybki kontakt z dyspozytorem
- ⏰ Automatyczne oznaczanie kursów wykonanych po 10 minutach od odjazdu
- 🎯 Wyróżnienie najbliższego odjazdu

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

## Uprawnienia Android

Aplikacja wymaga następujących uprawnień:

- `ACCESS_FINE_LOCATION` - dokładna lokalizacja GPS
- `ACCESS_COARSE_LOCATION` - przybliżona lokalizacja
- `ACCESS_BACKGROUND_LOCATION` - lokalizacja w tle
- `FOREGROUND_SERVICE` - serwis w tle
- `FOREGROUND_SERVICE_LOCATION` - serwis lokalizacji w tle

## Architektura i struktura projektu

Projekt został zorganizowany zgodnie z najlepszymi praktykami React Native (o których wiedziałem :P)

```
tnz-driver-native/
├── App.js                          # Root app z NavigationContainer i Background Task
├── app.json                        # Konfiguracja Expo
├── eas.json                        # Konfiguracja EAS Build
├── package.json                    # Zależności
├── babel.config.js                 # Konfiguracja Babel
├── src/
│   ├── components/                 # Komponenty UI (reusable)
│   │   ├── index.js                # Export wszystkich komponentów
│   │   ├── Header.js               # Nagłówek z przyciskami GPS i dyspozytora
│   │   ├── Header.styles.js        # Style dla Header
│   │   ├── DepartureCard.js        # Karta kursu (główny komponent)
│   │   ├── DepartureCard.styles.js # Style dla DepartureCard
│   │   ├── NextBadge.js            # Badge "Najbliższy odjazd"
│   │   ├── NextBadge.styles.js     # Style dla NextBadge
│   │   ├── StopItem.js             # Element listy przystanków
│   │   ├── StopItem.styles.js      # Style dla StopItem
│   │   ├── NoStops.js              # Komunikat "Brak przystanków"
│   │   ├── NoStops.styles.js       # Style dla NoStops
│   │   ├── EmptyState.js           # Stan pustej listy
│   │   └── EmptyState.styles.js    # Style dla EmptyState
│   ├── hooks/                      # Custom React hooks
│   │   ├── index.js                # Export wszystkich hooks
│   │   ├── useSchedule.js          # Logika rozkładu jazdy i czasu
│   │   ├── useLocationTracking.js  # Logika GPS tracking
│   │   └── useCourseCompletion.js  # Logika oznaczania kursów
│   ├── screens/                    # Ekrany aplikacji
│   │   ├── HomeScreen.js           # Główny ekran
│   │   └── HomeScreen.styles.js    # Style dla HomeScreen
│   ├── styles/                     # System stylów
│   │   └── theme.js                # Tylko zmienne: kolory, typografia, spacing, shadows
│   ├── config/                     # Konfiguracja
│   │   ├── firebase.js             # Firebase Realtime Database
│   │   └── schedules.js            # Rozkład jazdy (dane)
│   ├── constants/                  # Stałe aplikacji
│   │   └── app.js                  # Wartości czasowe, konfiguracja
│   └── utils/                      # Utility functions
└── assets/                         # Ikony i splash screens
    ├── icon.png
    ├── adaptive-icon.png
    └── splash.png
```

## Architektura komponentów

### Custom Hooks

Aplikacja używa trzech głównych custom hooks do zarządzania logiką:

#### `useSchedule()`

- Zarządza stanem rozkładu jazdy z Firebase
- Obsługuje aktualizację czasu co minutę
- Oblicza czas do odjazdu dla każdego kursu
- Znajduje najbliższy odjazd

#### `useLocationTracking()`

- Zarządza GPS tracking w tle
- Obsługuje uprawnienia do lokalizacji
- Wysyła pozycję do Firebase co 60 sekund
- Wspiera zarówno Web (mock GPS) jak i Native (prawdziwy GPS)

#### `useCourseCompletion()`

- Zarządza oznaczaniem kursów jako wykonane
- Automatyczne oznaczanie po 10 minutach od odjazdu
- Rozróżnia manualne vs automatyczne oznaczenia
- Obsługuje cofanie tylko dla manualnych oznaczeń

### Komponenty UI

Wszystkie komponenty są w pełni modułowe i reusable:

- **Header** - Nagłówek z przyciskami (GPS toggle, kontakt do dyspozytora)
- **DepartureCard** - Główny komponent karty kursu z logiką wyświetlania
- **NextBadge** - Pomarańczowy badge dla najbliższego odjazdu
- **StopItem** - Element listy przystanków z numerem i czasem
- **NoStops** - Komunikat gdy brak zamówionych przystanków
- **EmptyState** - Stan pustej listy kursów

### System Stylów

Aplikacja używa prostego systemu stylów - każdy komponent ma swój plik `.styles.js`:

**Struktura:**

- `src/styles/theme.js` - **tylko zmienne** (colors, typography, spacing, borderRadius, shadows)
- Każdy komponent ma osobny plik `.styles.js` obok głównego pliku

**`src/styles/theme.js`** - Centralne zmienne:

- `colors` - Paleta kolorów (primary, success, warning, text, background)
- `typography` - Rozmiary czcionek i wagi (xs → huge, normal → extrabold)
- `spacing` - Wartości odstępów (xs: 4px → massive: 60px)
- `borderRadius` - Zaokrąglenia (sm: 8px → full: 9999px)
- `shadows` - Pre-defined cienie (sm, md, lg, xl + color-specific)

**Przykład - DepartureCard:**

```javascript
// DepartureCard.js
import { View, Text } from "react-native";
import { styles } from "./DepartureCard.styles";

const DepartureCard = () => {
  return <View style={styles.container}>...</View>;
};

// DepartureCard.styles.js
import { StyleSheet } from "react-native";
import { colors, spacing, shadows } from "../styles/theme";

export const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.primary,
    padding: spacing.xl,
    ...shadows.lg,
  },
});
```

**Zalety:**

- ✅ Prosty i przejrzysty - każdy komponent ma swoje style
- ✅ Łatwe w utrzymaniu - style obok logiki komponentu
- ✅ Brak nadmiernej abstrakcji - tylko używane wartości

## Zasady działania

### Oznaczanie kursów

1. **Manualne oznaczenie** - kierowca klika "Oznacz jako wykonany"

   - Przycisk pojawia się gdy minie godzina odjazdu
   - Można cofnąć przyciskiem "Cofnij" (niebieski)

2. **Automatyczne oznaczenie** - system oznacza po 10 minutach
   - Kursy automatycznie oznaczone NIE mogą być cofnięte
   - Zapobiega to przypadkowemu cofnięciu przez kierowcę

### GPS Tracking

- Aktualizacja pozycji co 60 sekund
- Działa w tle (foreground service)
- Powiadomienie "TNZ GPS Aktywny" gdy aktywne
- Zapisuje pozycję w Firebase: `driverLocation/`

## Firebase

Aplikacja używa Firebase Realtime Database do:

- `savedSchedules/` - zamówione przystanki dla poszczególnych kursów
- `driverLocation/` - bieżąca pozycja GPS kierowcy
  ```json
  {
    "latitude": 53.416454,
    "longitude": 14.549563,
    "accuracy": 10,
    "timestamp": 1234567890
  }
  ```
- `driverGPSEnabled` - status włączenia/wyłączenia GPS (boolean)

## Stałe konfiguracyjne

Wszystkie stałe znajdują się w `src/constants/app.js`:

- `LOCATION_UPDATE_INTERVAL` - 60000ms (60 sekund)
- `AUTO_COMPLETE_DELAY` - 10 minut
- `END_OF_DAY_HOUR` - 17 (5 PM)
- `NEXT_DEPARTURE_WINDOW` - 30 minut
- `COLORS` - paleta kolorów aplikacji

## Rozwiązywanie problemów

### GPS nie działa w tle

1. Upewnij się, że testujesz na fizycznym urządzeniu (nie w emulatorze)
2. Sprawdź czy aplikacja ma uprawnienia do lokalizacji w tle w ustawieniach Androida
3. Użyj development build lub production build (NIE Expo Go)

### Build fails

```bash
# Wyczyść cache i spróbuj ponownie
eas build --clear-cache
eas build --platform android
```

### Aplikacja się crashuje

Sprawdź logi:

```bash
npx react-native log-android
# lub
adb logcat
```

## Development

### Dodawanie nowego komponentu

1. Stwórz plik komponentu: `src/components/NazwaKomponentu.js`
2. Stwórz plik stylów: `src/components/NazwaKomponentu.styles.js`
3. Import zmiennych z `theme.js`: `import { colors, spacing } from "../styles/theme"`
4. Dodaj export w `src/components/index.js`

### Dodawanie nowego hooka

1. Stwórz plik w `src/hooks/useNazwaHooka.js`
2. Exportuj jako named export
3. Dodaj export w `src/hooks/index.js`

### Modyfikacja stałych

Edytuj `src/constants/app.js` - wszystkie wartości są tam scentralizowane.

## Kontakt

W przypadku problemów sprawdź dokumentację Expo:

- https://docs.expo.dev
- https://docs.expo.dev/build/introduction/
- https://docs.expo.dev/versions/latest/sdk/location/
