// utils/timeDistance.ts

export function timeDistanceFromNow(targetDate: Date): string {
  const now = new Date();

  if (typeof targetDate === "string") {
    targetDate = new Date(targetDate);

    if (isNaN(targetDate.getTime())) {
      return "invalid";
    }
  }

  const diffMs = targetDate.getTime() - now.getTime();
  const isFuture = diffMs >= 0;
  const absDiffMs = Math.abs(diffMs);

  const minutes = Math.floor(absDiffMs / (1000 * 60));
  const hours = Math.floor(absDiffMs / (1000 * 60 * 60));
  const days = Math.floor(absDiffMs / (1000 * 60 * 60 * 24));
  const weeks = Math.floor(days / 7);

  let value: number;
  let unit: string;

  if (weeks >= 1) {
    value = weeks;
    unit = "w";
  } else if (days >= 1) {
    value = days;
    unit = "d";
  } else if (hours >= 1) {
    value = hours;
    unit = "h";
  } else {
    value = minutes;
    unit = "m";
  }

  const suffix = isFuture ? "left" : "passed";
  return `${value}${unit} ${suffix}`;
}
