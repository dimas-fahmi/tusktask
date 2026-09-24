import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { getEnv } from "@/src/app/env";
import { Separator } from "@/src/ui/shadcn/components/ui/separator";
import AuthHeader from "../components/AuthHeader";
import EmailSignInSection from "./sections/EmailSignInSection";
import SocialSignInSection from "./sections/SocialSignInSection";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations();

  return {
    title: `${t("page.sign_in.title")} | ${getEnv("NEXT_PUBLIC_APP_NAME")}`,
  };
}

const SignInPage = async () => {
  const t = await getTranslations();

  return (
    <div className="space-y-4">
      <AuthHeader
        title={t("page.sign_in.title")}
        desc={t("page.sign_in.desc")}
      />

      <SocialSignInSection />

      <Separator />

      <EmailSignInSection />
    </div>
  );
};
export default SignInPage;
