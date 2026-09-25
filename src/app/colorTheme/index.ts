export const COLOR_THEME_IDS = ["default", "dark"] as const;

export type ColorThemeId = (typeof COLOR_THEME_IDS)[number];

export const DEFAULT_COLOR_THEME_ID: ColorThemeId = "default" as const;

export function isColorThemeId(str?: unknown): str is ColorThemeId {
  return !str ? false : COLOR_THEME_IDS.includes(str as ColorThemeId);
}
