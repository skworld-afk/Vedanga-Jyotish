import tzlookup from "tz-lookup";

export async function getHistoricalTimezone(
  latitude: number,
  longitude: number
) {
  const timezoneId =
    tzlookup(latitude, longitude);

  const offsetMinutes =
    -new Date().getTimezoneOffset();

  return {
    timezoneId,
    utcOffset:
      offsetMinutes * 60,
  };
}