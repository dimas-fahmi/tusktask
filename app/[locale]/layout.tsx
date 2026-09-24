import { NextIntlClientProvider } from "next-intl";
import type React from "react";

const LocaleLayout = ({
  children,
}: {
  children: Readonly<React.ReactNode>;
}) => {
  return <NextIntlClientProvider>{children}</NextIntlClientProvider>;
};
export default LocaleLayout;
