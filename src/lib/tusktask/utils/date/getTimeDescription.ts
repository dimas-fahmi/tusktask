export function getTimeDescription(
  date: Date | string | null | undefined
): string {
  if (!date) return "";

  const now = new Date();
  const target = typeof date === "string" ? new Date(date) : date;
  if (isNaN(target.getTime())) return ""; // invalid date

  const diffMs = target.getTime() - now.getTime(); // positive if in future
  const diffAbs = Math.abs(diffMs);

  const seconds = Math.floor(diffAbs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30.44); // avg month
  const years = Math.floor(days / 365.25); // avg year

  const isFuture = diffMs > 0;

  if (diffAbs < 30 * 1000) return "happening";
  if (seconds < 60)
    return isFuture
      ? `in ${seconds} second${seconds > 1 ? "s" : ""}`
      : `${seconds} second${seconds > 1 ? "s" : ""} ago`;
  if (minutes < 60)
    return isFuture
      ? `in ${minutes} minute${minutes > 1 ? "s" : ""}`
      : `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  if (hours < 24)
    return isFuture
      ? `in ${hours} hour${hours > 1 ? "s" : ""}`
      : `${hours} hour${hours > 1 ? "s" : ""} ago`;

  if (days === 1) return isFuture ? "tomorrow" : "yesterday";
  if (days < 30)
    return isFuture
      ? `in ${days} day${days > 1 ? "s" : ""}`
      : `${days} day${days > 1 ? "s" : ""} ago`;
  if (months < 12)
    return isFuture
      ? `in ${months} month${months > 1 ? "s" : ""}`
      : `${months} month${months > 1 ? "s" : ""} ago`;

  return isFuture
    ? `in ${years} year${years > 1 ? "s" : ""}`
    : `${years} year${years > 1 ? "s" : ""} ago`;
}
