import { UsersPatchRequest } from "@/app/api/users/patch";
import useNotificationContext from "@/src/lib/tusktask/hooks/context/useNotificationContext";
import usePersonalContext from "@/src/lib/tusktask/hooks/context/usePersonalContext";
import useRegistrationContext from "@/src/lib/tusktask/hooks/context/useRegistrationContext";
import mutateUserData from "@/src/lib/tusktask/mutators/mutateUserData";
import PreferencePanel from "@/src/ui/components/tusktask/prefabs/PreferencePanel";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";

const Preferences = () => {
  const router = useRouter();

  const { personal } = usePersonalContext();

  const { setStage, setCanContinue, setOnContinue } = useRegistrationContext();

  const { control, watch, handleSubmit } = useForm({
    defaultValues: {
      notificationSoundEnable: personal?.notificationSoundEnable,
      reminderSoundEnable: personal?.reminderSoundEnable,
    },
  });

  // watch
  const notification = watch("notificationSoundEnable");
  const reminder = watch("reminderSoundEnable");

  // Pull trigers from notification context
  const { triggerToast } = useNotificationContext();

  // Mutation
  const { mutate } = useMutation({
    mutationKey: ["personal", "update", "preferences"],
    mutationFn: mutateUserData,
    onMutate: () => {
      triggerToast({
        type: "default",
        title: "Saving Changes",
        description: "We're saving your changes on background",
      });
      setStage("loading");
    },
    onError: () => {
      triggerToast({
        type: "error",
        title: "Something Went Wrong",
        description: "Failed to save your changes, please try again.",
      });
      setStage("preferences");
    },
    onSuccess: () => {
      triggerToast({
        type: "success",
        title: "Changes Saved Successfully",
        description:
          "Your preferences is saved and we'll take you to dashboard",
      });
      router.refresh();
    },
  });

  useEffect(() => {
    setCanContinue(true);
    setOnContinue(() =>
      handleSubmit((data) => {
        const request: UsersPatchRequest = {
          userId: personal!.id!,
          newValue: { ...data, registration: "complete" },
        };

        mutate(request);
      })
    );
  }, [notification, reminder]);

  return (
    <div>
      <header>
        <h1 className={`text-2xl font-bold`}>Preferences</h1>
        <p className={`text-sm text-muted-foreground`}>
          You can modify these options now, but don't worry—you can always
          adjust them later in the settings.
        </p>
      </header>
      <div className="mt-4 space-y-3">
        <Controller
          control={control}
          name="notificationSoundEnable"
          render={({ field }) => (
            <PreferencePanel
              title="Notification Sound"
              description="Mute or unmute general notification pings."
              checked={field.value ?? true}
              onCheckedChange={field.onChange}
            />
          )}
        />
        <Controller
          control={control}
          name="reminderSoundEnable"
          render={({ field }) => (
            <PreferencePanel
              title="Reminder Sound"
              description="Toggle alarm sounds for Pomodoro, tasks, and events."
              checked={field.value ?? true}
              onCheckedChange={field.onChange}
            />
          )}
        />
      </div>
    </div>
  );
};

export default Preferences;
