import {
  IconCrop11,
  IconCrop32,
  IconCrop169,
  type IconProps,
  type TablerIcon,
} from "@tabler/icons-react";

const ASPECT_RATIOS = {
  square: {
    label: "1:1",
    value: 1 / 1,
    icon: IconCrop11,
  },
  landscape: {
    label: "16:9",
    value: 16 / 9,
    icon: IconCrop169,
  },
  portrait: {
    label: "9:16",
    value: 9 / 16,
    icon: IconCrop169,
    props: {
      className: "rotate-90",
    },
  },
  standard: {
    label: "4:3",
    value: 4 / 3,
    icon: IconCrop32,
    props: {},
  },
} as const satisfies Record<string, AspectRatio>;

const IMG_CONFIG_CATEGORY = {
  avatar: {
    raw_size: 1024 * 1024 * 50, //50MB
    final_size: 1024 * 20, // 20kb
    aspectRatio: "square",
    shape: "round",
    maxWidthOrHeight: 512,
  },
} as const satisfies Record<string, ImageConfigCategory>;

const IMG_CONFIG_FORMAT = {
  raw: ["jpeg", "jpg", "png", "webp"],
  final: "webp",
} as const satisfies {
  raw: string[];
  final: string;
};

const IMG_CONFIG = {
  category: IMG_CONFIG_CATEGORY,
  format: IMG_CONFIG_FORMAT,
  aspectRatios: ASPECT_RATIOS,
} as const;

export default IMG_CONFIG;

export type ImageShape = "rect" | "round";

export type ImageConfigCategory = {
  raw_size: number;
  final_size: number;
  aspectRatio: AspectRatioKey;
  shape: ImageShape;
  maxWidthOrHeight: number;
};

export type AspectRatio = {
  label: string;
  value: number;
  icon: TablerIcon;
  props?: IconProps;
};

export type AspectRatioKey = keyof typeof ASPECT_RATIOS;
export type ImgCategoryKey = keyof typeof IMG_CONFIG_CATEGORY;
export type ImgRawFormat = (typeof IMG_CONFIG.format.raw)[number];

export const ASPECT_RATIO_ENTRIES = Object.entries(ASPECT_RATIOS) as [
  AspectRatioKey,
  AspectRatio,
][];

export function isValidRawFormat(str?: unknown): str is ImgRawFormat {
  return !str ? false : IMG_CONFIG.format.raw.includes(str as ImgRawFormat);
}
