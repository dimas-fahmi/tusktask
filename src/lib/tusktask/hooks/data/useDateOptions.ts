import { useMemo } from "react";
import { getDaysInMonths, getMonths, getYears } from "../../utils/getDate";

const useDateOptions = (month?: string, year?: string) => {
  const days = useMemo(() => getDaysInMonths(month, year), [month, year]);
  const months = useMemo(() => getMonths(), []);
  const years = useMemo(() => getYears(), []);
  return { days, months, years };
};

export default useDateOptions;
