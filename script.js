let lat;
let long;

async function searchForWeather() {
  const urlWeather = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&current_weather=true&hourly=apparent_temperature,relative_humidity_2m,precipitation&timezone=auto&daily=temperature_2m_min,temperature_2m_max,weathercode`;

  try {
    const weatherResponse = await fetch(urlWeather);
    const weatherData = await weatherResponse.json();

    const feelsLike = weatherData.hourly.apparent_temperature[0];
    const humidity = weatherData.hourly.relative_humidity_2m[0];
    const precipitation = weatherData.hourly.precipitation[0];
    const windSpeed = weatherData.current_weather.windspeed;
    const temperature = weatherData.current_weather.temperature;

    console.log(feelsLike, humidity, precipitation, windSpeed, temperature);
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

    searchForWeather();
  } catch (error) {
    console.log("Erro");
  }
}

searchForPlace("rio de janeiro");
