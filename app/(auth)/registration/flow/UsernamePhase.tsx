import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { zodResolver } from "@hookform/resolvers/zod";

import { UserType } from "@/src/db/schema/users";
import { checkUserNameAvailability } from "@/src/lib/tusktask/fetchers/checkUserNameAvailability";
import useRegistrationFlowContext from "@/src/lib/tusktask/hooks/context/useRegistrationFlowContext";
import { UsernameGetApiResponse, UsersPatchApiRequest } from "@/src/types/api";
import { Input } from "@/src/ui/components/shadcn/ui/input";
import AnimatedEntry from "@/src/ui/components/tusktask/animation/AnimatedEntry";
import { userNameSchema } from "@/src/zod/userName";
import { mutateUserData } from "@/src/lib/tusktask/mutators/mutateUserData";
import { userMutationErrorHandler } from "@/src/lib/tusktask/handlers/userMutationHandlers";
import useNotificationContext from "@/src/lib/tusktask/hooks/context/useNotificationContext";

const UsernamePhase = () => {
  const next: UserType["registration"] = "avatar";

  const { triggerToast } = useNotificationContext();

  // Local state management
  const [active, setActive] = useState(true);
  const [isAvailable, setIsAvailable] = useState(false);
  const [userNameKey, setUserNameKey] = useState("");

  // Registration flow context functions
  const { setCanContinue, setOnContinue, setLoading } =
    useRegistrationFlowContext();

  // Retrieve user session
  const { data: session, update } = useSession();

  // React Hook Form setup using Zod validation
  const {
    control,
    watch,
    setValue,
    handleSubmit,
    formState: { isValid },
  } = useForm({
    resolver: zodResolver(userNameSchema),
    mode: "onChange",
    defaultValues: { userName: "" },
  });

  // Watch the username input value
  const userName = watch("userName");

  // Debounce username input and update userNameKey after 600ms of inactivity
  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      if (isValid) {
        setUserNameKey(userName);
      }
    }, 600);

    return () => clearTimeout(debounceTimeout);
  }, [userName, isValid]);

  // Set the default form value from the session
  useEffect(() => {
    if (session?.user) {
      setValue("userName", session.user.userName, { shouldValidate: true });
    }
  }, [session, setValue]);

  // Query to check username availability when userNameKey is updated
  const { data, isFetching, error } = useQuery<
    UsernameGetApiResponse,
    UsernameGetApiResponse
  >({
    queryKey: ["username", "lookup", userNameKey],
    queryFn: () =>
      checkUserNameAvailability({
        userId: session!.user!.id!,
        userName: userNameKey,
      }),
    enabled: !!userNameKey,
  });

  // Update username availability based on query results or session's current username
  useEffect(() => {
    if (!session?.user) return;

    if (session.user.userName === userNameKey) {
      setIsAvailable(true);
      return;
    }

    setIsAvailable(!error && data?.message === "username_available");
  }, [data, userNameKey, isFetching, error, session]);

  // Mutation for updating user data
  const { mutate } = useMutation({
    mutationFn: mutateUserData,
    onSuccess: () => {
      triggerToast({
        type: "success",
        title: "Success",
        duration: 10000,
        description: "Thank you, we'll take you to the next step.",
      });
      setLoading(false);
      setCanContinue(false);
      setTimeout(async () => {
        setActive(false);
        await update({ user: { registration: next } });
      }, 1000);
    },
    onError: (errorData) => {
      userMutationErrorHandler({ data: errorData, setLoading });
    },
  });

  // Enable or disable the continue action based on validation and availability;
  // set up the handler for continuing to the next phase.
  useEffect(() => {
    const canProceed = isValid && isAvailable;
    setCanContinue(canProceed);

    if (canProceed) {
      setOnContinue(() =>
        handleSubmit((formData) => {
          setLoading(true);
          console.log("Submitted data:", formData);

          const request: UsersPatchApiRequest = {
            userId: session!.user!.id!,
            trigger: "personal",
            newValue: {
              userName: formData.userName,
              registration: next,
            },
          };

          mutate(request);
        })
      );
    }
  }, [
    isValid,
    isAvailable,
    setCanContinue,
    setOnContinue,
    setLoading,
    handleSubmit,
    mutate,
    session,
    next,
  ]);

  return (
    <AnimatedEntry
      origin="right"
      delay={0.5}
      speed={1}
      trigger={active}
      destination="left"
      outSpeed={1}
    >
      <div className="space-y-6 transition-all duration-700">
        <header>
          <h2 className="text-3xl font-primary font-bold">
            Pick Your Username
          </h2>
          <p className="text-sm text-tt-primary-foreground/70">
            Choose something fun—it’s how you’ll shine here!
          </p>
        </header>
        <div>
          <Controller
            control={control}
            name="userName"
            render={({ field, fieldState }) => (
              <div className="space-y-1.5">
                <Input type="text" id="username" {...field} />
                {fieldState.error && (
                  <p className="text-tt-tertiary text-xs">
                    {fieldState.error.message}
                  </p>
                )}
                {isFetching && userNameKey && isValid && (
                  <p className="text-xs">Checking username availability...</p>
                )}
                {!isFetching && isValid && isAvailable && (
                  <p className="text-tt-quaternary text-xs">
                    Username available
                  </p>
                )}
                {!isFetching && isValid && !isAvailable && (
                  <p className="text-tt-tertiary text-xs">
                    Username unavailable
                  </p>
                )}
              </div>
            )}
          />
        </div>
      </div>
    </AnimatedEntry>
  );
};

export default UsernamePhase;
