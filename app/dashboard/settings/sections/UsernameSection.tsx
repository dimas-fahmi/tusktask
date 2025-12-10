"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import z from "zod";
import { getUsernameAvailability } from "@/src/lib/queries/fetchers/getUsernameAvailability";
import { useGetSelfProfile } from "@/src/lib/queries/hooks/useGetSelfProfile";
import { useUpdateUserProfile } from "@/src/lib/queries/hooks/useUpdateUserProfile";
import { useNotificationStore } from "@/src/lib/stores/notification";
import { usernameSchema } from "@/src/lib/zod";
import Input from "@/src/ui/components/ui/Input/input";
import { Button } from "@/src/ui/shadcn/components/ui/button";
import SectionHeader from "../components/SectionHeader";

const UsernameSection = () => {
  const { data: profile } = useGetSelfProfile();
  const { triggerToast } = useNotificationStore();

  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { isValid },
  } = useForm({
    resolver: zodResolver(
      z.object({
        username: usernameSchema,
      }),
    ),
    mode: "onChange",
    defaultValues: {
      username: "",
    },
  });

  const username = watch("username");

  // Debouncer
  const [usernameKey, setUsernameKey] = useState<string>("");
  const [isTyping, setIsTyping] = useState(false);
  const [isAvailable, setIsAvailable] = useState(false);

  useEffect(() => {
    setIsTyping(true);
    const debouncer = setTimeout(() => {
      if (usernameKey !== username) {
        setUsernameKey(username);
      }
      setIsTyping(false);
    }, 1000);

    return () => clearTimeout(debouncer);
  }, [username, usernameKey]);

  const { data: usernameCheck, isFetching: isCheckingUsername } = useQuery({
    queryKey: [
      "username",
      "availability",
      usernameKey.length > 3 ? usernameKey : "undefined",
    ],
    queryFn: () => getUsernameAvailability({ username: usernameKey }),
    enabled: usernameKey.length > 3 && isValid && !isTyping,
  });

  useEffect(() => {
    if (usernameCheck?.result?.takenById) {
      setIsAvailable(false);
      return;
    }
    setIsAvailable(true);
  }, [usernameCheck]);

  const { mutate: updateProfile, isPending: isUpdating } =
    useUpdateUserProfile();

  const getStatus = () => {
    if (!isValid) return;

    if (usernameKey === profile?.result?.username) {
      return (
        <span className="text-xs text-destructive">
          Already used by yourself
        </span>
      );
    }

    if (isCheckingUsername) {
      return <span className="text-xs">Checking username</span>;
    }

    if (usernameKey.length > 3 && !isCheckingUsername && !isAvailable) {
      return (
        <span className="text-xs text-destructive">Username is taken</span>
      );
    }

    if (usernameKey.length > 3 && !isCheckingUsername && isAvailable) {
      return <span className="text-xs text-success">Username available</span>;
    }
  };

  return (
    <section id="username-section" className="space-y-4">
      {/* Header */}
      <SectionHeader
        title="Unique Username"
        description="Change your username"
      />

      {/* Form */}
      <form
        className="space-y-4"
        onSubmit={handleSubmit((data) => {
          if (
            !isValid ||
            !isAvailable ||
            isCheckingUsername ||
            usernameKey === profile?.result?.username ||
            isUpdating ||
            isTyping
          ) {
            return;
          }

          updateProfile(
            { ...data },
            {
              onSuccess: () => {
                reset({ username: "" });
                triggerToast(
                  "Changes Saved",
                  {
                    description: "Username successfully changed",
                  },
                  "success",
                );
              },
              onError: () => [
                triggerToast(
                  "Something Went Wrong",
                  {
                    description:
                      "Failed to save changes, if issue persist please contact developer.",
                  },
                  "error",
                ),
              ],
            },
          );
        })}
      >
        {/* Field */}
        <div>
          <Controller
            control={control}
            name="username"
            render={({ field, fieldState }) => (
              <Input
                label="Username"
                inputProps={{
                  placeholder: profile?.result?.username ?? "",
                  ...field,
                }}
                message={fieldState?.error?.message ?? ""}
                messageVariants={{ variant: "negative" }}
                labelRight={getStatus()}
              />
            )}
          />
        </div>

        {/* Footer */}
        <footer>
          <Button
            className="block ms-auto"
            disabled={
              !isValid ||
              !isAvailable ||
              isCheckingUsername ||
              usernameKey === profile?.result?.username ||
              isUpdating ||
              isTyping
            }
          >
            {isUpdating ? "Saving" : "Save"}
          </Button>
        </footer>
      </form>
    </section>
  );
};

export default UsernameSection;
