import { userMutationErrorHandler } from "@/src/lib/tusktask/handlers/userMutationHandlers";
import useNotificationContext from "@/src/lib/tusktask/hooks/context/useNotificationContext";
import useRegistrationFlowContext from "@/src/lib/tusktask/hooks/context/useRegistrationFlowContext";
import { mutateUserData } from "@/src/lib/tusktask/mutators/mutateUserData";
import { UsersPatchApiRequest, UsersPatchApiResponse } from "@/src/types/api";
import { Input } from "@/src/ui/components/shadcn/ui/input";
import { Label } from "@/src/ui/components/shadcn/ui/label";
import AnimatedEntry from "@/src/ui/components/tusktask/animation/AnimatedEntry";
import { personalInformationSchema } from "@/src/zod/personalInformation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

const PersonalPhase = () => {
  // Next Registration Phase
  const next = "email";

  const { triggerToast } = useNotificationContext();

  // Pull session
  const { data: session, update } = useSession();

  // Passed State
  const [active, setActive] = useState(true);

  // Pull setters
  const { setCanContinue, setOnContinue, setLoading } =
    useRegistrationFlowContext();

  // initialize the form
  const {
    control,
    handleSubmit,
    watch,
    formState: { isValid, errors },
  } = useForm({
    resolver: zodResolver(personalInformationSchema),
    mode: "onChange",
    defaultValues: {
      fullName: "",
      firstName: "",
      lastName: "",
    },
  });

  // Listen to all changes
  const fullName = watch("fullName");
  const firstName = watch("firstName");
  const lastName = watch("lastName");

  // initialize Mutation
  const { mutate } = useMutation<
    UsersPatchApiResponse,
    UsersPatchApiResponse,
    UsersPatchApiRequest
  >({
    mutationFn: mutateUserData,
    onSuccess: (data) => {
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
    setCanContinue(isValid);
    if (isValid) {
      setOnContinue(() =>
        handleSubmit((data) => {
          if (!session || !session.user.id) return;
          setLoading(true);
          const request: UsersPatchApiRequest = {
            userId: session.user.id,
            trigger: "personal",
            newValue: {
              name: data.fullName,
              firstName: data.firstName,
              lastName: data.lastName,
              registration: next,
            },
          };

          mutate(request);
        })
      );
    }
  }, [
    setCanContinue,
    setOnContinue,
    setActive,
    isValid,
    errors,
    firstName,
    fullName,
    lastName,
    setLoading,
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
            Tell Us a Bit More
          </h2>
          <p className="text-sm text-tt-primary-foreground/70">
            Just your name—we'll keep it simple and safe!
          </p>
        </header>
        <div className="space-y-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="full_name">Full Name</Label>
            <Controller
              control={control}
              name="fullName"
              render={({ field, fieldState }) => (
                <div className="flex flex-col gap-1">
                  <Input
                    type="text"
                    id="full_name"
                    placeholder="Richard Phillips Feynman"
                    {...field}
                  />
                  {fieldState.error && (
                    <p className="text-tt-tertiary text-xs">
                      {fieldState.error.message}
                    </p>
                  )}
                </div>
              )}
            />
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="first_name">First Name</Label>
              <Controller
                control={control}
                name="firstName"
                render={({ field, fieldState }) => (
                  <div className="flex flex-col gap-1">
                    <Input
                      type="text"
                      id="first_name"
                      placeholder="Richard"
                      {...field}
                    />
                    {fieldState.error && (
                      <p className="text-tt-tertiary text-xs">
                        {fieldState.error.message}
                      </p>
                    )}
                  </div>
                )}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="last_name">Last Name</Label>
              <Controller
                control={control}
                name="lastName"
                render={({ field, fieldState }) => (
                  <div className="flex flex-col gap-1">
                    <Input
                      type="text"
                      id="last_name"
                      placeholder="Feynman"
                      {...field}
                    />
                    {fieldState.error && (
                      <p className="text-tt-tertiary text-xs">
                        {fieldState.error.message}
                      </p>
                    )}
                  </div>
                )}
              />
            </div>
          </div>
        </div>
      </div>
    </AnimatedEntry>
  );
};

export default PersonalPhase;
