"use client";

import React from "react";
import "@/src/ui/css/globals.tailwind.css";
import { ThemeContextProvider } from "@/src/context/ThemeContext";
import { poppins, quicksand } from "@/src/ui/fonts";

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
        <ThemeContextProvider>{children}</ThemeContextProvider>
      </body>
    </html>
  );
}
