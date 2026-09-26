"use client";

import { IconGlobe } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { SEARCH_PARAMS } from "@/src/app/searchParams";
import { SUPPORTED_LOCALES } from "@/src/i18n";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/ui/shadcn/components/ui/select";
import { SettingItem, SettingItemAction, SettingItemInfo } from "..";

const LocaleSettingItem = () => {
  const current = useLocale();

  const t = useTranslations();

  const router = useRouter();

  return (
    <SettingItem>
      <SettingItemInfo icon={IconGlobe} name={t("common.display_language")} />

      <SettingItemAction>
        <Select
          value={current}
          onValueChange={(value) => {
            if (!value) return;

            router.replace(
              `?${SEARCH_PARAMS.i18n.change_locale.key}=${SEARCH_PARAMS.i18n.change_locale.construct(value)}`,
            );
          }}
        >
          <SelectTrigger className={"text-xs min-w-24"} size="sm">
            <SelectValue>{t(`common.locales.${current}`)}</SelectValue>
          </SelectTrigger>

          <SelectContent>
            {SUPPORTED_LOCALES.map((locale) => (
              <SelectItem key={locale} value={locale}>
                {t(`common.locales.${locale}`)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </SettingItemAction>
    </SettingItem>
  );
};
export default LocaleSettingItem;
