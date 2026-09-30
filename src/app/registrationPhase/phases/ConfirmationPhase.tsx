"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useShallow } from "zustand/react/shallow";
import AuthHeader from "@/app/[locale]/(auth)/components/AuthHeader";
import { useHandleQueryError } from "@/src/hooks/useHandleQueryError";
import { useMyData } from "@/src/hooks/useMyData";
import { useRegistrationStep } from "@/src/hooks/useRegistrationStep";
import { useTRPC } from "@/src/lib/trpc/client/client";
import QuickSettingsBody from "@/src/ui/components/settings/body/QuickSettingsBody";
import { Button } from "@/src/ui/shadcn/components/ui/button";
import route from "../../route";
import type { PendingRegistrationStep } from "..";
import { getPhase } from "../renderable";

const CURRENT: PendingRegistrationStep = "confirmation" as const;

const ConfirmationPhase = () => {
  const t = useTranslations();

  const [setCurrent] = useRegistrationStep(useShallow((s) => [s.setCurrent]));
  const { last } = getPhase(CURRENT);

  const trpc = useTRPC();
  const { queryKey } = useMyData();
  const router = useRouter();
  const { toast } = useHandleQueryError();

  const { mutate, isPending } = useMutation({
    ...trpc.myData.update.mutationOptions(),
    onMutate: (data, ctx) => {
      ctx.client.cancelQueries({ queryKey });

      const oldData = ctx.client.getQueryData(queryKey);

      if (oldData) {
        ctx.client.setQueryData(queryKey, () => ({
          ...oldData,
          ...data,
        }));
      }

      return { oldData };
    },
    onError: (err, _var, onMutateResult, ctx) => {
      toast("failed_user_mutation", err, true);

      if (onMutateResult?.oldData) {
        ctx.client.setQueryData(queryKey, onMutateResult.oldData);
      }
    },
    onSuccess: () => {
      router.push(route.app());
    },
    onSettled: (_e, _err, _data, _r, ctx) => {
      ctx.client.invalidateQueries({
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

      <QuickSettingsBody hideAccountSettings />

      <footer className="flex items-center justify-end gap-1">
        {last && (
          <Button
            disabled={isPending}
            variant={"outline"}
            onClick={() => {
              setCurrent(last);
            }}
          >
            {t("common.back")}
          </Button>
        )}

        <Button
          disabled={isPending}
          onClick={() => {
            mutate({
              registrationStep: "completed",
            });
          }}
        >
          {t("common.continue_to_app")}
        </Button>
      </footer>
    </div>
  );
};
export default ConfirmationPhase;
