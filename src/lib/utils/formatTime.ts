import { Duration } from "luxon";

/**
 * Converts milliseconds to HH:MM:SS or MM:SS format using Luxon's Duration object.
 * @param ms The duration in milliseconds.
 * @returns A formatted duration string.
 */
export const formatDurationLuxon = (
  ms: number,
  formatToken?: string,
): string => {
  const duration = Duration.fromMillis(ms);

  // If the duration is an hour or more, use 'h:mm:ss'.
  // Otherwise, use 'm:ss'.
  const formatToken_ = duration.as("hours") >= 1 ? "h:mm:ss" : "m:ss";

  // toLocaleString with the 'format' token ensures proper padding and display
  return duration.toFormat(formatToken ?? formatToken_);
};

export const formatMinuteToMillis = (minutes: number): number => {
  return minutes * 60000;
};
