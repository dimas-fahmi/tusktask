import {
  IconBrandDiscord,
  IconBrandGithub,
  IconBrandGoogle,
  type TablerIcon,
} from "@tabler/icons-react";

export type SocialProvider = {
  name: string;
  isSupported: boolean;
  icon: TablerIcon;
};

export const SOCIAL_PROVIDERS = {
  discord: {
    name: "Discord",
    isSupported: true,
    icon: IconBrandDiscord,
  },
  github: {
    name: "GitHub",
    isSupported: true,
    icon: IconBrandGithub,
  },
  google: {
    name: "Google",
    isSupported: true,
    icon: IconBrandGoogle,
  },
} as const satisfies Record<string, SocialProvider>;

export type SocialProviderName = keyof typeof SOCIAL_PROVIDERS;

export const SOCIAL_PROVIDER_ENTRIES = Object.entries(SOCIAL_PROVIDERS) as [
  SocialProviderName,
  SocialProvider,
][];
