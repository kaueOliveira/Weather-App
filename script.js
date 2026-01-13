let lat;
let long;

const currentDate = document.getElementById("current-date");
const locate = document.getElementById("city-name");
const currentTemperature = document.getElementById("temperature");
const currentWeatherIcon = document.getElementById("current-weather-icon");

async function searchForWeather() {
  const urlWeather = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&current_weather=true&hourly=apparent_temperature,relative_humidity_2m,precipitation&timezone=auto&daily=temperature_2m_min,temperature_2m_max,weathercode`;

  try {
    const weatherResponse = await fetch(urlWeather);
    const weatherData = await weatherResponse.json();

    console.log();

    const feelsLike = weatherData.hourly.apparent_temperature[0];
    const humidity = weatherData.hourly.relative_humidity_2m[0];
    const precipitation = weatherData.hourly.precipitation[0];
    const windSpeed = weatherData.current_weather.windspeed;
    const temperature = weatherData.current_weather.temperature;

    currentWeatherIcon.src = `assets/images/${getWeatherIcon(
      weatherData.daily.weathercode[0]
    )}`;
    currentTemperature.textContent = `${Math.round(temperature)}°`;
    
  } catch (error) {
    console.log("Erro");
  }
}

async function searchForPlace(name) {
  const locationName = name;

  const urlLocation = `https://geocoding-api.open-meteo.com/v1/search?name=${locationName}&count=1&language=pt&format=json`;

  try {
    const locationResponse = await fetch(urlLocation);
    const locationData = await locationResponse.json();

    lat = locationData.results[0].latitude;
    long = locationData.results[0].longitude;

    const country = locationData.results[0].country;

    locate.textContent = `${name}, ${country}`;
    currentDate.textContent = getTodayBYCountry(
      locationData.results[0].timezone
    );

    searchForWeather();
  } catch (error) {
    console.log("Erro");
  }
}

searchForPlace("São Luis");

function getTodayBYCountry(timeZone) {
  return new Intl.DateTimeFormat("en-us", {
    timeZone,
    weekday: "long",
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date());
}

function getWeatherIcon(code) {
  // Céu limpo / poucas nuvens
  if (code === 0) return "icon-sunny.webp";
  if (code === 1 || code === 2) return "icon-partly-cloundy.webp";
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
