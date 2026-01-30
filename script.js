let lat;
let long;

// const daysOfTheWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

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

const forecastHourly = document.querySelectorAll(".div-hour");

async function searchForWeather() {
  const urlWeather = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&current_weather=true&hourly=apparent_temperature,relative_humidity_2m,precipitation,weathercode&daily=temperature_2m_min,temperature_2m_max,weathercode&timezone=auto`;
  try {
    const weatherResponse = await fetch(urlWeather);
    const weatherData = await weatherResponse.json();

    const feelsLike = weatherData.hourly.apparent_temperature[0];
    const humidity = weatherData.hourly.relative_humidity_2m[0];
    const windSpeed = weatherData.current_weather.windspeed;
    const precipitation = weatherData.hourly.precipitation[0];
    const temperature = weatherData.current_weather.temperature;

    currentWeatherIcon.src = `assets/images/${getWeatherIcon(
      weatherData.current_weather.weathercode,
    )}`;
    currentTemperature.textContent = `${Math.round(temperature)}°`;

    currentFeelsLike.textContent = `${Math.round(feelsLike)}°`;
    currentHumidity.textContent = `${Math.round(humidity)}%`;
    currentWindSpeed.textContent = `${Math.round(windSpeed)} km/h`;
    currentPrecipitation.textContent = `${Math.round(precipitation)} mm`;

    forecastDays.forEach((day, i) => {
      day.querySelector(".current-day").textContent = next7Days(
        weatherData.daily.time,
      )[i];

      day.querySelector(".current-day-image").src =
        `assets/images/${getWeatherIcon(weatherData.daily.weathercode[i])}`;

      day.querySelector(".temperature-min").textContent = `${Math.round(
        weatherData.daily.temperature_2m_min[i],
      )}°`;

      day.querySelector(".temperature-max").textContent = `${Math.round(
        weatherData.daily.temperature_2m_max[i],
      )}°`;
    });
    
    forecastHourly.forEach((divHour, i) => {
      divHour.querySelector(".hour").textContent = formatHour(
        weatherData.hourly.time[i],
      );

      divHour.querySelector(".time-temperature").innerHTML =
        `${Math.round(weatherData.hourly.apparent_temperature[i])}°`;

      divHour.querySelector(".hour-image").src =
        `assets/images/${getWeatherIcon(weatherData.hourly.weathercode[i])}`;
    });
  } catch (error) {
    console.log("Erro");
  }
}

async function searchForPlace(name) {
  const locationName = name;

  const urlLocation = `https://geocoding-api.open-meteo.com/v1/search?name=${locationName}&count=1&language=us&format=json`;

  try {
    const locationResponse = await fetch(urlLocation);
    const locationData = await locationResponse.json();

    lat = locationData.results[0].latitude;
    long = locationData.results[0].longitude;

    const country = locationData.results[0].country;

    const stringcurrentDate = getTodayBYCountry(
      locationData.results[0].timezone,
    );
    locate.textContent = `${name}, ${country}`;
    currentDate.textContent = stringcurrentDate;

    chosenDay.textContent = stringcurrentDate.split(",")[0];

    searchForWeather();
  } catch (error) {
    console.log("Erro");
  }
}

searchForPlace("paris");

function getTodayBYCountry(timeZone) {
  return new Intl.DateTimeFormat("en-us", {
    timeZone,
    weekday: "long",
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date());
}

function next7Days(datas) {
  return datas.map((data) => {
    const [ano, mes, dia] = data.split("-");
    const date = new Date(ano, mes - 1, dia);

    return new Intl.DateTimeFormat("en-us", {
      weekday: "short",
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
