export async function geocodePlace(
  placeName: string
) {
  const response = await fetch(
    `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
      placeName
    )}`,
    {
      headers: {
        "User-Agent": "AstroSaaS/1.0",
      },
    }
  );

  if (!response.ok) {
    throw new Error(
      "Failed to geocode location"
    );
  }

  const results = await response.json();

  if (!results.length) {
    throw new Error(
      `Location not found: ${placeName}`
    );
  }

  return {
    latitude: Number(results[0].lat),
    longitude: Number(results[0].lon),
    placeName:
      results[0].display_name,
  };
}