"use client";

import { queryClient } from "@/src/lib/queries";
import "@/src/ui/css/globals.tailwind.css";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import ColorThemePickerModal from "@/src/ui/components/ui/ColorThemePickerModal";
import ImageUploadModal from "@/src/ui/components/ui/ImageUploadModal";
import { interFont, oswaldFont } from "@/src/ui/fonts";
import { Toaster } from "@/src/ui/shadcn/components/ui/sonner";
import NotificationProvider from "./NotificationProvider";
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
          <NotificationProvider>
            <ThemeProvider>
              <PomodoroProvider>{children}</PomodoroProvider>
            </ThemeProvider>
            <ImageUploadModal />
            <ColorThemePickerModal />
            <Toaster richColors position="top-center" />
            <ReactQueryDevtools initialIsOpen={false} />
          </NotificationProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
