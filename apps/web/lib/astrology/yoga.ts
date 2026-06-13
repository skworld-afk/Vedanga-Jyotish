export function getYoga(moon: number, sun: number) {
  const total = (moon + sun) % 360;
  return Math.floor(total / (360 / 27)) + 1;
}