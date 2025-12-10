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
import { useOnboardingStore } from "@/src/lib/stores/onboardingStore";
import { usernameSchema } from "@/src/lib/zod";
import Input from "@/src/ui/components/ui/Input/input";
import { Button } from "@/src/ui/shadcn/components/ui/button";

const UsernamePhase = () => {
  const { setOnboardingPhase } = useOnboardingStore();
  const { triggerToast } = useNotificationStore();

  const {
    control,
    setValue,
    watch,
    handleSubmit,
    formState: { isValid },
  } = useForm({
    resolver: zodResolver(z.object({ username: usernameSchema })),
    mode: "onChange",
    defaultValues: {
      username: "",
    },
  });

  const [usernameKey, setUsernameKey] = useState("");
  const [usernameAvailable, setUsernameAvailable] = useState(false);
  const username = watch("username");

  useEffect(() => {
    const debouncer = setTimeout(() => {
      if (isValid && username !== usernameKey) {
        setUsernameKey(username);
      }
    }, 700);

    return () => clearTimeout(debouncer);
  }, [username, usernameKey, isValid]);

  const { data: profileResult, isFetching: isLoadingProfile } =
    useGetSelfProfile();
  const profile = profileResult?.result;

  useEffect(() => {
    if (isLoadingProfile || !profile) return;

    setValue("username", profile?.username ?? "", { shouldValidate: true });
  }, [profile, isLoadingProfile, setValue]);

  const { data: queryAvailabilityResponse, isLoading: isCheckingUsername } =
    useQuery({
      queryKey: ["username", usernameKey],
      queryFn: async () => getUsernameAvailability({ username: usernameKey }),
      enabled: usernameKey?.length > 3 && isValid,
    });
  const queryCheckResult = queryAvailabilityResponse?.result;

  useEffect(() => {
    if (queryCheckResult?.takenById) {
      setUsernameAvailable(false);

      if (queryCheckResult?.isTakenByTheSameAccount) {
        setUsernameAvailable(true);
      }
    } else {
      setUsernameAvailable(true);
    }
  }, [queryCheckResult]);

  const { mutate: updateProfile, isPending: isUpdatingProfile } =
    useUpdateUserProfile();

  return (
    <div>
      <form
        className="space-y-4"
        onSubmit={handleSubmit(({ username }) => {
          if (queryCheckResult?.isTakenByTheSameAccount) {
            setOnboardingPhase("image");
            return;
          }

          updateProfile(
            { username, onboardingStatus: "image" },
            {
              onSuccess: () => {
                setOnboardingPhase("image");
              },
              onError: () => {
                setOnboardingPhase("username");
                triggerToast(
                  "Failed to Save Changes",
                  {
                    description:
                      "Something went wrong, if the issue persist please contact developer",
                  },
                  "error",
                );
              },
            },
          );
        })}
      >
        {/* Content */}
        <div>
          {/* Username */}
          <div>
            <Controller
              control={control}
              name="username"
              render={({ field, fieldState }) => (
                <Input
                  label="Username"
                  message={
                    fieldState?.error?.message ??
                    `Unique username, something like "john-doe" or "janedoe24". Can't start and end with special characters.`
                  }
                  messageVariants={{
                    variant: fieldState?.error ? "negative" : "default",
                  }}
                  inputProps={{ placeholder: "jajang-nurdjaman", ...field }}
                  labelRight={
                    isValid && (
                      <div>
                        <span className="text-xs block text-warning">
                          {isCheckingUsername && "Checking Username"}
                        </span>
                        {!isCheckingUsername && (
                          <>
                            <span className="text-xs block text-success">
                              {usernameAvailable && "Username Available"}
                            </span>
                            <span className="text-xs block text-destructive">
                              {!usernameAvailable && "Username is taken"}
                            </span>
                          </>
                        )}
                      </div>
                    )
                  }
                />
              )}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2">
          <Button
            variant={"outline"}
            type="button"
            onClick={() => setOnboardingPhase("name")}
          >
            Back
          </Button>
          <Button
            type="submit"
            disabled={
              !isValid ||
              isLoadingProfile ||
              isCheckingUsername ||
              !usernameAvailable ||
              isUpdatingProfile
            }
          >
            {isUpdatingProfile ? "Saving" : "Continue"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default UsernamePhase;
