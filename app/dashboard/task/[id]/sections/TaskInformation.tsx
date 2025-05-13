"use client";

import { TaskPatchApiRequest } from "@/app/api/tasks/patch";
import { SpecificTask } from "@/app/api/tasks/types";
import useNotificationContext from "@/src/lib/tusktask/hooks/context/useNotificationContext";
import { mutateTaskData } from "@/src/lib/tusktask/mutators/tasks/mutateTaskData";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CircleAlert, Text } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

const descriptionSchema = z.object({
  description: z.string().min(3, "Minimum description is 3 characters"),
});

const TaskInformation = ({ taskData }: { taskData: SpecificTask }) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const formRef = useRef<HTMLFormElement | null>(null);
  const queryClient = useQueryClient();

  const {
    control,
    handleSubmit,
    formState: { isValid, isDirty },
    getValues,
    reset,
  } = useForm({
    resolver: zodResolver(descriptionSchema),
    mode: "onChange",
    defaultValues: {
      description: taskData.description || "",
    },
  });

  const { triggerToast } = useNotificationContext();

  const { mutate } = useMutation({
    mutationFn: mutateTaskData,
    onMutate: async (data) => {
      await queryClient.cancelQueries({ queryKey: ["task", taskData.id] });
      const previousData: any = queryClient.getQueryData(["task", taskData.id]);
      console.log(previousData);
      queryClient.setQueryData(["task", taskData.id], () => {
        return {
          ...previousData,
          data: {
            ...previousData.data,
            description: data.newValue.description,
          },
        };
      });

      return { previousData };
    },
    onError: (_, __, context) => {
      triggerToast({
        type: "error",
        title: "Failed To Save Changes",
        description: "Changes revert as we failed to save your changes!",
      });
      queryClient.setQueryData(["task", taskData.id], context?.previousData);
    },
    onSuccess: () => {
      triggerToast({
        type: "success",
        title: "Changes Saved",
        description: "Description changes saved successfully!",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"], exact: false });
      queryClient.invalidateQueries({ queryKey: ["task", taskData.id] });
    },
  });

  const performUpdate = (data: { description: string }) => {
    const request: TaskPatchApiRequest = {
      taskId: taskData.id,
      newValue: data,
    };

    setIsEditMode(false);
    mutate(request);
  };

  // Auto-save on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (formRef.current && !formRef.current.contains(event.target as Node)) {
        const values = getValues();

        if (isValid && isDirty && values.description !== taskData.description) {
          performUpdate(values);
        } else {
          reset({ description: taskData.description ?? undefined }); // discard changes
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
  }, [
    isEditMode,
    getValues,
    isValid,
    isDirty,
    taskData.description,
    performUpdate,
    reset,
  ]);

  return (
    <section id="taskInformation">
      {!isEditMode && (
        <p
          className="flex items-center gap-2 text-sm text-tt-primary-foreground/70 cursor-pointer"
          onClick={() => {
            setIsEditMode(true);
            triggerToast({
              type: "default",
              title: "Editing Description",
              description:
                "You're now editing the description. Click outside the form to save your changes.",
            });
          }}
          title="Click to edit"
        >
          <Text className="w-4 h-4" />
          {taskData?.description?.length ? taskData.description : "description"}
        </p>
      )}
      {isEditMode && (
        <form
          ref={formRef}
          className="grid grid-cols-1"
          onSubmit={handleSubmit((data) => performUpdate(data))}
        >
          <Controller
            control={control}
            name="description"
            render={({ field }) => (
              <textarea
                rows={3}
                {...field}
                className={`border-0 text-sm block outline-0 ring-0 focus:ring-0 focus:border-0 w-full resize-none field-sizing-content min-h-11 max-h-60 ${isValid ? "" : "text-tt-tertiary underline"}`}
                placeholder="Description (optional)"
                autoFocus
              />
            )}
          />

          <span className="text-xs text-muted-foreground flex items-center gap-1.5">
            <CircleAlert className="w-3 h-3" />
            Click outside this form to save
          </span>
        </form>
      )}
    </section>
  );
};

export default TaskInformation;
