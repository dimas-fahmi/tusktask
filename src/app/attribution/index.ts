import {
  IconBrandFacebook,
  IconBrandGoogle,
  IconFlag,
  IconMessageCircleUser,
  type TablerIcon,
} from "@tabler/icons-react";
import { z } from "zod";
import { etm } from "@/src/i18n/errorTranslation/init";

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

export const attributionEnum = z.enum(
  Object.keys(ATTRIBUTION_CHANNELS),
  etm.invalid_attribution_channel.construct(),
);
