// APP CONFIGS
export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME ?? "TuskTask";
export const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL || "https://tusktask.dimasfahmi.pro";
export const APP_LOGO_SYMBOLIC =
  process.env.NEXT_PUBLIC_LOGO_SYMBOLIC ||
  "https://zvgpixcwdvbogm3e.public.blob.vercel-storage.com/tusktask/logo/tusktask.png";
export const APP_LOGO_WORDMARK =
  process.env.NEXT_PUBLIC_LOGO_WORDMARK ||
  "https://zvgpixcwdvbogm3e.public.blob.vercel-storage.com/tusktask/logo/tusktask-wordmark.png";
export const OG_IMAGE =
  process.env.NEXT_PUBLIC_OG_IMAGE ||
  "https://zvgpixcwdvbogm3e.public.blob.vercel-storage.com/tusktask/landing/You%20Just%20Killed%20Your%20Plant%20Again%2C%20Didn%E2%80%99t%20You.png";
export const TWITTER_IMAGE =
  process.env.NEXT_PUBLIC_TWITTER_IMAGE ||
  "https://zvgpixcwdvbogm3e.public.blob.vercel-storage.com/tusktask/landing/You%20Just%20Killed%20Your%20Plant%20Again%2C%20Didn%E2%80%99t%20You.png";
export const TWITTER_HANDLER =
  process.env.NEXT_PUBLIC_TWITTER_HANDLER || "@tusktask";
export const DEFAULT_TITLE = "We'll Remember It For You";
export const DEFAULT_DESCRIPTION =
  "TuskTask is a handy productivity app that helps you manage your tasks, sends reminders for events and deadlines, and includes a Pomodoro feature to help you stay focused by breaking tasks into intervals.";
export const APP_KEYWORDS = [
  "TuskTask",
  "Productivity",
  "Reminder",
  "ADHD Coping Platform",
];

// IDs
export const VERCEL_BLOB_ID = "zvgpixcwdvbogm3e";

// HOSTs
export const VERCEL_BLOB_HOST = `https://${VERCEL_BLOB_ID}.public.blob.vercel-storage.com/tusktask`;
export const SUPABASE_AUTH_HOST = "https://xyjrsrcveoqyerxaaanp.supabase.co";

// NAVIGATIONS
export const NAVIGATIONS = [
  {
    title: "About Us",
    href: "/",
    external: false,
  },
  {
    title: "Use Cases",
    href: "#UseCases",
    external: false,
  },
  {
    title: "Policy",
    href: "/policy",
    external: false,
  },
  {
    title: "Repo",
    href: "https://github.com/dimas-fahmi/tusktask",
    external: true,
  },
  {
    title: "Contact",
    href: "#contact",
    external: true,
  },
];

// REGEXs
export const USERNAME_REGEX =
  /^(?!.*[_-]{2})(?!.*[_-].*[_-])^[a-z](?:[a-z0-9]*[_-]?[a-z0-9]+)*$/;

export const NAME_REGEX = /^[a-zA-Z ]*$/;

// DEFAULTS
export const DEFAULT_AVATARS = [
  "https://zvgpixcwdvbogm3e.public.blob.vercel-storage.com/tusktask/defaults/sam-the-siam.png",
  "https://zvgpixcwdvbogm3e.public.blob.vercel-storage.com/tusktask/defaults/penny-the-persian.png",
  "https://zvgpixcwdvbogm3e.public.blob.vercel-storage.com/tusktask/defaults/gerrard-the-ginger.png",
  "https://zvgpixcwdvbogm3e.public.blob.vercel-storage.com/tusktask/defaults/bernard-the-boxer.png",
];
export const DEFAULT_EMAIL_COOLDOWN = 1000 * 60 * 5;
export const DEFAULT_NO_IMAGE_SQUARE = "/no-image-square.jpg";
export const DEFAULT_NO_IMAGE_WIDE = "/no-image-wide.jpg";
export const DEFAULT_ICON = "Clock1";

// IMAGES CONFIGURATIONS
export const ALLOWED_IMAGE_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];
export const ALLOWED_IMAGE_MAX_MIME_SIZE = 1024 * 1024 * 5;

// OAuths Providers
export const OAUTH_PROVIDERS = ["google", "discord", "github"] as const;
export type AuthProvider = (typeof OAUTH_PROVIDERS)[number];

// ROUTES
export const PROTECTED_ROUTES = ["/dashboard", "/auth/registration"];

// ONBOARDING STEPS
export const ONBOARDING_STEPS = [
  "name",
  "username",
  "avatar",
  "confirmation",
  "completed",
] as const;

// THEMING
export const APP_THEMES_ID = [
  "default",
  "dark",
  "pop-bella",
  "beige-serenity",
] as const;

export const DEFAULT_COLOR_THEME: (typeof APP_THEMES_ID)[number] = "default";
export const DEFAULT_FONT_THEME: (typeof FONT_THEME_CLASSES)[number] =
  "theme-font-playfair";

export interface AppTheme {
  id: (typeof APP_THEMES_ID)[number];
  screenshot: string;
  label: string;
  name: string;
}

export const APP_THEMES: Record<(typeof APP_THEMES_ID)[number], AppTheme> = {
  default: {
    id: "default",
    name: "TuskTask Default",
    label: "Default TuskTask Light Theme",
    screenshot:
      "https://zvgpixcwdvbogm3e.public.blob.vercel-storage.com/tusktask/screenshots/screenshot-theme-default.png",
  },
  dark: {
    id: "dark",
    name: "TuskTask Dark",
    label: "Default TuskTask Dark Theme",
    screenshot:
      "https://zvgpixcwdvbogm3e.public.blob.vercel-storage.com/tusktask/screenshots/screenshot-theme-dark-default.png",
  },
  "pop-bella": {
    id: "pop-bella",
    name: "Pop Bella",
    label: "Beautifull Soft Pink Style",
    screenshot:
      "https://zvgpixcwdvbogm3e.public.blob.vercel-storage.com/tusktask/screenshots/screenshot-theme-pop-bella.png",
  },
  "beige-serenity": {
    id: "beige-serenity",
    name: "Beige Serenity",
    label: "Beautifull Soft Beige Style",
    screenshot:
      "https://zvgpixcwdvbogm3e.public.blob.vercel-storage.com/tusktask/screenshots/screenshot-theme-beige-serenity.png",
  },
};

export const FONT_THEME_CLASSES = [
  "theme-font-default",
  "theme-font-space-mono",
  "theme-font-inter",
  "theme-font-playfair",
  "theme-font-merriweather",
  "theme-font-jetbrains",
  "theme-font-poppins",
  "theme-font-bebas",
  "theme-font-cormorant",
  "theme-font-fira-code",
] as const;

export interface FontTheme {
  id: (typeof FONT_THEME_CLASSES)[number];
  name: string;
  description: string;
}

export const FONT_THEMES: Record<
  (typeof FONT_THEME_CLASSES)[number],
  FontTheme
> = {
  "theme-font-default": {
    id: "theme-font-default",
    name: "Oswald & Space Grotesk",
    description:
      "A balanced modern look — bold headers with clean geometric body text.",
  },
  "theme-font-space-mono": {
    id: "theme-font-space-mono",
    name: "Space Mono",
    description:
      "Retro and technical — perfect for coding, terminal, or minimalist design themes.",
  },
  "theme-font-bebas": {
    id: "theme-font-bebas",
    name: "Bebas & Roboto",
    description:
      "Strong and assertive — perfect for headlines and content with attitude.",
  },
  "theme-font-inter": {
    id: "theme-font-inter",
    name: "Inter",
    description:
      "Crisp, modern, and highly readable — great for apps, dashboards, and clean UIs.",
  },
  "theme-font-cormorant": {
    id: "theme-font-cormorant",
    name: "Cormorant & Jost",
    description:
      "Artistic and elegant — ideal for creative studios, portfolios, and editorial work.",
  },
  "theme-font-fira-code": {
    id: "theme-font-fira-code",
    name: "Fira Code & Sans",
    description:
      "Developer aesthetic — monospaced precision with readable sans body text.",
  },
  "theme-font-jetbrains": {
    id: "theme-font-jetbrains",
    name: "Orbitron & JetBrains Mono",
    description:
      "Futuristic and digital — fits tech startups, dev tools, and sci-fi interfaces.",
  },
  "theme-font-playfair": {
    id: "theme-font-playfair",
    name: "Playfair Display & Space Grotesk",
    description: "Retro Modern, light header with clear paragraph.",
  },
  "theme-font-merriweather": {
    id: "theme-font-merriweather",
    name: "Playfair Display & Merriweather",
    description:
      "Classic and refined — for blogs, publications, or professional presentations.",
  },
  "theme-font-poppins": {
    id: "theme-font-poppins",
    name: "Poppins & Nunito Sans",
    description:
      "Friendly and approachable — rounded shapes with soft, humanist feel.",
  },
};
