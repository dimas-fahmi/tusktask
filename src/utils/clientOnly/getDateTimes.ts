type DateTimes = {
  today: Date;
  tomorrow: Date;
  weekend: Date;
  nextWeek: Date;
};

export function getDateTimes(date: Date = new Date()): DateTimes {
  const today = new Date(date);

  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const weekend = new Date(today);
  weekend.setDate(today.getDate() + ((6 - today.getDay() + 7) % 7));

  const nextWeek = new Date(today);
  nextWeek.setDate(today.getDate() + 7);

  return {
    today,
    tomorrow,
    weekend,
    nextWeek,
  };
}
