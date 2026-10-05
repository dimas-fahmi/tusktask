import { NextIntlClientProvider } from "next-intl";
import type React from "react";
import ClientRouteGuard from "@/src/auth/clientRouteGuard";
import UserPreferencesProvider from "@/src/provider/userPreferencesProvider";
import ImageCropperDialog from "@/src/ui/components/Prefab/ImageCropperDialog";
import NewProjectDialog from "@/src/ui/dialogs/NewProjectDialog";
import QuickSettingsDialog from "@/src/ui/dialogs/QuickSettingsDialog";
import RankDialog from "@/src/ui/dialogs/RankDialog";
import { Toaster } from "@/src/ui/shadcn/components/ui/toast";

const LocaleLayout = ({
  children,
}: {
  children: Readonly<React.ReactNode>;
}) => {
  return (
    <NextIntlClientProvider>
      <ClientRouteGuard>
        <UserPreferencesProvider>{children}</UserPreferencesProvider>
      </ClientRouteGuard>

      {/* TOASTER */}
      <Toaster />

      {/* DIALOGS */}
      <QuickSettingsDialog />
      <ImageCropperDialog />
      <RankDialog />
      <NewProjectDialog />
    </NextIntlClientProvider>
  );
};
export default LocaleLayout;
