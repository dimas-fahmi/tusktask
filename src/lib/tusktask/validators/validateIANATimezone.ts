import React from "react";
import { IANA_TIMEZONES } from "../constants/timezones";

const validateIANATimezone = (timezone: string): boolean => {
  if (IANA_TIMEZONES.includes(timezone)) {
    return true;
  }

  return false;
};

export default validateIANATimezone;
