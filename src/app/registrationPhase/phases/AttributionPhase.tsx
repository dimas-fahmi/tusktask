"use client";

import { useMutation } from "@tanstack/react-query";
import { cn } from "cn";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useShallow } from "zustand/react/shallow";
import AuthHeader from "@/app/[locale]/(auth)/components/AuthHeader";
import { useHandleQueryError } from "@/src/hooks/useHandleQueryError";
import { useMyData } from "@/src/hooks/useMyData";
import { useRegistrationStep } from "@/src/hooks/useRegistrationStep";
import { getQueryClient, useTRPC } from "@/src/lib/trpc/client/client";
import { Button } from "@/src/ui/shadcn/components/ui/button";
import { Separator } from "@/src/ui/shadcn/components/ui/separator";
import {
  ATTRIBUTION_CHANNELS_ENTRIES,
  type AttributionChannel,
} from "../../attribution";
import type { PendingRegistrationStep } from "..";
import { getPhase } from "../renderable";

const CURRENT: PendingRegistrationStep = "attribution" as const;

const AttributionPhase = () => {
  const t = useTranslations();

  const [setCurrent] = useRegistrationStep(useShallow((s) => [s.setCurrent]));
  const { last, next } = getPhase(CURRENT);

  const [attribution, setAttribution] = useState<
    AttributionChannel | undefined
  >(undefined);

  const { toast } = useHandleQueryError();

  const qc = getQueryClient();
  const { queryKey } = useMyData();
  const trpc = useTRPC();

  const { mutate } = useMutation({
    ...trpc.myData.update.mutationOptions(),

    onError: (err) => {
      toast("failed-update-my-data", err, true);
    },
    onSuccess: () => {
      if (next) {
        setCurrent(next);
      }
    },
    onSettled: () => {
      qc.invalidateQueries({
        queryKey,
      });
    },
  });

  return (
    <div className="flex flex-col gap-4 flex-1">
      <AuthHeader
        title={t(`registrationStep.${CURRENT}.title`)}
        desc={t(`registrationStep.${CURRENT}.desc`)}
      />

      <div className="flex-1 grid grid-cols-1 gap-2">
        {ATTRIBUTION_CHANNELS_ENTRIES.map(([key, { icon: Icon }]) => (
          <button
            key={key}
            type="button"
            className={cn(
              "text-start flex items-center gap-4 p-3 border rounded-md transition-all duration-200",
              attribution === key
                ? "bg-primary text-primary-foreground"
                : "not-disabled:hover:bg-foreground/10",
            )}
            onClick={() => {
              setAttribution(key);
            }}
          >
            {/* ICON CONTAINER */}
            <div>
              <Icon />
            </div>

            {/* CONTENT CONTAINER */}
            <div className="space-y-2 flex-1">
              <div>
                <h1 className="font-semibold">
                  {t(`common.attribution_channels.${key}.title`)}
                </h1>
                <p className="text-xs opacity-95">
                  {t(`common.attribution_channels.${key}.desc`)}
                </p>
              </div>
              <Separator
                className={
                  key === attribution ? "bg-primary-foreground" : "bg-border"
                }
              />
              <small className="text-xs opacity-75">
                {t(`common.attribution_channels.${key}.ps`)}
              </small>
            </div>
          </button>
        ))}
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
            disabled={!attribution}
            variant={"default"}
            onClick={() => {
              if (!attribution) return;
              mutate({
                attribution,
                registrationStep: next,
              });
            }}
          >
            {t("common.continue")}
          </Button>
        )}
      </footer>
    </div>
  );
};
export default AttributionPhase;
