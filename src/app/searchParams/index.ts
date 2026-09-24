import { isSupportedLocale } from "@/src/i18n";

export const SEARCH_PARAMS = {
  i18n: {
    /**
     * True if set.
     */
    no_locale_pref: {
      key: "l_nlp",
    },

    /**
     * True if set, indicates that the locale in the URL does not match the stored locale preference.
     */
    locale_missmatch: {
      key: "l_lm",
      construct: (current: string, stored: string) => `${current}-${stored}`,

      validate(value: string) {
        const [current, stored] = value.split("-");

        if (
          !current ||
          !stored ||
          !isSupportedLocale(current) ||
          !isSupportedLocale(stored)
        ) {
          return undefined;
        }

        return current && stored;
      },
      parse(value: string) {
        this.validate(value);
        const [current, stored] = value.split("-");
        return { current, stored };
      },
    },

    /**
     * True if set, indicates that the user has requested to change the locale preference.
     */
    change_locale: {
      key: "l_cl",
      construct: (locale: string) => locale,
      validate(value?: unknown) {
        if (!isSupportedLocale(value)) {
          return undefined;
        }
        return value;
      },
    },
  },
} as const;
