"use client";

import { useTranslations } from "next-intl";
import { SOCIAL_PROVIDERS, type SocialProviderName } from "@/src/auth/social";
import { Button, type ButtonProps } from "../../shadcn/components/ui/button";

export type SocialSignInButtonProps = Omit<ButtonProps, "children" | "ref"> & {
  provider: SocialProviderName;
  isPending?: SocialProviderName | null;
  setPending?: (pending: SocialProviderName | null) => void;
};

const SocialSignInButton = ({
  provider,
  isPending,
  setPending,
  onClick,
  className,
  ...props
}: SocialSignInButtonProps) => {
  const t = useTranslations();
  const data = SOCIAL_PROVIDERS[provider];

  return (
    <Button variant={"outline"} {...props}>
      <data.icon />
      <span>
        {t("component.SocialSignInButton.label", {
          provider: data.name,
        })}
      </span>
    </Button>
  );
};

export default SocialSignInButton;
