export function getTithi(moon: number, sun: number) {
  let diff = moon - sun;

  if (diff < 0) {
    diff += 360;
  }

  return Math.floor(diff / 12) + 1;
}