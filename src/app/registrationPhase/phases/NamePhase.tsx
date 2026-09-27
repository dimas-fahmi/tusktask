"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { useShallow } from "zustand/react/shallow";
import AuthHeader from "@/app/[locale]/(auth)/components/AuthHeader";
import { useErrorTranslation } from "@/src/hooks/useErrorTranslation";
import { useHandleQueryError } from "@/src/hooks/useHandleQueryError";
import { useMyData } from "@/src/hooks/useMyData";
import { useRegistrationStep } from "@/src/hooks/useRegistrationStep";
import { etzs } from "@/src/i18n/errorTranslation/schema";
import { getQueryClient, useTRPC } from "@/src/lib/trpc/client/client";
import MainInput from "@/src/ui/components/ui/MainInput";
import { Button } from "@/src/ui/shadcn/components/ui/button";
import type { PendingRegistrationStep } from "..";
import { getPhase } from "../renderable";

const CURRENT: PendingRegistrationStep = "name" as const;

const NamePhase = () => {
  const t = useTranslations();

  const qc = getQueryClient();
  const { data: myData, queryKey } = useMyData();

  const [setCurrent] = useRegistrationStep(useShallow((s) => [s.setCurrent]));
  const { last, next } = getPhase(CURRENT);

  const { translate } = useErrorTranslation();

  const {
    control,
    handleSubmit,
    formState: { isValid },
  } = useForm({
    mode: "onChange",
    resolver: zodResolver(
      z.object({
        name: etzs.string_min_max(1, 255),
      }),
    ),
    defaultValues: {
      name: myData?.name ?? "",
    },
  });

  const { toast } = useHandleQueryError();
  const trpc = useTRPC();
  const { mutate, isPending } = useMutation({
    ...trpc.myData.update.mutationOptions(),

    onError: (err) => {
      toast("failed-user-mutation", err, true);
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
    <form
      className="flex flex-col gap-4 flex-1"
      onSubmit={handleSubmit((data) => {
        if (myData?.name === data.name) {
          return setCurrent(next);
        }

        mutate({
          ...data,
          registrationStep: next,
        });
      })}
    >
      <AuthHeader
        title={t(`registrationStep.${CURRENT}.title`)}
        desc={t(`registrationStep.${CURRENT}.desc`)}
      />

      <div className="flex-1">
        <Controller
          control={control}
          name="name"
          render={({ field, fieldState: state }) => (
            <MainInput
              label="Name"
              placeholder="Asep Soehendar"
              {...field}
              message={
                state?.error?.message
                  ? translate(state?.error?.message)
                  : undefined
              }
              isInvalid={!!state?.error}
              autoComplete="off"
            />
          )}
        />
      </div>

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

        {next && (
          <Button
            type="submit"
            disabled={!isValid || isPending}
            variant={"default"}
          >
            {t("common.continue")}
          </Button>
        )}
      </footer>
    </form>
  );
};

export default NamePhase;
