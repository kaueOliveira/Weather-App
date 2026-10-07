import { cache } from "../state/cache.js";

export async function searchForPlace(locationName, languageFormat) {
  const urlLocation = `https://geocoding-api.open-meteo.com/v1/search?name=${locationName}&count=5&language=${languageFormat === "en-us" ? "en" : "pt"}&format=json`;

  try {
    const locationResponse = await fetch(urlLocation);
    return await locationResponse.json();
  } catch (error) {
    console.error("Erro ao buscar local", error);
    return null;
  }
}

export async function getCity(lat, long, languageFormat) {
  const response = await fetch(`http://localhost:3000/reverse?lat=${lat}&lon=${long}&lang=${languageFormat}`);
  const data = await response.json();
  return `${data.address.city || data.address.town || data.address.village}, ${data.address.country}`;
}