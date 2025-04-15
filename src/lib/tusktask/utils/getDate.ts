export const getMonths = (): string[] => {
  return [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
};

export const getDaysInMonths = (
  monthName?: string,
  year?: string
): string[] => {
  const initialDays = new Array(31).fill(1).map((_, i) => String(i + 1));
  if (!monthName || !year) {
    return initialDays;
  }

  const monthIndex = getMonths().findIndex(
    (m) => m.toLowerCase() === monthName.toLowerCase()
  );

  if (monthIndex === -1) {
    console.log("invalid");
    return initialDays;
  }

  const daysInMonth = new Date(parseInt(year), monthIndex + 1, 0).getDate();
  return Array.from({ length: daysInMonth }, (_, i) => String(i + 1));
};

export const getYears = (range = 100): string[] => {
  const currentYear = new Date().getFullYear();
  return new Array(range).fill(0).map((_, i) => String(currentYear - i));
};
