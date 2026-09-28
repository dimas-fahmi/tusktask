import {
  IconCrop11,
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
} as const satisfies Record<string, AspectRatio>;

const IMG_CONFIG_CATEGORY = {
  avatar: {
    raw_size: 1024 * 1024 * 50, //50MB
    final_size: 1024 * 100, // 100KB
    aspectRatio: "square",
    shape: "round",
    maxWidthOrHeight: 512,
  },
} as const satisfies Record<string, ImageConfigCategory>;

const IMG_CONFIG_FORMAT = {
  raw: ["jpeg", "png", "webp"],
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

export type ImageConfigCategory = {
  raw_size: number;
  final_size: number;
  aspectRatio: AspectRatioKey;
  shape: "rect" | "round";
  maxWidthOrHeight: number;
};

export type AspectRatio = {
  label: string;
  value: number;
  icon: TablerIcon;
  props?: IconProps;
};

export type AspectRatioKey = keyof typeof ASPECT_RATIOS;
