"use client";

import { IconLogout } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import route from "@/src/app/route";
import { authClient } from "@/src/auth/client";
import { useQuickSettings } from "@/src/hooks/useQuickSettings";
import {
  SettingChevronRight,
  SettingItemAction,
  SettingItemButton,
  SettingItemInfo,
} from "..";

const SignOutSettingItem = () => {
  const t = useTranslations();
  const router = useRouter();

  const setOpenQSD = useQuickSettings((s) => s.setOpen);

  return (
    <SettingItemButton
      variant={"destructive"}
      onClick={() => {
        authClient.signOut({
          fetchOptions: {
            onSuccess: () => {
              router.push(route.signin());
              setOpenQSD(false);
            },
          },
        });
      }}
    >
      <SettingItemInfo icon={IconLogout} name={t("common.sign_out")} />
      <SettingItemAction>
        <SettingChevronRight />
      </SettingItemAction>
    </SettingItemButton>
  );
};
export default SignOutSettingItem;
