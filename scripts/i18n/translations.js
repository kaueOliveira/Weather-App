import { cache } from "../state/cache.js";
import { locate, currentDate, chosenDay } from "../dom/domElements.js";
import { getCurrentDateInTimezone } from "../utils/date.js";
import { getCity } from "../api/location.js";
import { searchForWeather } from "../api/weather.js";

export const translations = {
  en: {
    locale: "en-US",
    units: "Units",
    switchToImperial: "Switch to Imperial",
    switchToMetric: "Switch to Metric",
    temperature: "Temperature",
    windSpeed: "Wind Speed",
    precipitation: "Precipitation",
    celsius: "Celsius (°C)",
    fahrenheit: "Fahrenheit (°F)",
    kmh: "km/h",
    mph: "mph",
    millimeters: "Millimeters (mm)",
    inches: "Inches (in)",
    title: "How's the sky looking today?",
    placeholder: "Search for a place...",
    button: "Search",
    noResults: "No locations found",
    loading: "Loading...",
    feelsLike: "Feels Like",
    humidity: "Humidity",
    wind: "Wind",
    precipitationLabel: "Precipitation",
    daily: "Daily forecast",
    hourly: "Hourly forecast",
    time: { am: "AM", pm: "PM" },
    errors: {
      generic: "Something went wrong",
      location: "Unable to fetch location",
    },
  },

  pt: {
    locale: "pt-BR",
    units: "Unidades",
    switchToImperial: "Mudar para Imperial",
    switchToMetric: "Mudar para Métrico",
    temperature: "Temperatura",
    windSpeed: "Velocidade do vento",
    precipitation: "Precipitação",
    celsius: "Celsius (°C)",
    fahrenheit: "Fahrenheit (°F)",
    kmh: "km/h",
    mph: "mph",
    millimeters: "Milímetros (mm)",
    inches: "Polegadas (in)",
    title: "Como está o céu hoje?",
    placeholder: "Pesquisar um local...",
    button: "Pesquisar",
    noResults: "Nenhum local encontrado",
    loading: "Carregando...",
    feelsLike: "Sensação térmica",
    humidity: "Umidade",
    wind: "Vento",
    precipitationLabel: "Precipitação",
    daily: "Previsão diária",
    hourly: "Por hora",
    time: { am: "AM", pm: "PM" },
    errors: {
      generic: "Algo deu errado",
      location: "Não foi possível obter a localização",
    },
  },
};

// Função para trocar idioma
export async function changeLanguage(lang, format) {
  cache.languageFormat = format;

  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const key = element.getAttribute("data-i18n");
    if (element.tagName === "INPUT" && key === "placeholder") {
      element.setAttribute("placeholder", translations[lang][key]);
    } else {
      element.textContent = translations[lang][key];
    }
  });

  // Atualiza dados do clima e localização
  await searchForWeather(
    cache.latitudeValue,
    cache.longitudeValue,
    cache.temperature,
    cache.windSpeed,
    cache.precipitation,
  );

  currentDate.textContent = getCurrentDateInTimezone(
    cache.timezone,
    cache.languageFormat,
  );
  chosenDay.textContent = getCurrentDateInTimezone(
    cache.timezone,
    cache.languageFormat,
  ).split(",")[0];

  const currentCity = await getCity(
    cache.latitudeValue,
    cache.longitudeValue,
    cache.languageFormat,
  );
  locate.textContent = currentCity;
}
