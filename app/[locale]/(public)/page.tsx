"use client";

import { useTranslations } from "next-intl";

const HomePage = () => {
  const t = useTranslations();

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">TuskTask</h1>
      <p>{t("common.close")}</p>
    </div>
  );
};
export default HomePage;
