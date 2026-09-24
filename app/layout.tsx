"use client";

import { fontBody, fontHeading } from "@/src/ui/fonts";
import { TooltipProvider } from "@/src/ui/shadcn/components/ui/tooltip";
import { cn } from "@/src/ui/shadcn/lib/utils";
import "@/src/ui/styles/globals.tailwind.css";

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={cn(
        "h-full",
        "antialiased",
        "font-body",
        fontHeading.variable,
        fontBody.variable,
      )}
    >
      <body className="min-h-full flex flex-col custom-scrollbar">
        <TooltipProvider>{children}</TooltipProvider>
      </body>
    </html>
  );
}
