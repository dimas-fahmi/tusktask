"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Expand, Minimize, Minimize2, Save } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import z from "zod";
import type { V1TaskPostRequest } from "@/app/api/v1/task/post";
import { authClient } from "@/src/lib/auth/client";
import { useCreateNewTask } from "@/src/lib/queries/hooks/useCreateNewTask";
import { useGetSelfProjects } from "@/src/lib/queries/hooks/useGetSelfProjects";
import { useNewTaskDialogStore } from "@/src/lib/stores/newTaskDialog";
import { useNotificationStore } from "@/src/lib/stores/notification";
import { truncateStringByChar } from "@/src/lib/utils/truncateString";
import { Button } from "@/src/ui/shadcn/components/ui/button";
import { Checkbox } from "@/src/ui/shadcn/components/ui/checkbox";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/src/ui/shadcn/components/ui/dialog";
import { Label } from "@/src/ui/shadcn/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/src/ui/shadcn/components/ui/select";
import { DatePicker } from "../DatePicker/v1";
import Input from "../Input/input";
import PrioritySlider from "../PrioritySlider";

export const newTaskSchema = z
  .object({
    name: z.string().min(1, { error: "Task name is required" }),
    description: z.string().optional(),
    priority: z.number().min(0).max(50),
    isPinned: z.boolean(),
    isClaimed: z.boolean(),
    startAt: z.date().optional(),
    endAt: z.date().optional(),
    projectId: z.uuid(),
  })
  .refine(
    (data) => {
      if (data.startAt && data.endAt) {
        return data.startAt.getTime() < data.endAt.getTime();
      }
      return true;
    },
    {
      error: "Start time must happen before end time",
      path: ["startAt"],
    },
  );

const NewTaskDialog = () => {
  // Pull triggers from notification provider
  const { triggerToast } = useNotificationStore();

  // Pull current user session
  const { data: session } = authClient.useSession();
  const user = session?.user;

  // Form
  const formDefaultValues = {
    name: "",
    description: "",
    startAt: undefined,
    endAt: undefined,
    isPinned: false,
    priority: 15,
    isClaimed: false,
    projectId: "",
  } as const;
  const form = useForm({
    resolver: zodResolver(newTaskSchema),
    mode: "onChange",
    defaultValues: formDefaultValues,
  });

  // Advance mode state
  const [advanceMode, setAdvanceMode] = useState(false);

  // Pull values from newTaskDialog store
  const { open, onOpenChange } = useNewTaskDialogStore();

  // Pull projects
  const { data: projectsQuery, isPending: isLoadingProjects } =
    useGetSelfProjects();
  const projects = projectsQuery?.result?.result || [];

  useEffect(() => {
    if (projects?.[0]?.id) {
      form.setValue("projectId", projects?.[0]?.id);
    }
  }, [projects, form.setValue]);

  const startAt = form.watch("startAt");
  const endAt = form.watch("endAt");
  const projectId = form.watch("projectId");
  const activeProject = projects.find((m) => m?.id === projectId);
  const errors = Object.values(form.formState?.errors)
    .map((m) => m.message)
    .filter((m) => m !== undefined);

  // Initialize mutation
  const { mutate: createNewTask, isPending: isCreatingNewTask } =
    useCreateNewTask();

  return (
    <Dialog
      open={open}
      onOpenChange={(e) => {
        form.reset(formDefaultValues);
        if (projects?.[0]?.id) {
          form.setValue("projectId", projects?.[0]?.id);
        }
        onOpenChange(e);
        setAdvanceMode(false);
      }}
    >
      <DialogContent className="p-0 px-4 pb-6 pt-4">
        <DialogHeader className="sr-only">
          <DialogTitle>New Task</DialogTitle>
          <DialogDescription>Create New Task</DialogDescription>
        </DialogHeader>

        {/* Form */}
        <form
          onSubmit={form.handleSubmit((data) => {
            if (!user || !form.formState.isValid || isCreatingNewTask) {
              return;
            }
            const request: V1TaskPostRequest = {
              name: data.name,
              description: data?.description,
              projectId: data.projectId,
              claimedById: data.isClaimed ? user.id : undefined,
              isPinned: data.isPinned,
              startAt: data?.startAt,
              endAt: data?.endAt,
              priority: data.priority,
            };

            onOpenChange(false);
            createNewTask(request, {
              onSuccess: () => {
                triggerToast(
                  "New Task Created",
                  {
                    description: `${data?.name} is created and stored`,
                  },
                  "success",
                );
              },
              onError: (err) => {
                triggerToast(
                  "Failed to Save Task",
                  {
                    description: "Something went wrong when saving this task",
                  },
                  "error",
                );
                console.log(err);
              },
            });
          })}
        >
          {/* Fields */}
          <div>
            {/* Fields [advanceMode=false] */}
            <motion.div
              initial={{ height: "auto" }}
              animate={advanceMode ? { height: 0 } : { height: "auto" }}
              transition={{
                duration: 0.3,
              }}
              className="overflow-hidden p-0"
            >
              <div>
                {/* New Task Name */}
                <Controller
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <Input
                      inputProps={{
                        className:
                          "border-none outline-none p-0 text-4xl font-header font-bold rounded-none h-18",
                        placeholder: "Name",
                        autoComplete: "off",
                        ...field,
                      }}
                    />
                  )}
                />

                {/* New Task Description */}
                <Controller
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <textarea
                      className="border-0 outline-0 resize-none field-sizing-content text-sm font-light opacity-80 p-0 max-h-48 w-full custom-scrollbar min-h-16"
                      placeholder="Description (optional)"
                      {...field}
                    />
                  )}
                />
              </div>
            </motion.div>

            {/* Fields [advanceMode=true] */}
            <motion.div
              initial={{ height: 0 }}
              animate={!advanceMode ? { height: 0 } : { height: "auto" }}
              transition={{
                duration: 0.3,
              }}
              className="overflow-hidden p-0"
            >
              <div className="space-y-4 pt-4">
                <div className="grid grid-cols-2 gap-2">
                  {/* Start At */}
                  <div className="space-y-1">
                    <Label>Start At</Label>
                    <Controller
                      control={form.control}
                      name="startAt"
                      render={({ field }) => (
                        <DatePicker
                          classes={{ triggerClass: "w-full text-xs" }}
                          {...field}
                          onChange={(e) => {
                            form.trigger();
                            field.onChange(e);
                          }}
                          calendarProps={{
                            hidden: endAt ? { after: endAt } : undefined,
                          }}
                        />
                      )}
                    />
                  </div>

                  {/* Finish At */}
                  <div className="space-y-1">
                    <Label>Finish At</Label>
                    <Controller
                      control={form.control}
                      name="endAt"
                      render={({ field }) => (
                        <DatePicker
                          classes={{
                            triggerClass: "w-full text-xs",
                          }}
                          {...field}
                          onChange={(e) => {
                            form.trigger();
                            field.onChange(e);
                          }}
                          calendarProps={{
                            hidden: startAt ? { before: startAt } : undefined,
                          }}
                        />
                      )}
                    />
                  </div>
                </div>

                {/* Priority */}
                <div className="space-y-4 mb-6">
                  <Label>Priority</Label>
                  <Controller
                    control={form.control}
                    name="priority"
                    render={({ field }) => (
                      <PrioritySlider
                        value={[field.value]}
                        onValueChange={(e) => {
                          field.onChange(e?.[0]);
                        }}
                      />
                    )}
                  />
                </div>

                {/* Settings */}
                <div className="space-y-2">
                  {/* Pin */}
                  <div className="flex items-start gap-2 opacity-70 rounded-lg">
                    <Controller
                      control={form.control}
                      name="isPinned"
                      render={({ field }) => (
                        <Checkbox
                          id="pin-task"
                          className="mt-0.5"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      )}
                    />
                    <div className="grid gap-2 text-sm">
                      <label htmlFor="pin-task">Pin This New Task</label>
                    </div>
                  </div>

                  {/* Claim */}
                  <div className="flex items-start gap-2 opacity-70 rounded-lg">
                    <Controller
                      control={form.control}
                      name="isClaimed"
                      render={({ field }) => (
                        <Checkbox
                          id="claim-task"
                          className="mt-0.5"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      )}
                    />
                    <div className="grid gap-2 text-sm">
                      <label htmlFor="claim-task">Claim This New Task</label>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Error Message */}
          <motion.div
            initial={{ height: 0 }}
            animate={errors?.length ? { height: "auto" } : { height: 0 }}
            transition={
              errors?.length
                ? {
                    duration: 0.3,
                    type: "spring",
                    damping: 5,
                  }
                : { duration: 0.3 }
            }
            className="overflow-hidden mt-6"
          >
            <span className="text-xs font-light bg-destructive/15 text-destructive block px-4 py-2 rounded-lg">
              {errors?.[0]}
            </span>
          </motion.div>

          {/* Footer */}
          <footer className="border-t pt-4 flex items-center justify-between">
            {/* Project */}
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant={"outline"}
                size={"sm"}
                className="rounded-full w-9 h-9"
                aria-label="Expand/Minimize advance settings"
                onClick={() => {
                  setAdvanceMode(!advanceMode);
                }}
              >
                {advanceMode ? (
                  <Minimize className="w-5 h-5" />
                ) : (
                  <Expand className="w-5 h-5" />
                )}
              </Button>
              <Select
                onValueChange={(e) => {
                  form.setValue("projectId", e);
                }}
              >
                <SelectTrigger
                  className="text-xs min-w-38 max-w-38 overflow-hidden"
                  disabled={isLoadingProjects}
                >
                  {truncateStringByChar(
                    activeProject ? activeProject?.name : "Select Project",
                    15,
                    true,
                  )}
                </SelectTrigger>
                <SelectContent>
                  {projects.map((project) => (
                    <SelectItem key={project?.id} value={project?.id}>
                      {project?.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <Button
                size={"sm"}
                type="submit"
                aria-label="Save Task"
                className="rounded-full w-9 h-9"
                disabled={!form.formState?.isValid || isCreatingNewTask}
              >
                <Save className="w-5 h-5" />
              </Button>
              <DialogClose asChild>
                <Button
                  type="button"
                  variant={"outline"}
                  size={"sm"}
                  aria-label="Cancel and minimize dialog"
                  className="rounded-full w-9 h-9"
                >
                  <Minimize2 className="w-5 h-5" />
                </Button>
              </DialogClose>
            </div>
          </footer>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NewTaskDialog;
