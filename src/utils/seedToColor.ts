export function seedToColor(seed: number) {
  const hue = (seed * 137.508) % 360;
  return `hsl(${hue}, 70%, 55%)`;
}
