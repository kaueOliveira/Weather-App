export function getWeatherIcon(code, isDay) {
  // Céu limpo / poucas nuvens
  if (code === 0) return isDay === 1 ? "icon-sunny.webp" : "icon-moon.webp";
  if (code === 1 || code === 2) return isDay === 1 ? "icon-partly-cloudy.webp" : "partly-cloudy-moon.webp";
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