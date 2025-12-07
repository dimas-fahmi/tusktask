/**
 * Truncates a string based on a word limit and optionally adds an ellipsis.
 *
 * @param {string} input - The string to truncate.
 * @param {number} wordLimit - The maximum number of words to include in the truncated string.
 * @param {boolean} addEllipsis - Whether or not to append ellipsis ('...') to the truncated string.
 * @returns {string} - The truncated string, optionally followed by ellipsis.
 *
 * @example
 * const result = truncateString("This is a simple example sentence for truncation.", 5, true);
 * console.log(result); // "This is a simple example..."
 */
export function truncateString(
  input: string,
  wordLimit: number,
  addEllipsis: boolean,
): string {
  if (!input) return "";

  // Split the input string into words
  const words = input.split(/\s+/);

  // If the number of words is less than or equal to the wordLimit, return the string as is
  if (words.length <= wordLimit) {
    return input;
  }

  // Otherwise, slice the array of words to the limit and join them back into a string
  const truncated = words.slice(0, wordLimit).join(" ");

  // Add ellipsis if required
  return addEllipsis ? `${truncated}...` : truncated;
}
