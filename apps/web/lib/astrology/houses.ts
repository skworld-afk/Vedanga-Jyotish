export function getHouse(
  ascendant: number,
  longitude: number
) {
  let diff =
    longitude - ascendant;

  while (diff < 0)
    diff += 360;

  return (
    Math.floor(diff / 30) + 1
  );
}

export function getAllHouses(
  ascendant: number,
  planets: Record<
    string,
    number
  >
) {
  const result: Record<
    string,
    number
  > = {};

  for (const [
    planet,
    longitude,
  ] of Object.entries(
    planets
  )) {
    result[planet] =
      getHouse(
        ascendant,
        longitude
      );
  }

  return result;
}