import { Oswald, Poppins, Quicksand } from "next/font/google";

export const poppins = Poppins({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
  subsets: ["latin"],
  variable: "--font-poppins",
});

export const quicksand = Quicksand({
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  subsets: ["latin"],
  variable: "--font-quicksand",
});
