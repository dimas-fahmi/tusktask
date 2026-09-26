import {
  IconBrandFacebook,
  IconBrandGoogle,
  IconFlag,
  IconMessageCircleUser,
  type TablerIcon,
} from "@tabler/icons-react";

export type AttributionItem = {
  icon: TablerIcon;
};

export const ATTRIBUTION_CHANNELS = {
  social_media: {
    icon: IconBrandFacebook,
  },
  search_engine: {
    icon: IconBrandGoogle,
  },
  advertisement: {
    icon: IconFlag,
  },
  word_of_mouth: {
    icon: IconMessageCircleUser,
  },
} as const satisfies Record<string, AttributionItem>;

export type AttributionChannel = keyof typeof ATTRIBUTION_CHANNELS;

export const ATTRIBUTION_CHANNELS_ENTRIES = Object.entries(
  ATTRIBUTION_CHANNELS,
) as [AttributionChannel, AttributionItem][];

export const ATTRIBUTION_CHANNELS_KEYS = Object.keys(
  ATTRIBUTION_CHANNELS,
) as AttributionChannel[];
