/**
 * Converts a size in bytes into a human-readable string format.
 * @param bytes - The number of bytes to format
 * @param decimals - Number of decimal places to include (defaults to 1)
 */
export const formatBytes = (bytes: number, decimals: number = 1): string => {
  if (bytes < 0) return "0 B";
  if (bytes === 0) return "0 B";

  // Define the sizes and their corresponding suffixes
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["B", "KB", "MB", "GB", "TB", "PB"];

  // Determine which unit bucket the bytes fit into
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  // If the index exceeds our array, cap it at the highest unit
  const unitIndex = Math.min(i, sizes.length - 1);

  // Calculate the value and parse it to remove trailing zeros if they are flat integers
  const formattedValue = parseFloat((bytes / k ** unitIndex).toFixed(dm));

  return `${formattedValue} ${sizes[unitIndex]}`;
};
