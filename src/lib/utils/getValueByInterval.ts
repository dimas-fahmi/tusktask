export function getValueByInterval<T>(
  interval: number,
  current: number,
  arr: T[],
): T {
  return arr[current % interval];
}
