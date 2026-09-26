"use client";

import { IconLogout } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import route from "@/src/app/route";
import { authClient } from "@/src/auth/client";
import { useMyData } from "@/src/hooks/useMyData";
import { useQuickSettings } from "@/src/hooks/useQuickSettings";
import { getQueryClient } from "@/src/lib/trpc/client/client";
import {
  SettingChevronRight,
  SettingItemAction,
  SettingItemButton,
  SettingItemInfo,
} from "..";

const SignOutSettingItem = () => {
  const qc = getQueryClient();
  const { queryKey } = useMyData();

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
              qc.invalidateQueries({
                queryKey,
              });
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
