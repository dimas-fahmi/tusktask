"use client";

import Cookies from "js-cookie";
import { etm } from "../i18n/errorTranslation/init";
import type { TRPCInstanceError } from "../lib/trpc/server/init";
import { Toaster } from "../utils/clientOnly/triggerToast";
import { useErrorTranslation } from "./useErrorTranslation";

function isTranslateableError(
  error?: unknown,
): error is { data: { translationProtocol: "string" } } {
  if (!error) return false;
  const temp = error as TRPCInstanceError;
  if (!temp?.data?.translationProtocol) return false;
  return true;
}

export const useHandleQueryError = () => {
  const { translate } = useErrorTranslation();

  const toast = (id: string, error?: unknown, trigger = true) => {
    const title = translate(etm.generic.construct());

    const isCooldown = !!Cookies.get(id);

    const toast = new Toaster({
      id,
      title: `${title}`,
      type: "error",
      trigger: false,
    });

    if (isTranslateableError(error)) {
      toast.update({
        title,
        description: translate(error.data.translationProtocol),
      });
    } else {
      toast.update({
        title,
        description: translate(etm.unknown_error.construct()),
      });
    }

    console.log(isCooldown);

    if (trigger) {
      console.log("TRIGGER11");
      if (!isCooldown) {
        console.log("TRIGGER");
        toast.trigger();
      }
    }

    const expires = new Date();

    expires.setMinutes(expires.getMinutes() + 1);

    Cookies.set(id, "1", {
      expires,
    });

    return toast;
  };

  return {
    toast,
  };
};
