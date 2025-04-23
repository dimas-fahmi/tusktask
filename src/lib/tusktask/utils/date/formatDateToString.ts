export function formatDateToString(date: Date | null | undefined): string {
  if (!date) return "";
  const regulated = new Date(date);

  const day = String(regulated.getDate()).padStart(2, "0");
  const monthNames = [
    "JAN",
    "FEB",
    "MAR",
    "APR",
    "MAY",
    "JUN",
    "JUL",
    "AUG",
    "SEP",
    "OCT",
    "NOV",
    "DEC",
  ];
  const month = monthNames[regulated.getMonth()];
  const year = regulated.getFullYear();

  return `${day}-${month}-${year}`;
}
