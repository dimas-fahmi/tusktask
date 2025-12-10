"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import z from "zod";
import { useGetSelfProfile } from "@/src/lib/queries/hooks/useGetSelfProfile";
import { useUpdateUserProfile } from "@/src/lib/queries/hooks/useUpdateUserProfile";
import { useNotificationStore } from "@/src/lib/stores/notification";
import { useOnboardingStore } from "@/src/lib/stores/onboardingStore";
import { nameSchema } from "@/src/lib/zod";
import Input from "@/src/ui/components/ui/Input/input";
import { Button } from "@/src/ui/shadcn/components/ui/button";

const NamePhase = () => {
  const { setOnboardingPhase } = useOnboardingStore();
  const { data: profileResult, isLoading: isLoadingProfile } =
    useGetSelfProfile();
  const profile = profileResult?.result;
  const { triggerToast } = useNotificationStore();

  const {
    control,
    handleSubmit,
    setValue,

    formState: { isValid },
  } = useForm({
    resolver: zodResolver(
      z.object({
        name: nameSchema,
        firstName: z.string().optional(),
        lastName: z.string().optional(),
      }),
    ),
    mode: "onChange",
    defaultValues: {
      name: "",
      firstName: "",
      lastName: "",
    },
  });

  useEffect(() => {
    if (isLoadingProfile || !profile) return;
    setValue("name", profile?.name ?? "", {
      shouldValidate: true,
    });
    setValue("firstName", profile?.firstName ?? "", {
      shouldValidate: true,
    });
    setValue("lastName", profile?.lastName ?? "", {
      shouldValidate: true,
    });
  }, [isLoadingProfile, profile, setValue]);

  // Mutation
  const { mutate: updateProfile, isPending: isUpdatingProfile } =
    useUpdateUserProfile();

  return (
    <div className="overflow-y-scroll scrollbar-none">
      <form
        onSubmit={handleSubmit((data) => {
          if (
            data?.name === profile?.name &&
            data?.firstName === profile?.firstName &&
            data?.lastName === profile?.lastName
          ) {
            setOnboardingPhase("username");
          } else {
            updateProfile(
              {
                ...data,
                onboardingStatus: "username",
              },
              {
                onSuccess: () => {
                  setOnboardingPhase("username");
                },
                onError: () => {
                  setOnboardingPhase("name");
                  triggerToast(
                    "Failed to Save Changes",
                    {
                      description:
                        "Something went wrong, if issue persist please report to developer.",
                    },
                    "error",
                  );
                },
              },
            );
          }
        })}
      >
        {/* Content */}
        <div className="space-y-4">
          {/* Full Name */}
          <div>
            <Controller
              control={control}
              name="name"
              render={({ field, fieldState }) => (
                <Input
                  label="Display Name"
                  message={
                    fieldState?.error?.message ??
                    `Can be your real name (e.g Jajang Nurdjaman) or creative names like "Jack The Ripper"`
                  }
                  inputProps={{
                    placeholder: "Jajang Nurdjaman",
                    ...field,
                  }}
                  messageVariants={{
                    variant: fieldState?.error ? "negative" : "default",
                  }}
                />
              )}
            />
          </div>

          {/* First & Last Name */}
          <div className="grid grid-cols-2 gap-4">
            <Controller
              control={control}
              name="firstName"
              render={({ field, fieldState }) => (
                <Input
                  label="First Name"
                  message={fieldState?.error?.message ?? `Optional`}
                  messageVariants={{
                    variant: fieldState?.error ? "negative" : "default",
                  }}
                  inputProps={{ placeholder: "Jajang", ...field }}
                />
              )}
            />
            <Controller
              control={control}
              name="lastName"
              render={({ field, fieldState }) => (
                <Input
                  label="Last Name"
                  message={fieldState?.error?.message ?? `Optional`}
                  messageVariants={{
                    variant: fieldState?.error ? "negative" : "default",
                  }}
                  inputProps={{ placeholder: "Nurdjaman", ...field }}
                />
              )}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2">
          <Button type="submit" disabled={!isValid || isUpdatingProfile}>
            {isUpdatingProfile ? "Saving" : "Continue"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default NamePhase;
