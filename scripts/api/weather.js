//searchForWeather
import { cache } from "../state/cache.js";
import {
  currentWeatherIcon,
  currentTemperature,
  currentFeelsLike,
  currentHumidity,
  currentWindSpeed,
  currentPrecipitation,
  forecastDays,
  forecastHourly,
  loadingElement
} from "../dom/domElements.js";
import { getWeatherIcon } from "../utils/weatherIcons.js";
import {
  next7Days,
  getCurrentHourInTimezone,
  formatHour,
} from "../utils/date.js";

import { getForecastHourly } from "../utils/weatherRender.js";

export async function searchForWeather(
  lat,
  long,
  unitTemp,
  unitWindSpeed,
  unitPrecipitation,
) {
  const urlWeather = `https://api.open-meteo.com/v1/forecast
?latitude=${lat}
&longitude=${long}
&current_weather=true
&hourly=temperature_2m,apparent_temperature,relative_humidity_2m,precipitation,weathercode
&daily=temperature_2m_min,temperature_2m_max,weathercode
&temperature_unit=${unitTemp}
&windspeed_unit=${unitWindSpeed}
&precipitation_unit=${unitPrecipitation}
&timezone=auto`;

  try {
    const weatherResponse = await fetch(urlWeather);
    cache.weatherData = await weatherResponse.json();
    const weatherData = cache.weatherData; // ✅ agora existe

    loadingElement.style.display = "none";

    cache.timezone = weatherData.timezone;

    const feelsLike =
      weatherData.hourly.apparent_temperature[
        getCurrentHourInTimezone(weatherData.timezone)
      ];
    const humidity =
      weatherData.hourly.relative_humidity_2m[
        getCurrentHourInTimezone(weatherData.timezone)
      ];
    const windSpeed = weatherData.current_weather.windspeed;
    const precipitation =
      weatherData.hourly.precipitation[getCurrentHourInTimezone(weatherData.timezone)];
    const temperature = weatherData.current_weather.temperature;

    currentWeatherIcon.src = `assets/images/${getWeatherIcon(weatherData.current_weather.weathercode, weatherData.current_weather.is_day)}`;

    let temperatureSymbol = cache.temperature === "celsius" ? "°C" : "°F";
    currentTemperature.textContent = `${Math.round(temperature)}${temperatureSymbol}`;
    currentFeelsLike.textContent = `${Math.round(feelsLike)}${temperatureSymbol}`;
    currentHumidity.textContent = `${Math.round(humidity)}%`;

    let speedSymbol = cache.windSpeed === "kmh" ? "km/h" : "mph";
    currentWindSpeed.textContent = `${Math.round(windSpeed)} ${speedSymbol}`;

    let precipitationSymbol = cache.precipitation === "mm" ? "mm" : "''";
    currentPrecipitation.textContent = `${Math.round(precipitation)}${precipitationSymbol}`;

    forecastDays.forEach((day, i) => {
      day.querySelector(".current-day").textContent = next7Days(
        weatherData.daily.time,
        true,
        cache.languageFormat, // ✅ corrigido
      )[i];
      day.querySelector(".current-day-image").src =
        `assets/images/${getWeatherIcon(weatherData.daily.weathercode[i], 1)}`;
      day.querySelector(".temperature-min").textContent =
        `${Math.round(weatherData.daily.temperature_2m_min[i])}${temperatureSymbol}`;
      day.querySelector(".temperature-max").textContent =
        `${Math.round(weatherData.daily.temperature_2m_max[i])}${temperatureSymbol}`;
    });

    getForecastHourly(weatherData, 0);
  } catch (error) {
    console.error("Erro ao buscar clima", error);
  }
}