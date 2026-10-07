// events/events.js
import {
  switchImperialButton,
  switchMetricButton,
  divTemperatureUnits,
  divSpeedUnits,
  divLengthUnits,
  celsiusButton,
  fahrenheitButton,
  kmButton,
  mphButton,
  millimetersButton,
  inchesButton,
  inputText,
  buttonSearch,
  dayItem,
  chosenDay,
  btnChooseDay,
  btnPt,
  btnEn,
  itemName,
  unitsButton,
  headerDropdown,
  unitsContainer,
} from "../dom/domElements.js";

import { cache } from "../state/cache.js";
import { next7Days } from "../utils/date.js";
import { searchForWeather } from "../api/weather.js";
import { searchForPlace } from "../api/location.js";
import { changeLanguage } from "../i18n/translations.js";
import { setSingleSelection } from "../utils/domUtils.js";
import { getForecastHourly } from "../utils/weatherRender.js";
import { getWeatherIcon } from "../utils/weatherIcons.js";
import { toggleDropdown } from "../utils/domUtils.js";
import { toggleHourlyDropdown } from "../utils/domUtils.js";
import { showResults } from "../utils/weatherRender.js";

// no topo de events.js
let index = 0;

export function registerEvents() {
  // Botão Imperial

  unitsButton.addEventListener("click", () => {
    headerDropdown.classList.toggle("rotated");

    if (headerDropdown.classList.contains("rotated")) {
      headerDropdown.style.transform = `rotate(180deg)`;
      unitsContainer.style.height = "50rem";
      unitsContainer.style.outline = "1px solid var(--Neutral-600)";
    } else {
      headerDropdown.style.transform = `rotate(0deg)`;
      unitsContainer.style.height = "0";
      unitsContainer.style.outline = "none";
    }
  });

  switchImperialButton.addEventListener("click", (evt) => {
    evt.target.style.display = "none";
    switchMetricButton.style.display = "inline-block";

    setSingleSelection(divTemperatureUnits, fahrenheitButton);
    setSingleSelection(divSpeedUnits, mphButton);
    setSingleSelection(divLengthUnits, inchesButton);

    cache.temperature = fahrenheitButton.id;
    cache.windSpeed = mphButton.id;
    cache.precipitation = inchesButton.id;

    searchForWeather(
      cache.latitudeValue,
      cache.longitudeValue,
      cache.temperature,
      cache.windSpeed,
      cache.precipitation,
    );
  });

  // Botão Métrico
  switchMetricButton.addEventListener("click", (evt) => {
    evt.target.style.display = "none";
    switchImperialButton.style.display = "inline-block";

    setSingleSelection(divTemperatureUnits, celsiusButton);
    setSingleSelection(divSpeedUnits, kmButton);
    setSingleSelection(divLengthUnits, millimetersButton);

    cache.temperature = celsiusButton.id;
    cache.windSpeed = kmButton.id;
    cache.precipitation = millimetersButton.id;

    searchForWeather(
      cache.latitudeValue,
      cache.longitudeValue,
      cache.temperature,
      cache.windSpeed,
      cache.precipitation,
    );
  });

  fahrenheitButton.addEventListener("click", (evt) => {
    setSingleSelection(divTemperatureUnits, evt.target);

    cache.temperature = fahrenheitButton.id;

    searchForWeather(
      cache.latitudeValue,
      cache.longitudeValue,
      cache.temperature,
      cache.windSpeed,
      cache.precipitation,
    );
  });

  celsiusButton.addEventListener("click", (evt) => {
    setSingleSelection(divTemperatureUnits, evt.target);

    cache.temperature = celsiusButton.id;

    searchForWeather(
      cache.latitudeValue,
      cache.longitudeValue,
      cache.temperature,
      cache.windSpeed,
      cache.precipitation,
    );
  });

  kmButton.addEventListener("click", (evt) => {
    setSingleSelection(divSpeedUnits, evt.target);

    cache.windSpeed = kmButton.id;

    searchForWeather(
      cache.latitudeValue,
      cache.longitudeValue,
      cache.temperature,
      cache.windSpeed,
      cache.precipitation,
    );
  });

  mphButton.addEventListener("click", (evt) => {
    setSingleSelection(divSpeedUnits, evt.target);

    cache.windSpeed = mphButton.id;

    searchForWeather(
      cache.latitudeValue,
      cache.longitudeValue,
      cache.temperature,
      cache.windSpeed,
      cache.precipitation,
    );
  });

  millimetersButton.addEventListener("click", (evt) => {
    setSingleSelection(divLengthUnits, evt.target);

    cache.precipitation = millimetersButton.id;

    searchForWeather(
      cache.latitudeValue,
      cache.longitudeValue,
      cache.temperature,
      cache.windSpeed,
      cache.precipitation,
    );
  });

  inchesButton.addEventListener("click", (evt) => {
    setSingleSelection(divLengthUnits, evt.target);

    cache.precipitation = inchesButton.id;

    searchForWeather(
      cache.latitudeValue,
      cache.longitudeValue,
      cache.temperature,
      cache.windSpeed,
      cache.precipitation,
    );
  });

  // Input de busca
  inputText.addEventListener("input", async () => {
    const query = inputText.value.trim();

    if (inputText.value.trim() === "") {
      results.style.display = "none";
      cache.keyEventIndex = 0;
      return;
    }

    const arrayResults = await searchForPlace(
      query,
      cache.languageFormat.toLowerCase(),
    );
    showResults(arrayResults);
  });

  // Botão de busca
  buttonSearch.addEventListener("click", () => {
    console.log(cache);
  });

  // Escolher dia
  dayItem.forEach((item) => {
    item.addEventListener("click", (evt) => {
      const arrayPostion = evt.target.id.split("-")[1];
      chosenDay.textContent = evt.target.children[0].textContent;

      getForecastHourly(cache.weatherData, Number(arrayPostion));
      toggleHourlyDropdown();
    });
  });

  // Dropdown de dias
  btnChooseDay.addEventListener("click", () => {
    toggleHourlyDropdown();

    // ✅ Verifica se já temos dados de clima
    if (cache.weatherData && cache.weatherData.daily) {
      const arrayDays = next7Days(
        cache.weatherData.daily.time,
        false,
        cache.languageFormat,
      );

      arrayDays.forEach((day, i) => {
        dayItem[i].id = `day-${i * 24}`;
        itemName[i].textContent = day;
      });
    } else {
      console.warn("Dados de clima ainda não carregados.");
    }
  });

  // Troca de idioma
  btnPt.addEventListener("click", () => changeLanguage("pt", "pt-BR"));
  btnEn.addEventListener("click", () => changeLanguage("en", "en-US"));
}
