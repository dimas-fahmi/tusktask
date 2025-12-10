"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import z from "zod";
import { useGetSelfProfile } from "@/src/lib/queries/hooks/useGetSelfProfile";
import { useUpdateUserProfile } from "@/src/lib/queries/hooks/useUpdateUserProfile";
import { useNotificationStore } from "@/src/lib/stores/notification";
import { nameSchema } from "@/src/lib/zod";
import Input from "@/src/ui/components/ui/Input/input";
import { Button } from "@/src/ui/shadcn/components/ui/button";
import SectionHeader from "../components/SectionHeader";

const NameSection = () => {
  const { data: profile } = useGetSelfProfile();
  const { triggerToast } = useNotificationStore();

  const {
    control,
    handleSubmit,
    reset,
    watch,
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
      firstName: "",
      lastName: "",
      name: "",
    },
  });

  const name = watch("name");
  const firstName = watch("firstName");
  const lastName = watch("lastName");

  const isIdentical =
    profile?.result?.name === name &&
    profile?.result?.firstName === firstName &&
    profile?.result?.lastName === lastName;

  useEffect(() => {
    if (profile) {
      reset({
        name: profile?.result?.name ?? "",
        firstName: profile?.result?.firstName ?? "",
        lastName: profile?.result?.lastName ?? "",
      });
    }
  }, [profile, reset]);

  const { mutate: updateProfile, isPending: isUpdatingProfile } =
    useUpdateUserProfile();

  return (
    <section id="name-section" className="space-y-4">
      {/* Header */}
      <SectionHeader
        title="Name & Display Name"
        description="Change your name & display name"
      />

      {/* Form */}
      <form
        className="space-y-4"
        onSubmit={handleSubmit((data) => {
          if (!profile?.result || isUpdatingProfile || isIdentical) return;

          updateProfile(
            { ...data },
            {
              onSuccess: () => {
                reset({
                  name: profile?.result?.name ?? "",
                  firstName: profile?.result?.firstName ?? "",
                  lastName: profile?.result?.lastName ?? "",
                });
                triggerToast(
                  "Changes Saved",
                  {
                    description: "All changes is saved successfully",
                  },
                  "success",
                );
              },
              onError: () => {
                triggerToast(
                  "Something Went Wrong",
                  {
                    description:
                      "Failed to save changes, if issue persit please contact developer.",
                  },
                  "error",
                );
              },
            },
          );
        })}
      >
        {/* Fields */}
        <div className="space-y-4">
          <Controller
            control={control}
            name="name"
            render={({ field, fieldState }) => (
              <div>
                <Input
                  label="Display Name"
                  inputProps={{
                    placeholder: profile?.result?.name ?? "",
                    ...field,
                    autoComplete: "off",
                  }}
                  message={fieldState?.error?.message ?? ""}
                  messageVariants={{ variant: "negative" }}
                />
              </div>
            )}
          />

          <div className="grid grid-cols-2 gap-2">
            <Controller
              control={control}
              name="firstName"
              render={({ field, fieldState }) => (
                <Input
                  label="First Name"
                  inputProps={{
                    placeholder: profile?.result?.firstName ?? "",
                    ...field,
                    autoComplete: "off",
                  }}
                  message={fieldState?.error?.message ?? ""}
                  messageVariants={{ variant: "negative" }}
                />
              )}
            />

            <Controller
              control={control}
              name="lastName"
              render={({ field, fieldState }) => (
                <Input
                  label="Last Name"
                  inputProps={{
                    placeholder: profile?.result?.lastName ?? "",
                    ...field,
                    autoComplete: "off",
                  }}
                  message={fieldState?.error?.message ?? ""}
                  messageVariants={{ variant: "negative" }}
                />
              )}
            />
          </div>
        </div>

        {/* Footer */}
        <footer>
          <Button
            className="ms-auto block"
            disabled={!isValid || isUpdatingProfile || isIdentical}
          >
            {isUpdatingProfile ? "Saving" : "Save"}
          </Button>
        </footer>
      </form>
    </section>
  );
};

export default NameSection;
