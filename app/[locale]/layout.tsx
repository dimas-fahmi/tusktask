import { NextIntlClientProvider } from "next-intl";
import type React from "react";
import ClientRouteGuard from "@/src/auth/clientRouteGuard";
import ToastURLProvider from "@/src/provider/toastURLProvider";
import UserPreferencesProvider from "@/src/provider/userPreferencesProvider";
import ImageCropperDialog from "@/src/ui/components/Prefab/ImageCropperDialog";
import ConfirmationDialog from "@/src/ui/dialogs/ConfirmationDialog";
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
      <ToastURLProvider>
        <ClientRouteGuard>
          <UserPreferencesProvider>{children}</UserPreferencesProvider>
        </ClientRouteGuard>
      </ToastURLProvider>

      {/* TOASTER */}
      <Toaster />

      {/* DIALOGS */}
      <QuickSettingsDialog />
      <ImageCropperDialog />
      <RankDialog />
      <NewProjectDialog />
      <ConfirmationDialog />
    </NextIntlClientProvider>
  );
};
export default LocaleLayout;
