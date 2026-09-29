"use client";

import { useTranslations } from "next-intl";
import { useShallow } from "zustand/react/shallow";
import AuthHeader from "@/app/[locale]/(auth)/components/AuthHeader";
import { useRegistrationStep } from "@/src/hooks/useRegistrationStep";
import { Button } from "@/src/ui/shadcn/components/ui/button";
import { triggerSound } from "@/src/utils/clientOnly/triggerSound";
import type { PendingRegistrationStep } from "..";
import { getPhase } from "../renderable";

const CURRENT: PendingRegistrationStep = "confirmation" as const;

const ConfirmationPhase = () => {
  const t = useTranslations();

  const [setCurrent] = useRegistrationStep(useShallow((s) => [s.setCurrent]));
  const { last, next } = getPhase(CURRENT);

  return (
    <div className="flex flex-col gap-4 flex-1">
      <AuthHeader
        title={t(`registrationStep.${CURRENT}.title`)}
        desc={t(`registrationStep.${CURRENT}.desc`)}
      />

      <div className="flex-1 grid grid-cols-2 gap-1">
        <Button
          variant={"outline"}
          onClick={() => {
            triggerSound("alert_chime");
          }}
        >
          Alert Chime
        </Button>
        <Button
          variant={"outline"}
          onClick={() => {
            triggerSound("alert_echo");
          }}
        >
          Alert Echo
        </Button>
        <Button
          variant={"outline"}
          onClick={() => {
            triggerSound("pop");
          }}
        >
          Pop
        </Button>
        <Button
          variant={"outline"}
          onClick={() => {
            triggerSound("pop_positive");
          }}
        >
          Pop Positive
        </Button>
        <Button
          variant={"outline"}
          onClick={() => {
            triggerSound("pop_negative");
          }}
        >
          Pop Negative
        </Button>
      </div>

      <footer className="flex items-center justify-end gap-1">
        {last && (
          <Button
            variant={"outline"}
            onClick={() => {
              setCurrent(last);
            }}
          >
            {t("common.back")}
          </Button>
        )}

        {next && (
          <Button
            variant={"default"}
            onClick={() => {
              setCurrent(next);
            }}
          >
            {t("common.continue")}
          </Button>
        )}
      </footer>
    </div>
  );
};
export default ConfirmationPhase;
