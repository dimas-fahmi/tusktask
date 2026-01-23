"use client";

import { Slot } from "@radix-ui/react-slot";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React from "react";
import type { V1TaskGetResponse } from "@/app/api/v1/task/get";
import { deleteTask } from "@/src/lib/serverActions/deleteTask";
import { useNotificationStore } from "@/src/lib/stores/notification";
import { cn } from "@/src/ui/shadcn/lib/utils";
import { useDeleteTaskButton } from "./store";

export type DeleteTaskButtonProps = {
  taskId: string;
  asChild?: boolean;
} & React.ComponentProps<"button">;

/**
 * Button to delete task, with functional optimistic update as long as you registered the queryKey with the `useDeleteTaskButton().registerKey()`
 *
 * The mutation will only revalidate registered queryKeys, so to prevent stale state do the following:
 *
 * 1. Pull the helper from the store
 * ```
 * import {useDeleteTaskButton} from "@/src/ui/actions/DeleteTaskButton/store"
 * const {registerKey} = useDeleteTaskButton()
 * ```
 *
 * 2. Register the key
 * ```
 * registerKey(["self", "tasks"])
 * ```
 *
 * 3. Use the component as usual
 * ```
 * <DeleteTaskButton taskId={the_id}/>
 * ```
 *
 * or use it with shadcn custom button Component
 * ```
 * <Button asChild>
 *  <DeleteTaskButton taskId={the_id}>
 *    Delete
 *  </DeleteTaskButton>
 * </Button>
 * ```
 *
 * or the other way around
 * ```
 * <DeleteTaskButton taskId={the_id} asChild>
 *  <Button>
 *    Delete
 *  </Button>
 * </DeleteTaskButton>
 * ```
 *
 * Note: the registerKey helper already optimize to make sure uniqueness, if you already registered the exact same key somewhere else it'll just ignore the operation to prevent double operation. So, just add and forget!
 *
 * Additional note: just make sure the result of that queryKey is a valid `v1TaskGetResponse`
 *
 */
const DeleteTaskButton = React.forwardRef<
  HTMLButtonElement,
  DeleteTaskButtonProps
>(({ taskId, className, onClick, asChild, ...props }, ref) => {
  const queryClient = useQueryClient();
  const { registeredKeys: queryKeys } = useDeleteTaskButton();
  const { triggerToast } = useNotificationStore();

  // is queryKeys valid
  const iqkv = queryKeys && Array.isArray(queryKeys);

  const mutation = useMutation({
    mutationFn: deleteTask,
    onMutate: () => {
      if (process.env.NODE_ENV === "development") {
        if (queryKeys?.length) {
          console.log(
            `DeleteTaskButton: Found ${queryKeys.length} registered keys, optimistic deletes will be processed.`,
          );
        } else {
          console.warn(
            "DeleteTaskButton: No registered query keys, optimistic deletes will be skipped.",
          );
        }
      }

      const trashBin = iqkv
        ? queryKeys.map((qk) => {
            queryClient.cancelQueries({ queryKey: qk });

            const oldData = queryClient.getQueryData<V1TaskGetResponse>(qk);

            if (oldData?.result?.result) {
              queryClient.setQueryData<V1TaskGetResponse>(qk, {
                ...oldData,
                result: {
                  ...oldData.result,
                  result: oldData.result.result.filter((t) => t.id !== taskId),
                },
              });

              if (process.env.NODE_ENV === "development") {
                console.log(
                  `DeleteTaskButton: ${JSON.stringify(qk)} is updated by optimistic delete`,
                );
              }
            }

            return { queryKey: qk, oldData };
          })
        : [];

      return { trashBin };
    },
    onError: (err, _var, omr) => {
      console.error(err);

      triggerToast(
        "Something Went Wrong",
        {
          description: "Failed to delete the task, please try again.",
        },
        "error",
      );

      if (omr?.trashBin && Array.isArray(omr?.trashBin)) {
        omr.trashBin.forEach((q) => {
          queryClient.setQueryData(q?.queryKey, q?.oldData);
          if (process.env.NODE_ENV === "development") {
            console.error(
              `DeleteTaskButton: ERROR, ${JSON.stringify(q?.queryKey)} is reverted to its old data.`,
            );
          }
        });
      }
    },
    onSuccess: () => {
      triggerToast(
        "Task Deleted",
        {
          description: "Task is successfully deleted",
        },
        "success",
      );
    },
    onSettled: () => {
      if (iqkv) {
        queryKeys.forEach((qk) => {
          queryClient.invalidateQueries({
            queryKey: qk,
          });
        });
      }
    },
  });

  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      ref={ref}
      type="button"
      {...props}
      className={cn("", className)}
      onClick={(e) => {
        onClick?.(e);
        if (!e.defaultPrevented) {
          mutation.mutate(taskId);
        }
      }}
    />
  );
});

export default DeleteTaskButton;
