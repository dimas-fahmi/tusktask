"use client";

import React from "react";
import "@/src/ui/css/globals.tailwind.css";
import { ThemeContextProvider } from "@/src/context/ThemeContext";
import { poppins, quicksand } from "@/src/ui/fonts";
import { SessionProvider } from "next-auth/react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${poppins.variable} ${quicksand.variable} antialiased bg-tt-primary`}
      >
        <SessionProvider>
          <ThemeContextProvider>{children}</ThemeContextProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
