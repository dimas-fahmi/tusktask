import {
  type NextFetchEvent,
  type NextRequest,
  NextResponse,
} from "next/server";
import { COOKIES } from "@/src/app/cookies";
import { SEARCH_PARAMS } from "@/src/app/searchParams";
import {
  DEFAULT_LOCALE,
  getLocaleFromPathname,
  isSupportedLocale,
  stripLocaleFromPathname,
} from "@/src/i18n";
import type { CustomMiddleware } from "../chain";

export function withlocale(middleware: CustomMiddleware): CustomMiddleware {
  return async (
    request: NextRequest,
    event: NextFetchEvent,
    response: NextResponse,
  ) => {
    const { cookies, nextUrl } = request;

    const stored = cookies.get(COOKIES.i18n.locale_pref)?.value;
    const isStoredValid = isSupportedLocale(stored);

    const urlLocale = getLocaleFromPathname(nextUrl.pathname);
    const isUrlValid = isSupportedLocale(urlLocale);

    const changeLocale = SEARCH_PARAMS.i18n.change_locale.validate(
      nextUrl.searchParams.get(SEARCH_PARAMS.i18n.change_locale.key),
    );

    if (changeLocale && urlLocale !== changeLocale) {
      nextUrl.pathname = `/${changeLocale}${stripLocaleFromPathname(nextUrl.pathname)}`;

      nextUrl.searchParams.delete(SEARCH_PARAMS.i18n.change_locale.key);

      const response = NextResponse.redirect(nextUrl);

      response.cookies.set(COOKIES.i18n.locale_pref, changeLocale);

      return response;
    }

    if (!isUrlValid) {
      const locale = isStoredValid ? stored : DEFAULT_LOCALE;

      nextUrl.pathname = `/${locale}${nextUrl.pathname}`;

      if (!isStoredValid) {
        nextUrl.searchParams.append(SEARCH_PARAMS.i18n.no_locale_pref.key, "1");
      }

      const response = NextResponse.redirect(nextUrl);
      response.cookies.set(COOKIES.i18n.locale_pref, locale, {
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365), // 1 year
      });

      return response;
    } else {
      const missmatch = nextUrl.searchParams.get(
        SEARCH_PARAMS.i18n.locale_missmatch.key,
      );

      if (isStoredValid && stored !== urlLocale && !missmatch) {
        nextUrl.searchParams.append(
          SEARCH_PARAMS.i18n.locale_missmatch.key,
          SEARCH_PARAMS.i18n.locale_missmatch.construct(urlLocale, stored),
        );
        const response = NextResponse.redirect(nextUrl);
        return response;
      }
    }

    return middleware(request, event, response);
  };
}
