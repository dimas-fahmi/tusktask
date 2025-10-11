import { ReplacementRules } from "../../utils/replaceMultiple";

export const NLP_INDONESIAN_RULE: ReplacementRules = [
  // 🔹 Time-related words
  { replace: "tengah malam", to: "midnight" },
  { replace: "jam", to: "at" },
  { replace: "pagi", to: "morning" },
  { replace: "siang", to: "noon" },
  { replace: "sore", to: "evening" },
  { replace: "malam", to: "night" },
  { replace: "hari", to: "day" },
  { replace: "menit", to: "minute" },

  // 🔹 Relative days
  { replace: "hari ini", to: "today" },
  { replace: "besok", to: "tomorrow" },
  { replace: "lusa", to: "1 day after tomorrow" },
  { replace: "kemarin lusa", to: "day before yesterday" },
  { replace: "kemarin", to: "yesterday" },

  // 🔹 Weeks & months
  { replace: "minggu depan", to: "next week" },
  { replace: "minggu lalu", to: "last week" },
  { replace: "bulan depan", to: "next month" },
  { replace: "bulan lalu", to: "last month" },
  { replace: "tahun depan", to: "next year" },
  { replace: "tahun lalu", to: "last year" },

  // 🔹 Days of the week
  { replace: "senin", to: "monday" },
  { replace: "selasa", to: "tuesday" },
  { replace: "rabu", to: "wednesday" },
  { replace: "kamis", to: "thursday" },
  { replace: "jumat", to: "friday" },
  { replace: "sabtu", to: "saturday" },
  { replace: "minggu", to: "sunday" },

  // 🔹 Time modifiers
  { replace: "sekarang", to: "now" },
  { replace: "nanti", to: "later" },
  { replace: "tadi", to: "earlier" },

  // 🔹 Months
  { replace: "januari", to: "january" },
  { replace: "februari", to: "february" },
  { replace: "maret", to: "march" },
  { replace: "april", to: "april" },
  { replace: "mei", to: "may" },
  { replace: "juni", to: "june" },
  { replace: "juli", to: "july" },
  { replace: "agustus", to: "august" },
  { replace: "september", to: "september" },
  { replace: "oktober", to: "october" },
  { replace: "november", to: "november" },
  { replace: "desember", to: "december" },

  // 🔹 Commands
  { replace: "dari", to: "from" },
];
