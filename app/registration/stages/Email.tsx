"use client";

import { UsersPatchRequest } from "@/app/api/users/patch";
import fetchUsers from "@/src/lib/tusktask/fetchers/fetchUsers";
import useNotificationContext from "@/src/lib/tusktask/hooks/context/useNotificationContext";
import useRegistrationContext from "@/src/lib/tusktask/hooks/context/useRegistrationContext";
import mutateUserData from "@/src/lib/tusktask/mutators/mutateUserData";
import { userSchema } from "@/src/zod/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

const Email = () => {
  // Pull session
  const { data: session, update } = useSession();

  // Pull datas and setters from registration context
  const { personal, setCanContinue, setOnContinue, setStage } =
    useRegistrationContext();

  // Email availability states
  const [emailKey, setEmailKey] = useState(personal?.email);
  const [emailAvailable, setEmailAvailable] = useState(false);

  // Form
  const {
    control,
    watch,
    handleSubmit,
    formState: { isValid },
  } = useForm({
    resolver: zodResolver(userSchema.pick({ email: true })),
    mode: "onChange",
    defaultValues: {
      email: personal?.email ?? "",
    },
  });

  // listen to email form
  const email = watch("email");

  // Query
  const { data, isFetching } = useQuery({
    queryKey: ["users", "email", emailKey],
    queryFn: async () => {
      return fetchUsers({ email: emailKey! });
    },
    enabled: !!emailKey,
  });

  // Pull Triggers from notification context
  const { triggerToast } = useNotificationContext();

  // Mutation
  const { mutate, isPending } = useMutation({
    mutationFn: mutateUserData,
    onMutate: () => {
      update({ user: { registration: "avatar" } });
      triggerToast({
        type: "default",
        title: "Saving Your Changes",
        description: "We're saving your changes on background",
      });
      setCanContinue(false);
      setStage("avatar");
    },
    onError: () => {
      update({ user: { registration: "email" } });
      triggerToast({
        type: "error",
        title: "Something Went Wrong",
        description: "We're failed to save your changes, please try again.",
      });
      setCanContinue(true);
      setStage("email");
    },
    onSuccess: () => {
      triggerToast({
        type: "success",
        title: "Changes Saved Successfully",
        description: `Your email is set to ${emailKey}`,
      });
    },
  });

  // availability logics
  useEffect(() => {
    if (!isValid || isFetching) {
      return;
    }

    const debouncer = setTimeout(() => {
      if (email) {
        setEmailKey(email);
      }
    }, 800);

    return () => {
      clearTimeout(debouncer);
    };
  }, [email, isValid, isFetching]);

  useEffect(() => {
    if (data?.data && data.data.length === 0) {
      setEmailAvailable(true);
    } else {
      if (personal?.email === emailKey) {
        setEmailAvailable(true);
      } else {
        setEmailAvailable(false);
      }
    }
  }, [data, emailKey, isFetching]);

  // Listen to validation
  useEffect(() => {
    setCanContinue(isValid && emailAvailable && !isFetching);

    if (isValid && emailAvailable && !isFetching && !isPending) {
      setOnContinue(() =>
        handleSubmit((data) => {
          if (!data?.email) return;

          const request: UsersPatchRequest = {
            userId: session!.user.id!,
            newValue: {
              email: data.email,
              registration: "avatar",
            },
          };

          mutate(request);
        })
      );
    }
  }, [
    email,
    emailKey,
    isFetching,
    emailAvailable,
    isValid,
    setCanContinue,
    setOnContinue,
    isPending,
  ]);

  return (
    <div>
      <header>
        <h1 className={`text-2xl font-bold`}>Email</h1>
        <p className={`text-sm text-muted-foreground`}>
          We'll drop you an email reminder about your tasks and events.
        </p>
      </header>
      <div className="mt-4">
        <form>
          <Controller
            control={control}
            name="email"
            render={({ field: { value, ...fieldProps }, fieldState }) => (
              <>
                <input
                  {...fieldProps}
                  value={value ?? ""}
                  className={`px-4 py-2 text-sm rounded-md border w-full ${fieldState.error && "text-destructive border-destructive outline-destructive"}`}
                  placeholder={"Email address"}
                />

                {fieldState && fieldState.error && fieldState.error.message && (
                  <div
                    className="text-xs text-destructive mt-2"
                    dangerouslySetInnerHTML={{
                      __html: fieldState.error.message,
                    }}
                  />
                )}

                {emailKey !== personal?.email && isFetching && isValid && (
                  <p className="text-xs mt-2">Checking email availability</p>
                )}

                {emailAvailable && !isFetching && isValid && (
                  <p className="text-xs mt-2">Email available</p>
                )}
                {!emailAvailable && !isFetching && isValid && (
                  <p className="text-xs text-destructive mt-2">
                    Email is taken
                  </p>
                )}
              </>
            )}
          />
        </form>
      </div>
    </div>
  );
};

export default Email;
