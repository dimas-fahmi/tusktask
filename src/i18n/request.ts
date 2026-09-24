import { cookies } from "next/headers";
import { getRequestConfig } from "next-intl/server";
import { COOKIES } from "../app/cookies";
import { getDefaultLocale } from ".";

export default getRequestConfig(async () => {
  const store = await cookies();
  const stored = store.get(COOKIES.i18n.locale_pref)?.value;
  const locale = getDefaultLocale(stored);

  return {
    locale,
    messages: {
      alert: {
        ...(await import(`./messages/${locale}/alert.json`)).default,
      },
      attribution: {
        ...(await import(`./messages/${locale}/attribution.json`)).default,
      },
      common: {
        ...(await import(`./messages/${locale}/common.json`)).default,
      },
      component: {
        ...(await import(`./messages/${locale}/component.json`)).default,
      },
      error: {
        ...(await import(`./messages/${locale}/error.json`)).default,
      },
      page: {
        ...(await import(`./messages/${locale}/page.json`)).default,
      },
      registrationStep: {
        ...(await import(`./messages/${locale}/registrationStep.json`)).default,
      },
      warning: {
        ...(await import(`./messages/${locale}/warning.json`)).default,
      },
    },
  };
});
