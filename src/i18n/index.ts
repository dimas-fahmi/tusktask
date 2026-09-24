export const SUPPORTED_LOCALES = ["en", "id"] as const;

export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];

export const DEFAULT_LOCALE: SupportedLocale = "en";

export function isSupportedLocale(locale?: unknown): locale is SupportedLocale {
  if (!locale || typeof locale !== "string") {
    return false;
  }

  return SUPPORTED_LOCALES.includes(locale as SupportedLocale);
}

export function getDefaultLocale(locale?: unknown): SupportedLocale {
  return isSupportedLocale(locale) ? locale : DEFAULT_LOCALE;
}

export function getLocaleFromPathname(
  pathname: string,
): SupportedLocale | undefined {
  const segments = pathname.split("/").filter(Boolean);
  const firstSegment = segments[0];
  return isSupportedLocale(firstSegment) ? firstSegment : undefined;
}

export function stripLocaleFromPathname(pathname: string): string {
  const segments = pathname.split("/").filter(Boolean);
  const firstSegment = segments[0];

  return isSupportedLocale(firstSegment)
    ? `/${segments.slice(1).join("/")}`
    : pathname;
}
