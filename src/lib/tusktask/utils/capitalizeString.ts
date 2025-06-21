export function capitalizeString(input: string): string {
  return input.replace(/\b\w/g, (char) => char.toUpperCase());
}
