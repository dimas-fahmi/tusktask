import { TaskPatchApiRequest } from "@/app/api/tasks/patch";
import { SpecificTask } from "@/app/api/tasks/types";
import useNotificationContext from "@/src/lib/tusktask/hooks/context/useNotificationContext";
import { mutateTaskData } from "@/src/lib/tusktask/mutators/tasks/mutateTaskData";
import TaskCheckButton from "@/src/ui/components/tusktask/buttons/TaskCheckButton";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CircleAlert } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

const titleSchema = z.object({
  name: z.string().min(3),
});

const TaskTitle = ({ taskData }: { taskData: SpecificTask }) => {
  // Edit Mode State
  const [isEditMode, setIsEditMode] = useState(false);

  // Initialize Form
  const {
    control,
    handleSubmit,
    getValues,
    formState: { isValid, isDirty },
    reset,
  } = useForm({
    resolver: zodResolver(titleSchema),
    mode: "onChange",
    defaultValues: {
      name: taskData.name,
    },
  });

  //   Pull query client
  const queryClient = useQueryClient();

  //   Mutators
  const { mutate, isPending } = useMutation({
    mutationFn: mutateTaskData,
    onMutate: async (data) => {
      // Cancel existing queries
      queryClient.cancelQueries({
        queryKey: ["task", taskData.id],
      });

      //   Preserve previous data
      const previousData: any = queryClient.getQueryData(["task", taskData.id]);

      //   Optimistic Update
      queryClient.setQueryData(["task", taskData.id], () => {
        return {
          ...previousData,
          data: {
            ...previousData.data,
            name: data.newValue.name,
          },
        };
      });

      //  Return to context
      return { previousData };
    },
    onError: (_, __, context) => {
      queryClient.setQueryData(["task", taskData.id], context?.previousData);

      triggerToast({
        type: "error",
        title: "Failed To Save Changes",
        description: "Changes reverted as we can't save your changes",
      });
    },
    onSuccess: () => {
      triggerToast({
        type: "success",
        title: "Changes Saved",
        description: "Name is successfully updated",
      });
    },
    onSettled: () => {
      reset();
      setIsEditMode(false);
      queryClient.invalidateQueries({
        queryKey: ["tasks"],
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: ["task", taskData.id],
      });
    },
  });

  //   Form Ref
  const formRef = useRef<HTMLFormElement | null>(null);

  //   Updater
  const performUpdate = (data: { name: string }) => {
    const request: TaskPatchApiRequest = {
      taskId: taskData.id,
      newValue: data,
    };

    mutate(request);
  };

  //  Core Logics
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (formRef && !formRef.current?.contains(event.target as Node)) {
        const values = getValues();

        if (isValid && isDirty && values.name !== taskData.name) {
          performUpdate(values);
        } else {
          reset();
          setIsEditMode(false);
        }
      }
    };

    if (isEditMode) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isValid, isDirty, getValues, taskData.name, reset, isEditMode]);

  //   Pull Trigger From Notification context
  const { triggerToast } = useNotificationContext();

  return (
    <>
      <h1
        className="flex items-center gap-2 text-lg md:text-3xl font-bold text-tt-primary-foreground/80 capitalize"
        title="Click to edit"
        onClick={() => {
          setIsEditMode(true);
          triggerToast({
            type: "default",
            title: "Editing Task Name",
            description:
              "You're now editing the name of this task. Click outside the form to save your changes.",
          });
        }}
      >
        <TaskCheckButton
          taskId={taskData?.id ?? ""}
          completedAt={taskData?.completedAt}
        />
        {!isEditMode && taskData?.name}
        {isEditMode && (
          <form ref={formRef}>
            <Controller
              control={control}
              name="name"
              render={({ field }) => (
                <input
                  {...field}
                  autoFocus
                  className={`${isValid ? "" : "border-tt-tertiary outline-tt-tertiary text-tt-tertiary"}`}
                />
              )}
            />
          </form>
        )}
      </h1>
      {isEditMode && (
        <span className="text-xs text-muted-foreground flex items-center gap-1.5">
          <CircleAlert className="w-3 h-3" />
          Click outside this form to save
        </span>
      )}
    </>
  );
};

export default TaskTitle;
