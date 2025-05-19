export interface CountryTimezone {
  country: string;
  countryId: string;
  timezone: string;
  offset: string;
}

export const COUNTRY_TIMEZONES: CountryTimezone[] = [
  {
    country: "United States",
    countryId: "US",
    timezone: "America/New_York",
    offset: "UTC-05:00",
  },
  {
    country: "United Kingdom",
    countryId: "GB",
    timezone: "Europe/London",
    offset: "UTC+00:00",
  },
  {
    country: "India",
    countryId: "IN",
    timezone: "Asia/Kolkata",
    offset: "UTC+05:30",
  },
  {
    country: "Australia",
    countryId: "AU",
    timezone: "Australia/Sydney",
    offset: "UTC+10:00",
  },
  {
    country: "Japan",
    countryId: "JP",
    timezone: "Asia/Tokyo",
    offset: "UTC+09:00",
  },
  {
    country: "Germany",
    countryId: "DE",
    timezone: "Europe/Berlin",
    offset: "UTC+01:00",
  },
  {
    country: "Brazil",
    countryId: "BR",
    timezone: "America/Sao_Paulo",
    offset: "UTC-03:00",
  },
  {
    country: "Russia",
    countryId: "RU",
    timezone: "Europe/Moscow",
    offset: "UTC+03:00",
  },
  {
    country: "China",
    countryId: "CN",
    timezone: "Asia/Shanghai",
    offset: "UTC+08:00",
  },
  {
    country: "South Africa",
    countryId: "ZA",
    timezone: "Africa/Johannesburg",
    offset: "UTC+02:00",
  },
  {
    country: "Canada",
    countryId: "CA",
    timezone: "America/Toronto",
    offset: "UTC-05:00",
  },
  {
    country: "France",
    countryId: "FR",
    timezone: "Europe/Paris",
    offset: "UTC+01:00",
  },
  {
    country: "Mexico",
    countryId: "MX",
    timezone: "America/Mexico_City",
    offset: "UTC-06:00",
  },
  {
    country: "Turkey",
    countryId: "TR",
    timezone: "Europe/Istanbul",
    offset: "UTC+03:00",
  },
  {
    country: "Saudi Arabia",
    countryId: "SA",
    timezone: "Asia/Riyadh",
    offset: "UTC+03:00",
  },
  {
    country: "Argentina",
    countryId: "AR",
    timezone: "America/Argentina/Buenos_Aires",
    offset: "UTC-03:00",
  },
  {
    country: "South Korea",
    countryId: "KR",
    timezone: "Asia/Seoul",
    offset: "UTC+09:00",
  },
  {
    country: "Egypt",
    countryId: "EG",
    timezone: "Africa/Cairo",
    offset: "UTC+02:00",
  },
  {
    country: "Indonesia",
    countryId: "ID",
    timezone: "Asia/Jakarta",
    offset: "UTC+07:00",
  },
  {
    country: "New Zealand",
    countryId: "NZ",
    timezone: "Pacific/Auckland",
    offset: "UTC+12:00",
  },
];

export const IANA_TIMEZONES: CountryTimezone["timezone"][] =
  COUNTRY_TIMEZONES.map((country) => country.timezone);
