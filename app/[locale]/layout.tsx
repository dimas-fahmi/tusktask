import { NextIntlClientProvider } from "next-intl";
import type React from "react";
import { Toaster } from "@/src/ui/shadcn/components/ui/toast";

const LocaleLayout = ({
  children,
}: {
  children: Readonly<React.ReactNode>;
}) => {
  return (
    <NextIntlClientProvider>
      {children}

      {/* TOASTER */}
      <Toaster />
    </NextIntlClientProvider>
  );
};
export default LocaleLayout;
