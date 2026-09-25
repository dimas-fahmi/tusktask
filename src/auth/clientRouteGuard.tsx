"use client";

import Cookies from "js-cookie";
import { usePathname, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import type React from "react";
import { useEffect } from "react";
import route from "../app/route";
import { isGuestOnlyRoute, isProtectedRoute } from "../app/route/constraint";
import { useMyData } from "../hooks/useMyData";
import { stripLocaleFromPathname } from "../i18n";
import { Toaster } from "../utils/clientOnly/triggerToast";

const clientRouteGuard = ({
  children,
}: {
  children: Readonly<React.ReactNode>;
}) => {
  const t = useTranslations();
  const { data: myData, isFetching, isPending } = useMyData();

  const router = useRouter();
  const pathname = stripLocaleFromPathname(usePathname());

  useEffect(() => {
    if (isFetching || isPending) return;

    if (
      myData &&
      myData.registrationStep !== "completed" &&
      pathname !== route.onboarding()
    ) {
      const toast = new Toaster({
        id: "registration-first",
        title: t("alert.finish_registration_first.title"),
        description: t("alert.finish_registration_first.desc"),
        type: "warning",
      });

      const isFirst = !!Cookies.get("registration-first");

      if (!isFirst) {
        Cookies.set("registration-first", "1");
      } else {
        toast.trigger();
      }

      return router.push(route.onboarding());
    }

    if (isProtectedRoute(pathname) && !myData) {
      return router.push(route.signin());
    }

    if (isGuestOnlyRoute(pathname) && myData) {
      return router.push(route.app());
    }
  }, [myData, isFetching, router, pathname, t, isPending]);

  return children;
};
export default clientRouteGuard;
