export const NAKSHATRAS = [
  "Ashvini", "Bharani", "Krittika", "Rohini", "Mrigashirsha", "Ardra",
  "Punarvasu", "Pushya", "Ashlesha", "Magha", "Purva Phalguni", "Uttara Phalguni",
  "Hasta", "Chitra", "Swati", "Vishakha", "Anuradha", "Jyeshtha",
  "Mula", "Purva Ashadha", "Uttara Ashadha", "Shravana", "Dhanishta", "Shatabhisha",
  "Purva Bhadrapada", "Uttara Bhadrapada", "Revati"
];

export const TITHIS = [
  "Pratipada", "Dwitiya", "Tritiya", "Chaturthi", "Panchami", "Shashthi", 
  "Saptami", "Ashtami", "Navami", "Dashami", "Ekadashi", "Dwadashi", 
  "Trayodashi", "Chaturdashi", "Purnima", "Pratipada", "Dwitiya", 
  "Tritiya", "Chaturthi", "Panchami", "Shashthi", "Saptami", "Ashtami", 
  "Navami", "Dashami", "Ekadashi", "Dwadashi", "Trayodashi", "Chaturdashi", "Amavasya"
];

export function getNakshatra(moon: number) {
  return Math.floor(moon / (360 / 27)) + 1;
}

export function getPada(moon: number) {
  return Math.floor((moon % (360 / 27)) / (360 / 108)) + 1;
}

export function calculatePanchang(sunLon: number, moonLon: number) {
  const nakshatraIndex = Math.floor(moonLon / (360 / 27));
  const pada = Math.floor((moonLon % (360 / 27)) / (360 / 108)) + 1;
  
  let diff = moonLon - sunLon;
  if (diff < 0) diff += 360;
  
  const tithiIndex = Math.floor(diff / 12);
  const paksha = tithiIndex < 15 ? "Shukla" : "Krishna";
  
  return {
    nakshatra: `${NAKSHATRAS[nakshatraIndex]} (Pada ${pada})`,
    tithi: `${TITHIS[tithiIndex]} (${paksha})`,
    karana: `Karana ${Math.floor(diff / 6) + 1}`,
    yoga: `Yoga ${Math.floor(((moonLon + sunLon) % 360) / (360 / 27)) + 1}`
  };
}