import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { getEnv } from "@/src/app/env";
import RegistrationPageIndex from "./RegistrationPageIndex";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations();

  return {
    title: `${t("page.registration.title")} | ${getEnv("NEXT_PUBLIC_APP_NAME")}`,
  };
}

const RegistrationPage = () => {
  return <RegistrationPageIndex />;
};
export default RegistrationPage;
