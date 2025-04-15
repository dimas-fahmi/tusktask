"use client";

import React from "react";
import "@/src/ui/css/globals.tailwind.css";
import { ThemeContextProvider } from "@/src/context/ThemeContext";
import { poppins, quicksand } from "@/src/ui/fonts";
import { SessionProvider } from "next-auth/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "@/src/ui/components/shadcn/ui/sonner";

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
      <body
        className={`${poppins.variable} ${quicksand.variable} antialiased bg-tt-primary`}
      >
        <QueryClientProvider client={queryClient}>
          <SessionProvider>
            <ThemeContextProvider>{children}</ThemeContextProvider>
          </SessionProvider>
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
        <Toaster position="top-right" richColors visibleToasts={5} />
      </body>
    </html>
  );
}
