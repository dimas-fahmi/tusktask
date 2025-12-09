"use client";

import { queryClient } from "@/src/lib/queries";
import "@/src/ui/css/globals.tailwind.css";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import ColorThemePickerModal from "@/src/ui/components/ui/ColorThemePickerModal";
import ImageUploadModal from "@/src/ui/components/ui/ImageUploadModal";
import { interFont, oswaldFont } from "@/src/ui/fonts";
import PomodoroProvider from "./PomodoroProvider";
import ThemeProvider from "./ThemeProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${interFont.variable} ${oswaldFont.variable} antialiased`}
      >
        <QueryClientProvider client={queryClient}>
          <ThemeProvider>
            <PomodoroProvider>{children}</PomodoroProvider>
          </ThemeProvider>
          <ImageUploadModal />
          <ColorThemePickerModal />
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </body>
    </html>
  );
}
