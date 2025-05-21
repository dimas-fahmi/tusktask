"use client";

import React from "react";
import "@/src/ui/css/globals.tailwind.css";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { SessionProvider } from "next-auth/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { NotificationContextProvider } from "@/src/lib/tusktask/context/NotificationContext";
import { PersonalContextProvider } from "@/src/lib/tusktask/context/PersonalContext";
import { ThemeContextProvider } from "@/src/lib/tusktask/context/ThemeContext";

const queryClient = new QueryClient();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preload" href="/sounds/notify.mp3" as="audio" />
      </head>
      <body className={`antialiase`} suppressHydrationWarning>
        <QueryClientProvider client={queryClient}>
          <SessionProvider>
            <PersonalContextProvider>
              <NotificationContextProvider>
                <ThemeContextProvider>{children}</ThemeContextProvider>
              </NotificationContextProvider>
            </PersonalContextProvider>
          </SessionProvider>
          {/* <ReactQueryDevtools initialIsOpen={false} /> */}
        </QueryClientProvider>
      </body>
    </html>
  );
}
