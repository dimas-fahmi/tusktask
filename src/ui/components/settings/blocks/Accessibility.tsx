"use client";

import { useTranslations } from "next-intl";
import { RenderBlock } from "..";
import LocaleSettingItem from "../items/Locale";

const AccessibilitySettings = () => {
  const t = useTranslations();

  return (
    <RenderBlock
      title={t("common.accessibility")}
      items={[LocaleSettingItem]}
    />
  );
};
export default AccessibilitySettings;
