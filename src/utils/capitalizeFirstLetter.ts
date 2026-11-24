export function capitalizeFirstLetter(text: string): string {
  return `${text.at(-0)?.toUpperCase()}${text.slice(1)}`;
}
