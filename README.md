# 🚌 Panel Kierowcy 904 - Aplikacja dla Kierowców

Aplikacja mobilna- natywna dla kierowców transportu na zadanie z GPS w tle i synchronizacją Firebase.

## 🎯 Główne Funkcje

- 📍 Śledzenie GPS w tle (nawet z wyłączonym ekranem, aktualizacja co 60s)
- 🚌 Rozkład jazdy z listą kursów i zamówionymi przystankami
- ✅ Oznaczanie kursów jako wykonane (manualne + automatyczne)
- 🎯 Wyróżnienie najbliższego odjazdu (do 30 min)
- 📞 Szybki kontakt z dyspozytorem jednym kliknięciem
- 🔄 Synchronizacja w czasie rzeczywistym z Firebase
- 🔔 Powiadomienie foreground service podczas aktywnego GPS

## 🚀 Szybki Start

```bash
# Instalacja
npm install

# Uruchomienie lokalnie (Expo Go - bez GPS w tle)
npm start

# Development build (z GPS w tle)
npm install -g eas-cli
eas login
eas build --profile development --platform android
```

**UWAGA:** GPS w tle działa tylko w development/production build, nie w Expo Go!

## 📱 Budowanie APK

```bash
# Testowe (preview)
eas build --platform android --profile preview

# Produkcyjne (do publikacji)
eas build --platform android --profile production
```

## 🛠️ Technologie

- React Native 0.81.5 + Expo ~54.0.0
- Firebase Realtime Database
- Expo Location (GPS tracking)
- Expo Task Manager (background tasks)
- React Navigation (nawigacja)

## 📂 Struktura Projektu

```
src/
├── components/
│   ├── Header.jsx               # Nagłówek z GPS toggle + dyspozytorem
│   ├── DepartureCard.jsx        # Karta kursu z przystankami
│   ├── StopItem.jsx             # Element listy przystanków
│   ├── NextBadge.jsx            # Badge "Najbliższy odjazd"
│   └── EmptyState.jsx           # Pusty stan
├── hooks/
│   ├── useSchedule.js           # Rozkład jazdy + czas do odjazdu
│   ├── useLocationTracking.js   # GPS tracking w tle
│   └── useCourseCompletion.js   # Oznaczanie kursów
├── screens/
│   └── HomeScreen.jsx           # Główny ekran
├── styles/
│   └── theme.js                 # Kolory, typografia, spacing, shadows
├── config/
│   ├── firebase.js              # Firebase Realtime Database
│   └── schedules.js             # Rozkład jazdy (dane)
└── constants/
    └── app.js                   # Stałe konfiguracyjne
```

## 🔧 Konfiguracja

### Zmiana numeru dyspozytora

Edytuj `src/constants/app.js`:

```javascript
export const DISPATCHER_PHONE = "123456789";
```

### Zmiana rozkładu jazdy

Edytuj `src/config/schedules.js`:

```javascript
export const schedule = {
  "07:10": {
    stops: ["SKM Podjuchy", "Metalowa", "..."],
    times: { "SKM Podjuchy": "07:10", Metalowa: "07:12" },
  },
};
```

### Inne stałe w `src/constants/app.js`

- `LOCATION_UPDATE_INTERVAL` - interwał GPS (60000ms)
- `AUTO_COMPLETE_DELAY` - auto-complete po 10 minutach
- `END_OF_DAY_HOUR` - ukrycie kursów po 17:00
- `NEXT_DEPARTURE_WINDOW` - okno następnego kursu (30 min)

## 🗄️ Przechowywanie Danych

**Firebase Realtime Database:**

- `savedSchedules/{key}` - zamówione przystanki dla kursów
- `driverLocation` - pozycja GPS kierowcy (lat, lng, accuracy, timestamp)
- `driverGPSEnabled` - status włączenia/wyłączenia GPS

**Przykład danych GPS:**

```json
{
  "latitude": 54.352025,
  "longitude": 18.646638,
  "accuracy": 10,
  "timestamp": 1234567890
}
```

## ⚙️ Jak Działa

### Oznaczanie kursów

1. **Manualne** - przycisk "Oznacz jako wykonany" po godzinie odjazdu
   - Można cofnąć przyciskiem "Cofnij"
2. **Automatyczne** - system oznacza po 10 minutach od odjazdu
   - NIE można cofnąć (zapobiega przypadkowemu cofnięciu)

### GPS Tracking

- Aktualizacja pozycji co 60 sekund
- Działa w tle jako foreground service
- Powiadomienie "TNZ GPS Aktywny" podczas działania
- Wysyła dane do Firebase: `driverLocation/`

### Custom Hooks

- **useSchedule()** - rozkład z Firebase, obliczenia czasu, najbliższy kurs
- **useLocationTracking()** - GPS, uprawnienia, wysyłka do Firebase co 60s
- **useCourseCompletion()** - manualne/auto oznaczanie, cofanie tylko dla manualnych

## 🐛 Rozwiązywanie Problemów

**GPS nie działa w tle:**

- Testuj na fizycznym urządzeniu (nie w emulatorze)
- Sprawdź uprawnienia do lokalizacji w tle w ustawieniach Androida
- Użyj development/production build (NIE Expo Go)

**Build fails:**

```bash
eas build --clear-cache
eas build --platform android
```

**Sprawdzanie logów:**

```bash
npx react-native log-android
# lub
adb logcat
```

## 📋 Wymagane Uprawnienia Android

- `ACCESS_FINE_LOCATION` - dokładna lokalizacja GPS
- `ACCESS_BACKGROUND_LOCATION` - lokalizacja w tle
- `FOREGROUND_SERVICE` - serwis w tle
- `FOREGROUND_SERVICE_LOCATION` - serwis lokalizacji w tle

## 👥 Autor

**Michał Marszałek**

---

**Ostatnia aktualizacja:** Grudzień 2026
