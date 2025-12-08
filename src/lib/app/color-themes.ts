export const APP_COLOR_THEMES = [
  "default",
  "dark",
  "popBella",
  "beigeSerenity",
  "brownBear",
  "coffeePuff",
  "jetBlack",
] as const;

export const APP_COLOR_THEMES_CLASSES: Record<
  (typeof APP_COLOR_THEMES)[number],
  string
> = {
  default: "default",
  dark: "color-theme-dark",
  popBella: "color-theme-popBella",
  brownBear: "color-theme-brownBear",
  coffeePuff: "color-theme-coffeePuff",
  jetBlack: "color-theme-jetBlack",
  beigeSerenity: "color-theme-beigeSerenity",
};

export const APP_COLOR_THEMES_SHORT_NAME: Record<
  (typeof APP_COLOR_THEMES)[number],
  string
> = {
  default: "Default",
  popBella: "Pop Bella",
  beigeSerenity: "Beige Serenity",
  brownBear: "Brown Bear",
  coffeePuff: "Coffee Puff",
  dark: "Dark",
  jetBlack: "Jet Black",
};

export const APP_COLOR_THEMES_METADATA: Record<
  (typeof APP_COLOR_THEMES)[number],
  { title: string; description: string; screenshot: string }
> = {
  default: {
    title: "TuskTask Default (Light)",
    description:
      "The original, clean, and bright theme with a subtle cool primary accent.",
    screenshot:
      "https://zvgpixcwdvbogm3e.public.blob.vercel-storage.com/tusktask/screenshots/screenshot-theme-pop-bella.png",
  },
  dark: {
    title: "Dark Mode",
    description:
      "A low-light theme with deep, neutral backgrounds for reduced eye strain.",
    screenshot:
      "https://zvgpixcwdvbogm3e.public.blob.vercel-storage.com/tusktask/screenshots/screenshot-theme-pop-bella.png",
  },
  popBella: {
    title: "Pop Bella (Feminine Pink)",
    description:
      "A vibrant and soft aesthetic featuring high-chroma pinks and light pastel accents.",
    screenshot:
      "https://zvgpixcwdvbogm3e.public.blob.vercel-storage.com/tusktask/screenshots/screenshot-theme-pop-bella.png",
  },
  brownBear: {
    title: "Brown Bear (Earthy & Cozy)",
    description:
      "A warm, natural theme featuring deep chestnut browns and muted forest greens.",
    screenshot:
      "https://zvgpixcwdvbogm3e.public.blob.vercel-storage.com/tusktask/screenshots/screenshot-theme-pop-bella.png",
  },
  coffeePuff: {
    title: "Coffee Puff (Monochromatic Warm)",
    description:
      "A cozy, monochrome palette built on rich caramel, latte, and coffee tones.",
    screenshot:
      "https://zvgpixcwdvbogm3e.public.blob.vercel-storage.com/tusktask/screenshots/screenshot-theme-pop-bella.png",
  },
  jetBlack: {
    title: "Jet Black (Minimal Contrast)",
    description:
      "A sleek, true-black theme with high contrast and an electric neon-cyan primary color.",
    screenshot:
      "https://zvgpixcwdvbogm3e.public.blob.vercel-storage.com/tusktask/screenshots/screenshot-theme-pop-bella.png",
  },
  beigeSerenity: {
    title: "Beige Serenity",
    description:
      "Beautifull soft beige style, elegant old-paper style. Cozy and warm with light pastel accent.",
    screenshot:
      "https://zvgpixcwdvbogm3e.public.blob.vercel-storage.com/tusktask/screenshots/screenshot-theme-beige-serenity.png",
  },
};
