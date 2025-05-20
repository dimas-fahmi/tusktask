"use client";

import { UsersPatchRequest } from "@/app/api/users/patch";
import fetchUsers from "@/src/lib/tusktask/fetchers/fetchUsers";
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
  const { data: session } = useSession();

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

  // Mutation
  const { mutate, isPending } = useMutation({
    mutationFn: mutateUserData,
    onMutate: () => {
      setCanContinue(false);
      setStage("avatar");
    },
    onError: () => {
      setCanContinue(true);
      setStage("email");
    },
  });

  // availability logics
  useEffect(() => {
    if (!isValid || isFetching) {
      return;
    }

    const debouncer = setTimeout(() => {
      setEmailKey(email);
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
          We'll send you an email notification to remind you about your tasks
          and events.
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
