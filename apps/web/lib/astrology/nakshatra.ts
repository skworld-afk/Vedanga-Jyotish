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

export const YOGAS = [
  "Vishkambha", "Priti", "Ayushman", "Saubhagya", "Shobhana", "Atiganda",
  "Sukarma", "Dhriti", "Shula", "Ganda", "Vriddhi", "Dhruva", "Vyaghata",
  "Harshana", "Vajra", "Siddhi", "Vyatipata", "Variyan", "Parigha", "Shiva",
  "Siddha", "Sadhya", "Shubha", "Shukla", "Brahma", "Indra", "Vaidhriti"
];

export const KARANAS = [
  "Bava", "Balava", "Kaulava", "Taitila", "Gara", "Vanija", "Vishti",
  "Shakuni", "Chatushpada", "Naga", "Kimstughna"
];

export function getKaranaName(karanaNumber: number): string {
  if (karanaNumber === 1) return "Kimstughna";
  if (karanaNumber === 58) return "Shakuni";
  if (karanaNumber === 59) return "Chatushpada";
  if (karanaNumber === 60) return "Naga";
  return KARANAS[(karanaNumber - 2) % 7] || "Unknown";
}

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
  
  const karanaNumber = Math.floor(diff / 6) + 1;
  const yogaIndex = Math.floor(((moonLon + sunLon) % 360) / (360 / 27));

  return {
    nakshatra: `${NAKSHATRAS[nakshatraIndex]} (Pada ${pada})`,
    tithi: `${TITHIS[tithiIndex]} (${paksha})`,
    karana: getKaranaName(karanaNumber),
    yoga: YOGAS[yogaIndex] || `Yoga ${yogaIndex + 1}`
  };
}