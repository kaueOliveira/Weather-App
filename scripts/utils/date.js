export function formatHour(dateString) {
  const date = new Date(dateString);
  const hours = date.getHours();

  const formattedHours = hours.toString().padStart(1, "0");

  return `${formattedHours}h`;
}

export function next7Days(datas, isShort, languageFormat) {
  return datas.map((data) => {
    const [ano, mes, dia] = data.split("-");
    const date = new Date(ano, mes - 1, dia);

    return new Intl.DateTimeFormat(languageFormat, {
      weekday: isShort == true ? "short" : "long",
    }).format(date);
  });
}

//getTodayBYCountry
export function getCurrentDateInTimezone(timeZone, languageFormat) {
  return new Intl.DateTimeFormat(languageFormat, {
    timeZone,
    weekday: "long",
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date());
}

//horaTimezone
export function getCurrentHourInTimezone(timezone) {
  const agora = new Date().toLocaleString("en-US", { timeZone: timezone });
  const hora = new Date(agora).getHours();
  return hora;
}