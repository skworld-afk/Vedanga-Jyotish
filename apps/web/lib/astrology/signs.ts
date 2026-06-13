export const SIGNS = [
  "Aries",
  "Taurus",
  "Gemini",
  "Cancer",
  "Leo",
  "Virgo",
  "Libra",
  "Scorpio",
  "Sagittarius",
  "Capricorn",
  "Aquarius",
  "Pisces",
];

export function getRashi(
  longitude: number
) {
  const index =
    Math.floor(longitude / 30);

  return {
    index,
    sign: SIGNS[index],
    degree:
      longitude % 30,
  };
}