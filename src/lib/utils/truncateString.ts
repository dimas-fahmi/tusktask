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

/**
 * Truncates a string based on a character limit and optionally adds an ellipsis.
 *
 * @param {string} input - The string to truncate.
 * @param {number} charLimit - The maximum number of characters to keep.
 * @param {boolean} addEllipsis - Whether or not to append ellipsis ('...') to the truncated string.
 * @returns {string} - The truncated string, optionally followed by ellipsis.
 *
 * @example
 * const result = truncateByChar("This is a long sentence.", 10, true);
 * console.log(result); // "This is a ..."
 */
export function truncateStringByChar(
  input: string,
  charLimit: number,
  addEllipsis: boolean,
): string {
  if (!input) return "";

  // If the input length is within the limit, return it as is
  if (input.length <= charLimit) {
    return input;
  }

  // Slice the string to the specific character limit
  const truncated = input.slice(0, charLimit);

  // Add ellipsis if required
  return addEllipsis ? `${truncated}...` : truncated;
}
