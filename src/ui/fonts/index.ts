import { Inter, Oswald } from "next/font/google";

export const interFont = Inter({
  variable: "--font-inter",
  display: "swap",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const oswaldFont = Oswald({
  variable: "--font-oswald",
  display: "swap",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700"],
});
