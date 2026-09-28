import { NextIntlClientProvider } from "next-intl";
import type React from "react";
import ClientRouteGuard from "@/src/auth/clientRouteGuard";
import ImageCropperDialog from "@/src/ui/components/Prefab/ImageCropperDialog";
import QuickSettingsDialog from "@/src/ui/dialogs/QuickSettingsDialog";
import { Toaster } from "@/src/ui/shadcn/components/ui/toast";

const LocaleLayout = ({
  children,
}: {
  children: Readonly<React.ReactNode>;
}) => {
  return (
    <NextIntlClientProvider>
      <ClientRouteGuard>{children}</ClientRouteGuard>

      {/* TOASTER */}
      <Toaster />

      {/* DIALOGS */}
      <QuickSettingsDialog />
      <ImageCropperDialog />
    </NextIntlClientProvider>
  );
};
export default LocaleLayout;
