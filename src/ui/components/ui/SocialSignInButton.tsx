"use client";

import { IconLoader } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { authClient } from "@/src/auth/client";
import { SOCIAL_PROVIDERS, type SocialProviderName } from "@/src/auth/social";
import { Button, type ButtonProps } from "../../shadcn/components/ui/button";
import { cn } from "../../shadcn/lib/utils";

export type SocialSignInButtonProps = Omit<ButtonProps, "children" | "ref"> & {
  provider: SocialProviderName;
  pending?: SocialProviderName | null;
  setPending?: (pending: SocialProviderName | null) => void;
};

const SocialSignInButton = ({
  provider,
  pending,
  setPending,
  onClick,
  className,
  ...props
}: SocialSignInButtonProps) => {
  const t = useTranslations();
  const data = SOCIAL_PROVIDERS[provider];

  return (
    <Button
      disabled={!!pending}
      variant={"outline"}
      {...props}
      className={cn("", className)}
      onClick={(e) => {
        onClick?.(e);

        if (e.defaultPrevented) return;

        setPending?.(provider);

        authClient.signIn.social({
          provider,
          fetchOptions: {
            onError: () => {
              setPending?.(null);

              // TODO: Trigger Toast
            },
          },
          callbackURL: "/?just_signin=true",
        });
      }}
    >
      {pending === provider ? (
        <>
          <IconLoader className="animate-spin" />
          <span>{t("common.wait_a_moment")}</span>
        </>
      ) : (
        <>
          <data.icon />
          <span>
            {t("component.SocialSignInButton.label", {
              provider: data.name,
            })}
          </span>
        </>
      )}
    </Button>
  );
};

export default SocialSignInButton;
