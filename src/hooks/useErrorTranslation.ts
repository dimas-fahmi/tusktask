"use client";

import { useTranslations } from "next-intl";
import { deserializer } from "../i18n/errorTranslation/init";

export const useErrorTranslation = () => {
  const t = useTranslations();

  const translate = (proto: string) => {
    try {
      const { key, params } = deserializer(proto);
      return t(`error.${key}`, params);
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        throw error;
      } else {
        console.error(error);
      }

      return t("error.generic");
    }
  };

  return {
    translate,
  };
};
