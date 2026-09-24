"use client";

import { IconSettings } from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import quotes from "@/src/app/data/quotes.json";
import route from "@/src/app/route";
import StyledLink from "@/src/ui/components/ui/StyledLink";
import { Button } from "@/src/ui/shadcn/components/ui/button";
import { Separator } from "@/src/ui/shadcn/components/ui/separator";

const AuthLayout = ({ children }: LayoutProps<"/[locale]">) => {
  const t = useTranslations();
  const locale = useLocale();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 min-h-dvh gap-4">
      {/* Main Container */}
      <div className="p-4 md:p-6 lg:p-12 space-y-4">
        <header className="flex items-center justify-between">
          {/* Logo */}
          <Link href={route.homepage()}>
            <Image
              width={48}
              height={59.5}
              src={"/res/logo/main.png"}
              alt="TuskTask's Logo"
            />
          </Link>

          {/* Buttons */}
          <div>
            <Button variant={"outline"} size={"icon"}>
              <IconSettings />
            </Button>
          </div>
        </header>

        <main>{children}</main>

        <footer className="space-y-2">
          <p className="text-sm">
            {t.rich("alert.tos_pp_consent_notice", {
              tos: (chunk) => (
                <StyledLink href={route.terms_of_service()}>{chunk}</StyledLink>
              ),
              pp: (chunk) => (
                <StyledLink href={route.privacy_policy()}>{chunk}</StyledLink>
              ),
            })}
          </p>

          <Separator />

          <p className="text-sm text-center">{t("alert.new_account_notice")}</p>
        </footer>
      </div>

      {/* Art Illustration Container */}
      <div className="relative bg-amber-50">
        {/* Content Wrapper */}
        <div className="sticky top-0 px-4 md:px-6 lg:px-12">
          <div className="relative mx-auto aspect-square max-h-[80vh] mt-4">
            <Image
              fill
              loading="eager"
              sizes="(max-width:768px) 100vw"
              src={"/res/arts/t-art-placeholder.png"}
              alt="Tusky & Bruno"
            />
          </div>

          {/* Quote Reader */}
          <div className="text-black">
            <p className="italic">{quotes[locale][0].value}</p>
            <small>{`- ${quotes[locale][0].author}`}</small>
          </div>
        </div>
      </div>
    </div>
  );
};
export default AuthLayout;
