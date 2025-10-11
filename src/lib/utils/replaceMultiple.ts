/**
 * Interface for replacement rule object
 */
interface ReplacementRule {
  replace: string;
  to: string;
}

/**
 * Type for array of replacement rules
 */
type ReplacementRules = ReplacementRule[];

/**
 * Replaces multiple substrings in a string based on an array of replacement rules
 *
 * @param str - The string to process (can be undefined)
 * @param rules - Array of replacement rules containing 'replace' and 'to' properties
 * @param caseSensitive - Whether replacements should be case-sensitive (default: false)
 * @returns The processed string with all replacements applied, or empty string if input is undefined
 *
 * @example
 * const rules: ReplacementRules = [
 *   { replace: "tomorrow", to: "besok" },
 *   { replace: "midnight", to: "tengah malam" }
 * ];
 *
 * const result = replaceMultiple("See you tomorrow at midnight", rules);
 * // Returns: "See you besok at tengah malam"
 *
 * const result2 = replaceMultiple("See you TOMORROW at midnight", rules, true);
 * // Returns: "See you TOMORROW at tengah malam" (TOMORROW not replaced due to case sensitivity)
 */
function replaceMultiple(
  str: string | undefined,
  rules: ReplacementRules,
  caseSensitive: boolean = false
): string {
  // Handle undefined or null string
  if (!str) {
    return "";
  }

  // Handle empty rules array
  if (!rules || rules.length === 0) {
    return str;
  }

  // Apply all replacement rules sequentially
  let result = str;

  for (const rule of rules) {
    // Skip invalid rules
    if (!rule.replace || rule.to === undefined) {
      continue;
    }

    // Use global regex with optional case-insensitive flag
    const flags = caseSensitive ? "g" : "gi";
    const regex = new RegExp(escapeRegExp(rule.replace), flags);
    result = result.replace(regex, rule.to);
  }

  return result;
}

/**
 * Escapes special regex characters in a string
 * @param str - String to escape
 * @returns Escaped string safe for use in RegExp
 */
function escapeRegExp(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Export the function and types
export { replaceMultiple, type ReplacementRule, type ReplacementRules };
