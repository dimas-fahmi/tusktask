"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import React from "react";
import type { V1TaskGetResponse } from "@/app/api/v1/task/get";
import { deleteTask } from "@/src/lib/serverActions/deleteTask";
import { cn } from "@/src/ui/shadcn/lib/utils";
import { useDeleteTaskButton } from "./store";

export type DeleteTaskButtonProps = {
  taskId: string;
} & React.ComponentProps<"button">;

const DeleteTaskButton = React.forwardRef<
  HTMLButtonElement,
  DeleteTaskButtonProps
>(({ taskId, className, onClick, ...props }, ref) => {
  const queryClient = useQueryClient();
  const { registeredKeys: queryKeys } = useDeleteTaskButton();
  const isQueryKeysValid = queryKeys && Array.isArray(queryKeys);

  const mutation = useMutation({
    mutationFn: deleteTask,
    onMutate: () => {
      const trashBin: { queryKey: string[]; oldData: unknown }[] = [];
      if (isQueryKeysValid) {
        queryKeys.forEach((qk) => {
          queryClient.cancelQueries({
            queryKey: qk,
          });

          const oldData = queryClient.getQueryData(qk) as V1TaskGetResponse;
          trashBin.push({ queryKey: qk, oldData: oldData });

          if (oldData) {
            queryClient.setQueryData(qk, (): V1TaskGetResponse => {
              console.log(oldData);
              const collections = oldData?.result?.result;
              const isValid = Array.isArray(collections);

              return {
                ...oldData,
                result: {
                  ...oldData?.result,
                  page: oldData?.result?.page || 1,
                  totalPages: oldData?.result?.page || 1,
                  totalResults: oldData?.result?.page || 0,
                  result: !isValid
                    ? oldData?.result?.result
                    : collections.filter((t) => t.id !== taskId),
                },
              };
            });
          }
        });
      }

      return { trashBin };
    },
    onError: (err, _var, omr) => {
      console.log(err);

      if (omr?.trashBin && Array.isArray(omr?.trashBin)) {
        omr.trashBin.forEach((q) => {
          queryClient.setQueryData(q?.queryKey, q?.oldData);
        });
      }
    },
    onSettled: () => {
      if (isQueryKeysValid) {
        queryKeys.forEach((qk) => {
          queryClient.invalidateQueries({
            queryKey: qk,
          });
        });
      }
    },
  });

  return (
    <button
      ref={ref}
      type="button"
      {...props}
      className={cn("", className)}
      onClick={(e) => {
        onClick?.(e);
        mutation.mutate(taskId);
      }}
    />
  );
});

export default DeleteTaskButton;
