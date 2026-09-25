"use client";

import { useTranslations } from "next-intl";
import { RenderBlock } from "..";
import ColorTheme from "../items/ColorTheme";

const PersonalizationSettings = () => {
  const t = useTranslations();

  return (
    <RenderBlock title={t("common.personalization")} items={[ColorTheme]} />
  );
};
export default PersonalizationSettings;
