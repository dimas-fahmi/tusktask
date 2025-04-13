"use client";

import React from "react";
import "@/src/ui/css/globals.tailwind.css";
import { ThemeContextProvider } from "@/src/context/ThemeContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased cassandra-pink bg-tt-primary`}>
        <ThemeContextProvider>{children}</ThemeContextProvider>
      </body>
    </html>
  );
}
