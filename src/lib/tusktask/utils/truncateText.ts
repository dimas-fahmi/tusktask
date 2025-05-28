export const truncateText = (
  text: string,
  word: number,
  ellipsis: boolean = true
): string => {
  const words = text.split(/\s+/);
  if (words.length <= word) return text;
  const truncated = words.slice(0, word).join(" ");
  return ellipsis ? `${truncated}...` : truncated;
};
