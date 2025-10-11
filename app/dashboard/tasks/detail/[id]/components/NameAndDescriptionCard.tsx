"use client";

import { Button } from "@/src/ui/shadcn/components/ui/button";
import { Card, CardContent } from "@/src/ui/shadcn/components/ui/card";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { motion, Variants } from "motion/react";
import { Pencil, PencilOff } from "lucide-react";
import { TaskApp } from "@/src/lib/types/tasks";
import { newTaskFormSchema } from "@/src/lib/zod/schemas/taskSchema";
import { useUpdateTask } from "@/src/lib/hooks/mutations/useUpdateTasks";

export const motionVariants = {
  hidden: {
    opacity: 0,
    x: 30,
    scale: 0.98,
    filter: "blur(4px)",
    transition: {
      duration: 0.4,
      ease: [0.25, 0.1, 0.25, 1], // standard ease-out
    },
  },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1], // smooth spring-like easing
    },
  },
  exit: {
    opacity: 0,
    x: -20,
    scale: 0.97,
    filter: "blur(3px)",
    transition: {
      duration: 0.35,
      ease: [0.4, 0, 0.2, 1], // smooth ease-in
    },
  },
} satisfies Variants;

const NameAndDescriptionCard = ({ task }: { task?: TaskApp }) => {
  // Edit Mode Status
  const [editMode, setEditMode] = useState(false);

  // Form
  const {
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { isValid },
  } = useForm({
    resolver: zodResolver(
      newTaskFormSchema.pick({ name: true, description: true })
    ),
    mode: "onChange",
    defaultValues: {
      name: task?.name,
      description: task?.description || "",
    },
  });

  useEffect(() => {
    if (task) {
      // No need to set icon, sync below everytime pickedIcon change
      setValue("name", task?.name);
      setValue("description", task?.description || undefined);
    }
  }, [task]);

  // Mutation
  const { mutate: updateTask, isPending: isUpdatingTask } = useUpdateTask([
    "update",
    "task",
    "detail",
  ]);

  useEffect(() => {
    if (!editMode) {
      reset({
        name: task?.name,
        description: task?.description || "",
      });
    }
  }, [editMode]);

  return (
    <>
      <Card>
        <CardContent className="h-full group/card">
          <form
            onSubmit={handleSubmit((data) => {
              if (!isValid || isUpdatingTask) return;
              if (task) {
                updateTask(
                  {
                    old: task,
                    req: {
                      id: task?.id,
                      newValues: {
                        ...data,
                      },
                    },
                  },
                  {
                    onError: () => {
                      setEditMode(true);
                    },
                  }
                );

                setEditMode(false);
              }
            })}
            className="flex flex-col justify-between h-full gap-4"
          >
            <div className="flex flex-col flex-1 overflow-hidden">
              <div className="flex items-center gap-1.5 text-4xl font-header py-2">
                {!editMode ? (
                  <h1
                    onClick={() => {
                      setEditMode(true);
                    }}
                  >
                    {task?.name || "Untitled"}
                  </h1>
                ) : (
                  <Controller
                    control={control}
                    name="name"
                    render={({ field: { value, onChange, ...fieldProps } }) => (
                      <textarea
                        value={value || ""}
                        onChange={onChange}
                        {...fieldProps}
                        className="w-full outline-0 resize-none field-sizing-content max-h-52 scrollbar-none p-4 border rounded-md h-full"
                        placeholder="Project description font-body"
                      />
                    )}
                  />
                )}
              </div>

              {editMode ? (
                <Controller
                  control={control}
                  name="description"
                  render={({
                    field: { value, onChange, name, ...fieldProps },
                  }) => (
                    <textarea
                      value={value || ""}
                      onChange={onChange}
                      name={name}
                      {...fieldProps}
                      className="w-full outline-0 resize-none field-sizing-content max-h-52 scrollbar-none p-4 border rounded-md h-full font-body"
                      placeholder="Project description"
                    />
                  )}
                />
              ) : (
                <p
                  className="text-sm opacity-70 mt-4 font-body"
                  onClick={() => {
                    setEditMode(true);
                  }}
                >
                  {task?.description || "No description"}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <Button
                type="button"
                variant={"outline"}
                onClick={() => {
                  setEditMode(!editMode);
                }}
                className="opacity-0 group-hover/card:opacity-100"
              >
                {!editMode ? <Pencil /> : <PencilOff />}
              </Button>
              <motion.div
                variants={motionVariants}
                animate={editMode ? "visible" : "hidden"}
                className="flex justify-end gap-2"
              >
                <Button
                  type="button"
                  variant={"outline"}
                  onClick={() => {
                    setEditMode(false);
                  }}
                >
                  Cancel
                </Button>
                <Button disabled={!isValid || isUpdatingTask}>Save</Button>
              </motion.div>
            </div>
          </form>
        </CardContent>
      </Card>
    </>
  );
};

export default NameAndDescriptionCard;
