import {
  formatHour,
  next7Days,
  getCurrentDateInTimezone,
  getCurrentHourInTimezone
} from "./utils/date.js";

import {
  switchImperialButton,
  switchMetricButton,
  divTemperatureUnits,
  celsiusButton,
  fahrenheitButton,
} from "./dom/domElements.js";

import { cache } from "./state/cache.js";

import { searchForWeather } from "./api/weather.js";
import { searchForPlace, getCity } from "./api/location.js";

import { changeLanguage } from "./i18n/translations.js";

import { registerEvents } from "./events/events.js";
import { handleKeyDownEvent } from "./events/keyEvent.js";

function initApp() {
  // Registra todos os listeners
  registerEvents();
  handleKeyDownEvent();

  // Se geolocalização estiver disponível, busca clima inicial
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const currentLat = position.coords.latitude;
      const currentLong = position.coords.longitude;

      cache.latitudeValue = currentLat;
      cache.longitudeValue = currentLong;

      const currentCity = await getCity(currentLat, currentLong, cache.languageFormat);
      document.getElementById("city-name").textContent = currentCity;

      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      document.getElementById("current-date").textContent = getCurrentDateInTimezone(timezone, cache.languageFormat);
      document.getElementById("chosen-day").textContent = getCurrentDateInTimezone(timezone, cache.languageFormat).split(",")[0];

      searchForWeather(currentLat, currentLong, cache.temperature, cache.windSpeed, cache.precipitation);
    });
  }
}

// Executa inicialização
initApp();