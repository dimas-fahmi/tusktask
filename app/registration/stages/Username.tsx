"use client";

import useRegistrationContext from "@/src/lib/tusktask/hooks/context/useRegistrationContext";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { userSchema } from "@/src/zod/user";
import { useMutation, useQuery } from "@tanstack/react-query";
import fetchUsers from "@/src/lib/tusktask/fetchers/fetchUsers";
import mutateUserData from "@/src/lib/tusktask/mutators/mutateUserData";
import { UsersPatchRequest } from "@/app/api/users/patch";
import { useSession } from "next-auth/react";
import useNotificationContext from "@/src/lib/tusktask/hooks/context/useNotificationContext";
import { Session } from "next-auth";

const Username = () => {
  // pull session
  const { data: session, update } = useSession();

  // Pull datas from registration context
  const { personal, setCanContinue, setOnContinue, setStage } =
    useRegistrationContext();

  // Username availability state
  const [usernameAvailable, setUsernameAvailable] = useState(false);
  const [usernameKey, setUsernameKey] = useState(personal?.username);

  // Initialize form
  const {
    control,
    watch,
    handleSubmit,
    formState: { isValid },
  } = useForm({
    resolver: zodResolver(userSchema.pick({ username: true })),
    mode: "onChange",
    defaultValues: {
      username: personal?.username ?? "",
    },
  });

  // Listen to username changes
  const username = watch("username");

  // Initialize query to check username availability
  const { data, isFetching } = useQuery({
    queryKey: ["users", "username", usernameKey],
    queryFn: async () => {
      return fetchUsers({ username: usernameKey });
    },
    enabled: !!usernameKey,
  });

  // Pull Trigger From Notification context
  const { triggerToast } = useNotificationContext();

  // Mutation
  const { mutate, isPending } = useMutation({
    mutationFn: mutateUserData,
    onMutate: () => {
      update({ user: { registration: "email" } });
      triggerToast({
        type: "default",
        title: "Saving Your Changes",
        description: "We're saving your changes on background",
      });
      setStage("email");
      setCanContinue(false);
    },
    onError: () => {
      setStage("username");
      update({ user: { registration: "username" } });
      setCanContinue(true);
      triggerToast({
        type: "error",
        title: "Something Went Wrong",
        description: "We're failed to save your changes, please try again.",
      });
    },
    onSuccess: () => {
      triggerToast({
        type: "success",
        title: "Changes Saved Successfully",
        description: `Your username now is ${usernameKey}`,
      });
    },
  });

  // Username availability logics
  useEffect(() => {
    if (!isValid) {
      setUsernameAvailable(false);
      return;
    }

    const debouncer = setTimeout(() => {
      setUsernameKey(username);
    }, 800);

    return () => {
      clearTimeout(debouncer);
    };
  }, [username, isValid]);

  useEffect(() => {
    if (isFetching) {
      return;
    }

    if (data?.data && data.data.length === 0) {
      setUsernameAvailable(true);
    } else {
      if (username === personal?.username) {
        setUsernameAvailable(true);
        return;
      } else {
        setUsernameAvailable(false);
      }
    }
  }, [data, isFetching, usernameKey]);

  // Listen to validation
  useEffect(() => {
    setCanContinue(isValid && usernameAvailable && !isPending);

    if (isValid) {
      setOnContinue(() =>
        handleSubmit((data) => {
          const request: UsersPatchRequest = {
            userId: session!.user.id!,
            newValue: {
              username: data.username,
              registration: "email",
            },
          };

          mutate(request);
        })
      );
    }
  }, [username, isValid, usernameAvailable, setOnContinue, isPending]);

  return (
    <div>
      <header>
        <h1 className={`text-2xl font-bold`}>Username</h1>
        <p className={`text-sm text-muted-foreground`}>
          Choose a unique username for yourself; this is how your friends will
          be able to locate you.
        </p>
      </header>
      <div className={"mt-4"}>
        <form>
          <Controller
            control={control}
            name="username"
            render={({ field, fieldState }) => (
              <>
                <input
                  {...field}
                  className={`px-4 py-2 text-sm rounded-md border w-full ${fieldState.error && "text-destructive border-destructive outline-destructive"}`}
                  placeholder={"Username"}
                />
                {fieldState && fieldState.error && fieldState.error.message && (
                  <div
                    className="text-xs text-destructive mt-2"
                    dangerouslySetInnerHTML={{
                      __html: fieldState.error.message,
                    }}
                  />
                )}

                {usernameKey !== personal?.username &&
                  isFetching &&
                  isValid && (
                    <p className="text-xs mt-2">
                      Checking username availability
                    </p>
                  )}

                {usernameAvailable && !isFetching && isValid && (
                  <p className="text-xs mt-2">Username available</p>
                )}
                {!usernameAvailable && !isFetching && isValid && (
                  <p className="text-xs text-destructive mt-2">
                    Username is taken
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

export default Username;
