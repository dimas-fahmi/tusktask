import {
  IconBeach,
  IconBooks,
  IconBrandApple,
  IconBrandDiscord,
  IconBrandFacebook,
  IconBrandGoogle,
  IconBriefcase,
  IconBus,
  IconCar,
  IconCode,
  IconFolder,
  IconLuggage,
  IconPalette,
  IconPlane,
  type IconProps,
  IconSchool,
  type TablerIcon,
} from "@tabler/icons-react";

export const ICONS = {
  // SOCIALS
  apple: {
    icon: IconBrandApple,
  },
  discord: {
    icon: IconBrandDiscord,
  },
  facebook: {
    icon: IconBrandFacebook,
  },
  google: {
    icon: IconBrandGoogle,
  },

  // OTHERS
  briefcase: {
    icon: IconBriefcase,
  },
  folder: {
    icon: IconFolder,
  },
  mortarboard: {
    icon: IconSchool,
  },
  books: {
    icon: IconBooks,
  },
  bus: {
    icon: IconBus,
  },
  car: {
    icon: IconCar,
  },
  airplane: {
    icon: IconPlane,
  },
  pallete: {
    icon: IconPalette,
  },
  luggage: {
    icon: IconLuggage,
  },
  beach: {
    icon: IconBeach,
  },
  code: {
    icon: IconCode,
  },
} as const satisfies Record<
  string,
  {
    icon: TablerIcon;
    props?: IconProps;
  }
>;

export type IconName = keyof typeof ICONS;
export type IconData = (typeof ICONS)[IconName];

export const ICONS_ENTRIES = Object.entries(ICONS) as [IconName, IconData][];
export const ICON_NAMES = Object.keys(ICONS) as IconName[];

export function isValidIconName(str?: unknown): str is IconName {
  return !str ? false : ICON_NAMES.includes(str as IconName);
}
