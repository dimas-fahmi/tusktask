import {
  IconBeach,
  IconBell,
  IconBookmark,
  IconBooks,
  IconBrandApple,
  IconBrandDiscord,
  IconBrandFacebook,
  IconBrandGoogle,
  IconBriefcase,
  IconBucket,
  IconBus,
  IconCalendar,
  IconCamera,
  IconCar,
  IconClock,
  IconCode,
  IconCreditCard,
  IconFileInvoice,
  IconFolder,
  IconGift,
  IconHeart,
  IconHome,
  IconLock,
  IconLuggage,
  IconMail,
  IconMap,
  IconMapPin,
  IconMicrophone,
  IconMusic,
  IconPalette,
  IconPhone,
  IconPlane,
  type IconProps,
  IconSchool,
  IconSearch,
  IconSettings,
  IconShoppingBag,
  IconShoppingCart,
  IconStar,
  IconTemperature,
  IconTrash,
  IconUser,
  IconVideo,
  IconWallet,
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
  search: {
    icon: IconSearch,
  },
  thermostat: {
    icon: IconTemperature,
  },
  mail: {
    icon: IconMail,
  },
  house: {
    icon: IconHome,
  },
  bucket: {
    icon: IconBucket,
  },
  shopping_bag: {
    icon: IconShoppingBag,
  },
  shopping_cart: {
    icon: IconShoppingCart,
  },
  file_invoice: {
    icon: IconFileInvoice,
  },

  calendar: {
    icon: IconCalendar,
  },
  clock: {
    icon: IconClock,
  },
  user: {
    icon: IconUser,
  },
  settings: {
    icon: IconSettings,
  },
  heart: {
    icon: IconHeart,
  },
  star: {
    icon: IconStar,
  },
  bookmark: {
    icon: IconBookmark,
  },
  bell: {
    icon: IconBell,
  },
  camera: {
    icon: IconCamera,
  },
  phone: {
    icon: IconPhone,
  },
  map: {
    icon: IconMap,
  },
  location: {
    icon: IconMapPin,
  },
  music: {
    icon: IconMusic,
  },
  video: {
    icon: IconVideo,
  },
  microphone: {
    icon: IconMicrophone,
  },
  wallet: {
    icon: IconWallet,
  },
  credit_card: {
    icon: IconCreditCard,
  },
  gift: {
    icon: IconGift,
  },
  lock: {
    icon: IconLock,
  },
  trash: {
    icon: IconTrash,
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
