"use client";

import { usePathname, useSearchParams } from "next/navigation";
import type React from "react";
import { useEffect } from "react";
import { SEARCH_PARAMS } from "../app/searchParams";
import { useErrorTranslation } from "../hooks/useErrorTranslation";
import { stripLocaleFromPathname } from "../i18n";
import { etm } from "../i18n/errorTranslation/init";
import { Toaster } from "../utils/clientOnly/triggerToast";

const ToastURLProvider = ({
  children,
}: {
  children: Readonly<React.ReactNode>;
}) => {
  const { translate } = useErrorTranslation();
  const searchParams = useSearchParams();
  const error_toast = searchParams.get(SEARCH_PARAMS.toast.err.key);
  const pathname = stripLocaleFromPathname(usePathname());

  useEffect(() => {
    if (!error_toast) return;

    new Toaster({
      id: `${pathname}-${error_toast}`,
      title: translate(etm.generic.construct()),
      description: translate(error_toast),
      trigger: true,
    });
  }, [error_toast, pathname, translate]);

  return children;
};
export default ToastURLProvider;
