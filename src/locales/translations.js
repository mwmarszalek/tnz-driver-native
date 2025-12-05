export const translations = {
  pl: {
    // Header
    driverPanel: "Panel Kierowcy",
    transportLine: "Transport Na Żądanie\nLinia 904",
    dispatcher: "Dyspozytor",
    online: "Online",
    selectLanguage: "Wybierz język",

    // DepartureCard
    stop: "przystanek",
    stops2to4: "przystanki",
    stops5plus: "przystanków",
    markAsCompleted: "Oznacz jako wykonany",
    undo: "Cofnij",

    // NextBadge
    nextDeparture: "Najbliższy odjazd",
    inMinutes: "za {{minutes}} min",
    now: "teraz",

    // NoStops
    noStops: "Brak zamówionych przystanków",

    // EmptyState
    noCoursesToday: "Brak zamówionych kursów",
    checkSchedule: "Wszystkie kursy pojawią się tutaj",
  },
  uk: {
    // Header
    driverPanel: "Панель Водія",
    transportLine: "Транспорт на Вимогу\nЛінія 904",
    dispatcher: "Диспетчер",
    online: "Онлайн",
    selectLanguage: "Виберіть мову",

    // DepartureCard
    stop: "зупинка",
    stops2to4: "зупинки",
    stops5plus: "зупинок",
    markAsCompleted: "Позначити як виконано",
    undo: "Скасувати",

    // NextBadge
    nextDeparture: "Найближчий виїзд",
    inMinutes: "через {{minutes}} хв",
    now: "зараз",

    // NoStops
    noStops: "Немає замовлених зупинок",

    // EmptyState
    noCoursesToday: "Немає замовлених рейсів",
    checkSchedule: "Усі рейси з'являться тут",
  },
};

// Helper function to replace placeholders
export const formatTranslation = (text, params = {}) => {
  let result = text;
  Object.keys(params).forEach((key) => {
    result = result.replace(`{{${key}}}`, params[key]);
  });
  return result;
};
