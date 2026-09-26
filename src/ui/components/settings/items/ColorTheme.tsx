import { IconPaint } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { useShallow } from "zustand/react/shallow";
import { COLOR_THEME_IDS, isColorThemeId } from "@/src/app/colorTheme";
import { useColorTheme } from "@/src/hooks/useColorTheme";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/ui/shadcn/components/ui/select";
import { SettingItem, SettingItemAction, SettingItemInfo } from "..";

const ColorTheme = () => {
  const t = useTranslations();

  const [current, setCurrent] = useColorTheme(
    useShallow((s) => [s.states.colorThemeId, s.actions.setColorThemeId]),
  );

  return (
    <SettingItem>
      <SettingItemInfo icon={IconPaint} name={t("common.color_theme")} />
      <SettingItemAction>
        <Select
          value={current}
          onValueChange={(value) => {
            if (isColorThemeId(value)) {
              setCurrent(value);
            }
          }}
        >
          <SelectTrigger size="sm" className={"min-w-24 text-xs"}>
            <SelectValue>
              {t(`common.color_themes.${current}.name`)}
            </SelectValue>
          </SelectTrigger>

          <SelectContent>
            {COLOR_THEME_IDS.map((id) => (
              <SelectItem
                key={id}
                value={id}
                onClick={() => {
                  setCurrent(id);
                }}
              >
                {t(`common.color_themes.${id}.name`)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </SettingItemAction>
    </SettingItem>
  );
};
export default ColorTheme;
