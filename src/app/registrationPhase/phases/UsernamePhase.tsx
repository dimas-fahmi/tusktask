"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { IconCheck } from "@tabler/icons-react";
import { useDebouncedCallback } from "@tanstack/react-pacer";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { type ChangeEvent, useEffect, useState } from "react";
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

const CURRENT: PendingRegistrationStep = "username" as const;

const UsernamePhase = () => {
  const t = useTranslations();

  const trpc = useTRPC();
  const { translate } = useErrorTranslation();
  const { toast } = useHandleQueryError();
  const qc = getQueryClient();
  const { data: myData, queryKey } = useMyData();

  const [setCurrent] = useRegistrationStep(useShallow((s) => [s.setCurrent]));
  const { last, next } = getPhase(CURRENT);

  const {
    control,
    handleSubmit,
    formState: { isValid },
  } = useForm({
    mode: "onChange",
    resolver: zodResolver(
      z.object({
        username: etzs.username(),
      }),
    ),
    defaultValues: {
      username: myData?.username ?? "",
    },
  });

  const [usernameKey, setUsernameKey] = useState("");
  const [isAvailable, setIsAvailable] = useState(true);
  const [isTyping, setIsTyping] = useState(false);

  const usernameQueryDebouncer = useDebouncedCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setIsTyping(false);
      setUsernameKey(e.target.value);

      if (e.target.value === myData?.username) {
        setIsAvailable(true);
      }
    },
    {
      wait: 800,
    },
  );

  const { data: usernameQueryData, isFetching: isCheckingUsername } = useQuery({
    ...trpc.user.get.queryOptions({
      username: usernameKey,
    }),
    enabled: !!usernameKey && isValid,
  });

  useEffect(() => {
    if (usernameKey === myData?.username) {
      return setIsAvailable(true);
    }

    if (usernameQueryData?.length) {
      setIsAvailable(false);
    } else {
      setIsAvailable(true);
    }
  }, [usernameQueryData, myData, usernameKey]);

  const { mutate, isPending: isMutating } = useMutation({
    ...trpc.myData.update.mutationOptions(),

    onError: (err) => {
      toast("username-phase-error-mutation", err);
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

  const getMessage = () => {
    if (isCheckingUsername) {
      return t("common.username_checking");
    }

    if (!isAvailable && !isCheckingUsername) {
      return t("common.username_taken");
    }

    if (isAvailable && !!usernameKey && !isCheckingUsername) {
      return t("common.username_available");
    }
  };

  return (
    <form
      className="flex flex-col gap-4 flex-1"
      onSubmit={handleSubmit((data) => {
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
          name="username"
          render={({ field, fieldState: state }) => (
            <MainInput
              label={t("common.username")}
              placeholder={t("common.placeholders.username")}
              {...field}
              icon={isAvailable ? IconCheck : undefined}
              onChange={(e) => {
                setIsTyping(true);
                field.onChange(e);
                usernameQueryDebouncer(e);
              }}
              message={
                state?.error?.message
                  ? translate(state?.error?.message)
                  : getMessage()
              }
              isInvalid={!!state?.error || (!isAvailable && !isTyping)}
              autoComplete="off"
            />
          )}
        />
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
            type="submit"
            disabled={
              !isValid || isCheckingUsername || isTyping || !isAvailable
            }
            variant={"default"}
          >
            {isMutating ? t("common.saving") : t("common.continue")}
          </Button>
        )}
      </footer>
    </form>
  );
};
export default UsernamePhase;
