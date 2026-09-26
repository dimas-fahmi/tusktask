"use client";

import { useTranslations } from "next-intl";
import { authClient } from "@/src/auth/client";
import { RenderBlock } from "..";
import SignOutSettingItem from "../items/SignOut";

const AccountSettings = () => {
  const { data: session } = authClient.useSession();

  const t = useTranslations();

  return (
    session && (
      <RenderBlock title={t("common.Account")} items={[SignOutSettingItem]} />
    )
  );
};
export default AccountSettings;
