import { forecastHourly } from "../dom/domElements.js";
import { cache } from "../state/cache.js";
import { formatHour } from "./date.js";
import { getWeatherIcon } from "./weatherIcons.js";
import { results } from "../dom/domElements.js";
import { searchForWeather } from "../api/weather.js";
import { locate } from "../dom/domElements.js";
import { getCurrentDateInTimezone } from "./date.js";
import { currentDate } from "../dom/domElements.js";
import { chosenDay } from "../dom/domElements.js";
import { inputText } from "../dom/domElements.js";
import { registerEvents } from "../events/events.js";
import { handleEnterKeyEvent } from "../events/keyEvent.js";

export function getForecastHourly(weatherData, position) {
  // Define símbolo de temperatura conforme unidade escolhida
  const temperatureSymbol = cache.temperature === "celsius" ? "°C" : "°F";

  forecastHourly.forEach((divHour, i) => {
    // Hora formatada
    divHour.querySelector(".hour").textContent = formatHour(
      weatherData.hourly.time[position + i],
    );

    // Temperatura
    divHour.querySelector(".time-temperature").textContent =
      `${Math.round(weatherData.hourly.temperature_2m[position + i])}${temperatureSymbol}`;

    // Ícone de clima (dia/noite)
    divHour.querySelector(".hour-image").src = `assets/images/${getWeatherIcon(
      weatherData.hourly.weathercode[position + i],
      i < 6 || i > 17 ? 0 : 1,
    )}`;
  });
}

export function showResults(arrayResults) {
  // Limpa resultados anteriores
  results.innerHTML = "";

  if (!arrayResults.results || arrayResults.results.length === 0) {
    results.style.display = "none";
    return;
  }

  // Exibe container
  results.style.display = "block";

  // Cria cada item de resultado
  arrayResults.results.forEach((result, i) => {
    const divResult = document.createElement("div");
    divResult.className = "div-result";

    const flagImg = document.createElement("img");
    flagImg.src = `https://flagcdn.com/24x18/${result.country_code.toLowerCase()}.png`;
    flagImg.alt = `${result.country} flag`;
    flagImg.style.marginRight = "8px";

    const cityAndCountry = document.createElement("p");
    cityAndCountry.id = i;
    cityAndCountry.textContent =
      result.admin1 === undefined
        ? `${result.name}`
        : `${result.name} - ${result.admin1}`;

    divResult.appendChild(flagImg);
    divResult.appendChild(cityAndCountry);

    results.appendChild(divResult);

    results.children[0].classList += " checked";

    handleEnterKeyEvent();

    divResult.addEventListener("click", (evt) => {
      const chosenPlace = arrayResults.results[evt.target.children[1].id];

      cache.latitudeValue = chosenPlace.latitude;
      cache.longitudeValue = chosenPlace.longitude;

      searchForWeather(
        chosenPlace.latitude,
        chosenPlace.longitude,
        cache.temperature,
        cache.windSpeed,
        cache.precipitation,
      );

      locate.textContent =
        result.admin1 === undefined
          ? `${chosenPlace.name}`
          : `${chosenPlace.name}, ${chosenPlace.country}`;

      const stringCurrentDate = getCurrentDateInTimezone(
        chosenPlace.timezone,
        cache.languageFormat,
      );

      currentDate.textContent = stringCurrentDate;
      chosenDay.textContent = stringCurrentDate.split(",")[0];

      inputText.value = "";
      results.style.display = "none";
    });
  });
  results.style.display = "flex";
}
