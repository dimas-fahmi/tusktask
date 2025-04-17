import { UserType } from "@/src/db/schema/users";
import { checkEmailAvailability } from "@/src/lib/tusktask/fetchers/checkEmailAvailability";
import { userMutationErrorHandler } from "@/src/lib/tusktask/handlers/userMutationHandlers";
import useNotificationContext from "@/src/lib/tusktask/hooks/context/useNotificationContext";
import useRegistrationFlowContext from "@/src/lib/tusktask/hooks/context/useRegistrationFlowContext";
import { mutateUserData } from "@/src/lib/tusktask/mutators/mutateUserData";
import { mutateUserEmail } from "@/src/lib/tusktask/mutators/mutateUserEmail";
import {
  EmailGetApiResponse,
  EmailPatchApiResponse,
  EmailPatchRequest,
} from "@/src/types/api";
import { Input } from "@/src/ui/components/shadcn/ui/input";
import AnimatedEntry from "@/src/ui/components/tusktask/animation/AnimatedEntry";
import { emailSchema } from "@/src/zod/email";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

const EmailPhase = () => {
  // Next Phase
  const next: UserType["registration"] = "username";

  // Pull Session
  const { data: session, update } = useSession();

  const { triggerToast } = useNotificationContext();

  // Pull setters from context
  const { setCanContinue, setLoading, setOnContinue } =
    useRegistrationFlowContext();

  // Active State
  const [active, setActive] = useState(true);

  // Email Availability
  const [emailAvailable, setEmailAvailable] = useState(false);
  const [emailKey, setEmailKey] = useState("");

  // Initialize Form
  const {
    control,
    watch,
    formState: { isValid },
    handleSubmit,
    setValue,
  } = useForm({
    resolver: zodResolver(emailSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
    },
  });

  // Initialize query
  const { data, isFetching, error } = useQuery<
    EmailGetApiResponse,
    EmailGetApiResponse
  >({
    queryKey: ["email", "lookup", emailKey],
    queryFn: () =>
      checkEmailAvailability({
        userId: session!.user!.id!,
        email: emailKey,
      }),
    enabled: !!emailKey,
  });

  // SetDefaultValue
  useEffect(() => {
    if (!session || !session.user || !session.user.email) return;

    setValue("email", session.user.email, { shouldValidate: true });
  }, [session, setValue]);

  // Listen to every changes
  const email = watch("email");

  // Debounce
  useEffect(() => {
    const debounce = setTimeout(() => {
      if (isValid) {
        setEmailKey(email);
      }
    }, 600);

    return () => clearTimeout(debounce);
  }, [email, isValid]);

  // Listen To data
  useEffect(() => {
    if (error) {
      setEmailAvailable(false);
    }

    if (data) {
      if (data.message === "email_available") {
        setEmailAvailable(true);
      } else {
        setEmailAvailable(false);
      }
    }
  }, [data, error, session]);

  // Initialize mutation
  const { mutate } = useMutation<
    EmailPatchApiResponse,
    EmailPatchApiResponse,
    EmailPatchRequest
  >({
    mutationFn: mutateUserEmail,
    onSuccess: async (data) => {
      triggerToast({
        type: "success",
        title: "Success",
        duration: 10000,
        description: "Thank you, we'll take you to the next step.",
      });
      setLoading(false);
      setTimeout(async () => {
        setActive(false);
        setCanContinue(false);
        await mutateUserData({
          userId: session!.user!.id!,
          trigger: "personal",
          newValue: {
            registration: next,
          },
        });
        await update({
          user: {
            registration: next,
          },
        });
      }, 1000);
    },
    onError: (data) => {
      userMutationErrorHandler({ data, setLoading });
    },
  });

  // Listen to changes and validation
  useEffect(() => {
    if (!isValid || !emailAvailable) {
      setCanContinue(false);
    }

    setTimeout(() => {
      setCanContinue(isValid && emailAvailable);
    }, 1000);

    if (isValid) {
      setOnContinue(() =>
        handleSubmit((data) => {
          if (!session || !session.user.id) return;
          setLoading(true);
          const email = data.email;
          const request: EmailPatchRequest = {
            userId: session?.user.id,
            email: email,
          };

          mutate(request);
        })
      );
    }
  }, [
    emailAvailable,
    setCanContinue,
    setLoading,
    setOnContinue,
    isValid,
    email,
    setActive,
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
      <div className={`space-y-6 transition-all duration-700`}>
        <header>
          <h2 className="text-3xl font-primary font-bold">
            Your Email, Your Call
          </h2>
          <p className="text-sm text-tt-primary-foreground/70">
            Stick with what you’ve got or set up a new one—totally up to you!
          </p>
        </header>
        <div>
          <Controller
            control={control}
            name="email"
            render={({ fieldState, field }) => (
              <div className="flex flex-col gap-0.5">
                <Input type="email" id="email" {...field} />
                {fieldState.error && (
                  <p className="text-tt-tertiary text-xs">
                    {fieldState.error.message}
                  </p>
                )}

                {isFetching && emailKey.length > 5 && isValid && (
                  <p className="text-tt-primary-foreground text-xs">
                    Checking email availability
                  </p>
                )}

                {!isFetching &&
                  emailKey.length > 5 &&
                  data &&
                  emailAvailable &&
                  email &&
                  isValid && (
                    <p className="text-tt-quaternary text-xs">
                      Email Available
                    </p>
                  )}

                {!isFetching &&
                  emailKey.length > 5 &&
                  data &&
                  !emailAvailable &&
                  email &&
                  isValid && (
                    <p className="text-tt-tertiary text-xs">
                      Email is not available
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

export default EmailPhase;
