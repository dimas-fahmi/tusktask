"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import React from "react";
import type { V1TaskGetResponse } from "@/app/api/v1/task/get";
import { deleteTask } from "@/src/lib/serverActions/deleteTask";
import { cn } from "@/src/ui/shadcn/lib/utils";

export type DeleteTaskButtonProps = {
  querykeys?: string[][];
  taskId: string;
} & React.ComponentProps<"button">;

const DeleteTaskButton = React.forwardRef<
  HTMLButtonElement,
  DeleteTaskButtonProps
>(({ taskId, querykeys, className, onClick, ...props }, ref) => {
  const queryClient = useQueryClient();
  const isQueryKeysValid = querykeys && Array.isArray(querykeys);

  const mutation = useMutation({
    mutationFn: deleteTask,
    onMutate: () => {
      if (isQueryKeysValid) {
        querykeys.forEach((qk) => {
          queryClient.cancelQueries({
            queryKey: qk,
          });

          const oldData = queryClient.getQueryData(qk) as V1TaskGetResponse;

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
    },
    onError: (err) => {
      console.log(err);
    },
    onSettled: () => {
      if (isQueryKeysValid) {
        querykeys.forEach((qk) => {
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
