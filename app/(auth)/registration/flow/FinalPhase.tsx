import useNotificationContext from "@/src/lib/tusktask/hooks/context/useNotificationContext";
import useRegistrationFlowContext from "@/src/lib/tusktask/hooks/context/useRegistrationFlowContext";
import { mutateUserData } from "@/src/lib/tusktask/mutators/mutateUserData";
import { UsersPatchApiRequest, UsersPatchApiResponse } from "@/src/types/api";
import { Button } from "@/src/ui/components/shadcn/ui/button";
import ToggleInput from "@/src/ui/components/tusktask/inputs/ToggleInput";
import { useMutation } from "@tanstack/react-query";
import { Bell } from "lucide-react";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";

const FinalPhase = () => {
  // Pull Session
  const { data: session, update } = useSession();

  const [type, setType] = useState<"notification" | "reminder">("reminder");

  const { setHideLogOut, setCanContinue, setOnContinue, setLoading } =
    useRegistrationFlowContext();

  // Pull setter from context
  const {
    isRegulated,
    notificationSound,
    reminderSound,
    setNotificationSound,
    setReminderSound,
    triggerToast,
    permissionStatus,
    setIndex,
  } = useNotificationContext();

  // useMutate
  const { mutate } = useMutation<
    UsersPatchApiResponse,
    UsersPatchApiResponse,
    UsersPatchApiRequest
  >({
    mutationFn: mutateUserData,
    onSuccess: async () => {
      triggerToast({
        type: type !== "reminder" ? "default" : "reminder",
        title: "Settings Changed",
        description: "We'll remember your preferences.",
      });

      await update({
        user: {
          notificationSound: notificationSound,
          reminderSound: reminderSound,
        },
      });

      setLoading(false);
    },
    onError: () => {
      triggerToast({
        type: "error",
        title: "Something Went Wrong",
        description: "Please try again, if the issue persist contact support.",
      });
    },
  });

  useEffect(() => {
    setHideLogOut(true);
    setTimeout(() => {
      setCanContinue(true);
      setOnContinue(() => () => {
        setLoading(true);
        mutate({
          userId: session!.user!.id!,
          trigger: "personal",
          newValue: {
            registration: "done",
          },
        });
      });
    }, 1000);
  }, [setCanContinue, setOnContinue, setHideLogOut]);

  return (
    <div className="space-y-4">
      <header>
        <h2 className="text-3xl font-primary font-bold">That's Everything</h2>
        <p className="text-sm text-tt-primary-foreground/70">
          So we glad to have you aboard {session?.user.firstName}, below is a
          configuration you might want to modify.
        </p>
      </header>
      <div className="grid grid-cols-1 gap-3">
        <div className="flex justify-between items-center">
          <span className="text-xs font-semibold">
            {permissionStatus === "default" &&
              "Give us permission to send you notification"}
            {permissionStatus === "denied" &&
              "Oh no, Notifications are blocked"}
            {permissionStatus === "granted" && "Nice, Notifications enabled"}
          </span>
          <Button
            size="sm"
            variant={permissionStatus === "granted" ? "quaternary" : "outline"}
            onClick={async () => {
              if (permissionStatus === "granted") return;

              await Notification.requestPermission();

              setIndex((prev) => prev + 1);
            }}
          >
            {permissionStatus === "granted" ? (
              <>
                <Bell />
              </>
            ) : (
              "Allow"
            )}
          </Button>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs font-semibold">
            Notification Notification Sound
          </span>
          <ToggleInput
            value={notificationSound}
            onClick={() => {
              setType("notification");
              setNotificationSound((prev) => !prev);
              mutate({
                userId: session!.user!.id!,
                trigger: "personal",
                newValue: {
                  notificationSound: !notificationSound,
                },
              });
            }}
            disable={isRegulated}
          />
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs font-semibold">
            Reminder Notification Sound
          </span>
          <ToggleInput
            value={reminderSound}
            onClick={() => {
              setType("reminder");
              setReminderSound((prev) => !prev);
              mutate({
                userId: session!.user!.id!,
                trigger: "personal",
                newValue: {
                  reminderSound: !reminderSound,
                },
              });
            }}
            disable={isRegulated}
          />
        </div>
      </div>
    </div>
  );
};

export default FinalPhase;
