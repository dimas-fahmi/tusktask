export function truncateText(
  text: string,
  wordLimit: number,
  addEllipsis: boolean
): string {
  const words = text.split(" ");
  if (words.length <= wordLimit) {
    return text;
  }
  const truncated = words.slice(0, wordLimit).join(" ");
  return addEllipsis ? `${truncated}...` : truncated;
}
