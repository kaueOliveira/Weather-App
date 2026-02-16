const switchImperialButton = document.getElementById("switch-imperial");
const switchMetricButton = document.getElementById("switch-metric");

const unitsButton = document.getElementById("units-menu-button");
const headerDropdown = document.getElementById("header-dropdown-button");
const unitsContainer = document.getElementById("unit-settings-dropdown");

const divTemperatureUnits = document.getElementById("div-temperature-units");
const celsiusButton = document.getElementById("celsius");
const fahrenheitButton = document.getElementById("fahrenheit");

const divSpeedUnits = document.getElementById("div-speed-units");
const kmButton = document.getElementById("kmh");
const mphButton = document.getElementById("mph");

const divLengthUnits = document.getElementById("div-length-units");
const millimetersButton = document.getElementById("mm");
const inchesButton = document.getElementById("inch");

const buttonSearch = document.getElementById("button-search");
const inputText = document.getElementById("input-text");
const results = document.getElementById("results");

const loadingElement = document.querySelector(".loading");

const currentDate = document.getElementById("current-date");
const locate = document.getElementById("city-name");
const currentWeatherIcon = document.getElementById("current-weather-icon");
const currentTemperature = document.getElementById("temperature");

const currentFeelsLike = document.getElementById("feels-like-value");
const currentHumidity = document.getElementById("humidity-value");
const currentWindSpeed = document.getElementById("wind-speed-value");
const currentPrecipitation = document.getElementById("precipitation-value");

const forecastDays = document.querySelectorAll(".div-day");

const chosenDay = document.getElementById("chosen-day");

const sectionForecastHouly = document.getElementById("hourly-forecast");
const forecastHourly = document.querySelectorAll(".div-hour");

const weekDaysContainer = document.getElementById("week-days-container");
const dayItem = document.querySelectorAll(".div-day-item");
const itemName = document.querySelectorAll(".item-name");

const btnChooseDay = document.getElementById("div-choose-day");
const hourlyDropdownButton = document.getElementById("hourly-dropdown-button");

let weatherData;

let cache = {
  latitudeValue: 0,
  longitudeValue: 0,
  temperature: "celsius",
  windSpeed: "kmh",
  precipitation: "mm",
};

async function searchForWeather(
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
    weatherData = await weatherResponse.json();

    loadingElement.style.display = "none";
    const feelsLike =
      weatherData.hourly.apparent_temperature[
        horaTimezone(weatherData.timezone)
      ];
    const humidity =
      weatherData.hourly.relative_humidity_2m[
        horaTimezone(weatherData.timezone)
      ];
    const windSpeed = weatherData.current_weather.windspeed;
    const precipitation =
      weatherData.hourly.precipitation[horaTimezone(weatherData.timezone)];
    const temperature = weatherData.current_weather.temperature;

    currentWeatherIcon.src = `assets/images/${getWeatherIcon(
      weatherData.current_weather.weathercode,
    )}`;

    let temperatureSymbol;
    cache.temperature == "celsius"
      ? (temperatureSymbol = "°C")
      : (temperatureSymbol = "°F");
    currentTemperature.textContent = `${Math.round(temperature)}${temperatureSymbol}`;
    currentFeelsLike.textContent = `${Math.round(feelsLike)}${temperatureSymbol}`;

    currentHumidity.textContent = `${Math.round(humidity)}%`;

    let speedSymbol;
    cache.windSpeed == "kmh" ? (speedSymbol = "km/h") : (speedSymbol = "mph");
    currentWindSpeed.textContent = `${Math.round(windSpeed)} ${speedSymbol}`;

    let precipitationSymbol;
    cache.precipitation == "mm"
      ? (precipitationSymbol = "mm")
      : (precipitationSymbol = "''");
    currentPrecipitation.textContent = `${Math.round(precipitation)}${precipitationSymbol}`;

    forecastDays.forEach((day, i) => {
      day.querySelector(".current-day").textContent = next7Days(
        weatherData.daily.time,
        true,
      )[i];

      day.querySelector(".current-day-image").src =
        `assets/images/${getWeatherIcon(weatherData.daily.weathercode[i])}`;

      day.querySelector(".temperature-min").textContent = `${Math.round(
        weatherData.daily.temperature_2m_min[i],
      )}${temperatureSymbol}`;

      day.querySelector(".temperature-max").textContent = `${Math.round(
        weatherData.daily.temperature_2m_max[i],
      )}${temperatureSymbol}`;
    });

    getForecastHourly(0);
  } catch (error) {
    console.log("Erro");
  }
}

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

function setSingleSelection(div, button) {
  Array.from(div.children).forEach((child) => {
    if (child.classList.contains("checked")) {
      child.classList.remove("checked");
    }
  });

  button.classList = "checked";
}

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

inputText.addEventListener("input", () => {
  searchForPlace(inputText.value, false);
});

dayItem.forEach((item) => {
  item.addEventListener("click", (evt) => {
    const arrayPostion = evt.target.id.split("-")[1];
    chosenDay.textContent = evt.target.children[0].textContent;

    getForecastHourly(Number(arrayPostion));
    toggleHourlyDropdown();
  });
});

buttonSearch.addEventListener("click", () => {
  console.log(cache);
});

btnChooseDay.addEventListener("click", (evt) => {
  toggleHourlyDropdown();
  const arrayDays = next7Days(weatherData.daily.time, false);

  arrayDays.forEach((day, i) => {
    dayItem[i].id = `day-${i * 24}`;
    itemName[i].textContent = day;
  });
});

async function searchForPlace(locationName) {
  const urlLocation = `https://geocoding-api.open-meteo.com/v1/search?name=${locationName}&count=5&language=us&format=json`;

  try {
    const locationResponse = await fetch(urlLocation);
    const locationData = await locationResponse.json();

    showResults(locationData.results);
  } catch (error) {
    console.log("Erro");
  }
}

function getForecastHourly(position) {
  let temperatureSymbol;
  cache.temperature == "celsius"
    ? (temperatureSymbol = "°C")
    : (temperatureSymbol = "°F");

  forecastHourly.forEach((divHour, i) => {
    divHour.querySelector(".hour").textContent = formatHour(
      weatherData.hourly.time[position + i],
    );

    divHour.querySelector(".time-temperature").innerHTML =
      `${Math.round(weatherData.hourly.temperature_2m[position + i])}${temperatureSymbol}`;

    divHour.querySelector(".hour-image").src =
      `assets/images/${getWeatherIcon(weatherData.hourly.weathercode[position + i])}`;
  });
}

function toggleHourlyDropdown() {
  hourlyDropdownButton.classList.toggle("rotated");

  if (hourlyDropdownButton.classList.contains("rotated")) {
    hourlyDropdownButton.style.transform = `rotate(180deg)`;
    weekDaysContainer.style.height = "29.5rem";
    weekDaysContainer.style.outline = "2px solid var(--Neutral-600)";
  } else {
    hourlyDropdownButton.style.transform = `rotate(0deg)`;
    weekDaysContainer.style.height = "0";
    weekDaysContainer.style.outline = "none";
  }
}

function getTodayBYCountry(timeZone) {
  return new Intl.DateTimeFormat("en-us", {
    timeZone,
    weekday: "long",
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date());
}

function next7Days(datas, isShort) {
  return datas.map((data) => {
    const [ano, mes, dia] = data.split("-");
    const date = new Date(ano, mes - 1, dia);

    return new Intl.DateTimeFormat("en-us", {
      weekday: isShort == true ? "short" : "long",
    }).format(date);
  });
}

function formatHour(dateString) {
  const date = new Date(dateString);
  const hours = date.getHours();

  const suffix = hours < 12 ? "Am" : "Pm";

  const formattedHours = hours.toString().padStart(1, "0");

  return `${formattedHours} ${suffix}`;
}

function horaTimezone(timezone) {
  const agora = new Date().toLocaleString("en-US", { timeZone: timezone });
  const hora = new Date(agora).getHours();
  return hora;
}

function getWeatherIcon(code) {
  // Céu limpo / poucas nuvens
  if (code === 0) return "icon-sunny.webp";
  if (code === 1 || code === 2) return "icon-partly-cloudy.webp";
  if (code === 3) return "icon-overcast.webp";

  // Nevoeiro
  if (code === 45 || code === 48) return "icon-fog.webp";

  // Garoa
  if (code >= 51 && code <= 57) return "icon-drizzle.webp";

  // Chuva
  if (code >= 61 && code <= 67) return "icon-rain.webp";
  if (code >= 80 && code <= 82) return "icon-rain.webp";

  // Neve
  if (code >= 71 && code <= 77) return "icon-snow.webp";

  // Tempestade
  if (code >= 95 && code <= 99) return "icon-storm.webp";

  // Fallback
  return "icon-overcast.webp";
}

function showResults(arrayResults) {
  results.innerHTML = "";

  arrayResults.forEach((result, i) => {
    const divResult = document.createElement("div");
    divResult.className = "div-result";

    const flagImg = document.createElement("img");
    flagImg.src = `https://flagcdn.com/24x18/${result.country_code.toLowerCase()}.png`;
    flagImg.alt = `${result.country} flag`;
    flagImg.style.marginRight = "8px";

    const cityAndCountry = document.createElement("p");
    cityAndCountry.id = i;
    cityAndCountry.textContent = `${result.name} - ${result.admin1}`;

    divResult.appendChild(flagImg);
    divResult.appendChild(cityAndCountry);

    results.appendChild(divResult);

    divResult.addEventListener("click", (evt) => {
      const chosenPlace = arrayResults[evt.target.children[1].id];

      const lat = chosenPlace.latitude;
      const long = chosenPlace.longitude;

      cache.latitudeValue = chosenPlace.latitude;
      cache.longitudeValue = chosenPlace.longitude;

      searchForWeather(
        lat,
        long,
        cache.temperature,
        cache.windSpeed,
        cache.precipitation,
      );

      locate.textContent = `${chosenPlace.name}, ${chosenPlace.country}`;

      const stringcurrentDate = getTodayBYCountry(chosenPlace.timezone);
      currentDate.textContent = stringcurrentDate;

      chosenDay.textContent = stringcurrentDate.split(",")[0];

      inputText.value = "";
      results.innerHTML = "";
    });
  });

  results.style.display = "flex";
}

function selectDay() {}

async function getCity(lat, long) {
  const response = await fetch(
    `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${long}&format=json`,
  );
  const data = await response.json();

  return `${data.address.city || data.address.town || data.address.village}, ${data.address.country}`;
}

if ("geolocation" in navigator) {
  navigator.geolocation.getCurrentPosition(async (position) => {
    const currentLat = position.coords.latitude;
    const currentLong = position.coords.longitude;

    cache.latitudeValue = position.coords.latitude;
    cache.longitudeValue = position.coords.longitude;

    const currentCity = await getCity(currentLat, currentLong);
    locate.textContent = currentCity;
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    currentDate.textContent = getTodayBYCountry(timezone);
    chosenDay.textContent = getTodayBYCountry(timezone).split(",")[0];
    searchForWeather(
      currentLat,
      currentLong,
      cache.temperature,
      cache.windSpeed,
      cache.precipitation,
    );
  });
}

//Traduzir
//Usar teclado e search
//Alt das imagens
//Imagens dia e noite
//Layout mobile
//descolar scrollbar
//Undefined em nome de país