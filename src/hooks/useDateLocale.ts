import type { Locale } from "date-fns";
import { enUS } from "date-fns/locale/en-US";
import { id } from "date-fns/locale/id";
import { useLocale } from "next-intl";
import type { SupportedLocale } from "../i18n";

export const DATE_LOCALE = {
  en: enUS,
  id: id,
} as const satisfies Record<SupportedLocale, Locale>;

export const useDateLocale = () => {
  const locale = useLocale();
  return DATE_LOCALE[locale];
};
