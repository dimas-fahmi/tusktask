"use client";

import { usePathname, useRouter } from "next/navigation";
import type React from "react";
import { useEffect } from "react";
import route from "../app/route";
import { isGuestOnlyRoute, isProtectedRoute } from "../app/route/constraint";
import { useMyData } from "../hooks/useMyData";
import { stripLocaleFromPathname } from "../i18n";

const clientRouteGuard = ({
  children,
}: {
  children: Readonly<React.ReactNode>;
}) => {
  const { data: myData, isFetching } = useMyData();

  const router = useRouter();
  const pathname = stripLocaleFromPathname(usePathname());

  useEffect(() => {
    if (isFetching) return;

    if (
      myData &&
      myData.registrationStep !== "completed" &&
      pathname !== route.onboarding()
    ) {
      return router.push(route.onboarding());
    }

    if (isProtectedRoute(pathname) && !myData) {
      return router.push(route.signin());
    }

    if (isGuestOnlyRoute(pathname) && myData) {
      return router.push(route.app());
    }
  }, [myData, isFetching, router, pathname]);

  return children;
};
export default clientRouteGuard;
