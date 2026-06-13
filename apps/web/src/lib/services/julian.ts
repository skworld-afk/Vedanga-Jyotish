export function calculateJulianDay(
  birthDate: string,
  birthTime: string,
  utcOffset: number
) {
  const date = new Date(
    `${birthDate}T${birthTime}`
  );

  return (
    date.getTime() / 86400000 +
    2440587.5 -
    utcOffset / 86400
  );
}