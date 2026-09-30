"use client";

import { useTranslations } from "next-intl";
import { RenderBlock } from "..";
import ColorTheme from "../items/ColorTheme";
import NotificationSoundSettingItem from "../items/NotificationSound";
import SoundEffectSettingItem from "../items/SoundEffect";

const PersonalizationSettings = () => {
  const t = useTranslations();

  return (
    <RenderBlock
      title={t("common.personalization")}
      items={[ColorTheme, NotificationSoundSettingItem, SoundEffectSettingItem]}
    />
  );
};
export default PersonalizationSettings;
