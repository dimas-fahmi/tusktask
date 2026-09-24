"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/src/ui/shadcn/components/ui/button";
import { Input } from "@/src/ui/shadcn/components/ui/input";
import { Label } from "@/src/ui/shadcn/components/ui/label";

const EmailSignInSection = () => {
  const t = useTranslations();

  return (
    <section id="email-signin" className="grid grid-cols-1 gap-2">
      <Label>{t("common.email_address")}</Label>
      <Input placeholder="jane.doe@domain.com" />
      <Button disabled>{t("common.sign_in")}</Button>
    </section>
  );
};
export default EmailSignInSection;
