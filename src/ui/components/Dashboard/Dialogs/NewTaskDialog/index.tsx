"use client";

import { Project } from "@/src/db/schema/projects";
import { Task } from "@/src/db/schema/tasks";
import { useFetchUserProjects } from "@/src/lib/hooks/queries/useFetchUserProjects";
import { useTaskStore } from "@/src/lib/stores/ui/taskStore";
import { Button } from "@/src/ui/shadcn/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/src/ui/shadcn/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/src/ui/shadcn/components/ui/select";
import React, { useEffect, useState } from "react";
import { motion, Variants } from "motion/react";
import {
  AlarmClock,
  CircleAlert,
  CircleQuestionMark,
  ClockAlert,
  Loader2Icon,
  Network,
  Save,
  Settings2,
  X,
  Zap,
} from "lucide-react";
import { DatePicker } from "../../../DatePicker";
import { Controller, useForm } from "react-hook-form";
import RenderLucide from "../../../RenderLucide";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  NewTaskFormSchema,
  newTaskFormSchema,
} from "@/src/lib/zod/schemas/taskSchema";
import { useCreateTask } from "@/src/lib/hooks/mutations/useCreateTask";
import { TasksPostRequest } from "@/app/api/tasks/post";
import PriorityButton from "./components/PriorityButton";
import { PRIORITIES } from "@/src/db/schema/configs";
import { formatRelative } from "date-fns";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/src/ui/shadcn/components/ui/tooltip";
import NewTaskHelper from "../../../TooltipContents/NewTaskHelper";
import { queryKeys } from "@/src/lib/utils/queryKeys";
import { DEFAULT_ICON } from "@/src/lib/configs";
import { naturalLanguangeDateParse } from "@/src/lib/utils/naturalLanguageDateParser";

const settingsVariants: Variants = {
  hidden: { transition: { duration: 0.3 }, width: 0 },
  visible: {
    width: "auto",
    transition: { duration: 0.3, ease: "easeOut" },
  },
  exit: { opacity: 0, transition: { duration: 0.3 } },
};

const NewTaskDialog = () => {
  // Pull setters and states from store
  const {
    newTaskDialogOpen,
    setNewTaskDialogOpen,
    activeProject,
    parentTask,
    setActiveProject,
    setParentTask,
    reset: resetStore,
  } = useTaskStore();

  // Error state
  const [error, setError] = useState<string | null>(null);

  // Advance State
  const [advance, setAdvance] = useState(false);

  // Form
  const formDefaultValues = {
    projectId: "",
    name: "",
    description: "",
    priority: "low",
    deadlineAt: undefined,
    reminderAt: undefined,
  } as const;

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { isValid },
  } = useForm<NewTaskFormSchema>({
    resolver: zodResolver(newTaskFormSchema),
    mode: "onChange",
    defaultValues: formDefaultValues,
  });

  // Watch for deadline, reminder and priority
  const name = watch("name");
  const deadline = watch("deadlineAt");
  const reminder = watch("reminderAt");
  const priority = watch("taskPriority");

  // Deadline Manual
  const [isDeadlineSetManually, setIsDeadlineSetManually] = useState(false);

  // Deadline validity
  const [isValidDeadline, setIsValidDeadline] = useState(true);

  useEffect(() => {
    if (deadline) {
      const now = new Date();
      if (now.getTime() > deadline.getTime()) {
        setIsValidDeadline(false);
      } else {
        setIsValidDeadline(true);
      }
    }
  }, [setIsValidDeadline, deadline]);

  useEffect(() => {
    if (isDeadlineSetManually && isValidDeadline) return;

    const { date: pd } = naturalLanguangeDateParse(name);
    if (pd) {
      setValue("deadlineAt", pd);
      setTimeout(() => {
        setIsDeadlineSetManually(false);
      }, 1000);
    } else {
      setValue("deadlineAt", undefined);
      setTimeout(() => {
        setIsDeadlineSetManually(false);
      }, 1000);
    }
  }, [
    name,
    setValue,
    isDeadlineSetManually,
    isValidDeadline,
    setIsDeadlineSetManually,
  ]);

  // Check if reminder is valid
  const isReminderValid =
    reminder && deadline
      ? deadline?.getTime() < reminder?.getTime()
        ? false
        : true
      : true;

  // Listen to isReminderValid to set Error
  useEffect(() => {
    if (!isReminderValid) {
      setError("Provide a valid reminder time prior to deadline date.");
    } else {
      setError(null);
    }
  }, [isReminderValid, setError]);

  // Projects query
  const { data: userProjects } = useFetchUserProjects<
    Array<Project & { tasks: Task[] }>
  >({ queryKey: queryKeys.projects.all });
  const projects = userProjects?.result;

  // Sync task reminder with deadline, set it to undefined if deadline is resetted
  useEffect(() => {
    if (!deadline) {
      setValue("reminderAt", undefined);
    }
  }, [deadline, setValue]);

  // Sync activeProject with form value
  useEffect(() => {
    if (activeProject) {
      setValue("projectId", activeProject?.id);
    }
  }, [activeProject, setValue]);

  // Sync set default active project once projects is fetched
  useEffect(() => {
    if (projects) {
      const find = projects.find((item) => item.projectType === "primary");
      setActiveProject(find);
      setValue("projectId", find?.id || "");
    }
  }, [setValue, projects, setActiveProject]);

  // Render the activeProject icon
  const ActiveProjectIcon = activeProject ? (
    <RenderLucide iconName={activeProject?.icon} />
  ) : (
    <RenderLucide iconName={DEFAULT_ICON} />
  );

  // Mutation
  const { mutate: createTask, isPending: isCreatingTask } = useCreateTask([
    "create",
    "task",
  ]);

  // Reset Handler
  const resetHandler = () => {
    reset(formDefaultValues);
    setTimeout(() => {
      setAdvance(false);
    }, 500);
    setNewTaskDialogOpen(false);
    setIsDeadlineSetManually(false);
    resetStore();
  };

  // OnOpenChange
  useEffect(() => {
    if (!newTaskDialogOpen) {
      resetHandler();
    } else {
      reset(formDefaultValues);
      setValue("projectId", activeProject?.id || "");
    }
  }, [newTaskDialogOpen]);

  return (
    <Dialog open={newTaskDialogOpen} onOpenChange={setNewTaskDialogOpen}>
      <DialogContent
        className={`p-0 bg-card text-card-foreground overflow-hidden w-full`}
      >
        {/* Header [hidden] */}
        <DialogHeader className="sr-only">
          <DialogTitle>New Task</DialogTitle>
          <DialogDescription>Create New Task</DialogDescription>
        </DialogHeader>

        {/* Content */}
        <form
          onSubmit={handleSubmit((data) => {
            const request: TasksPostRequest = {
              newTaskRequest: {
                ...data,
                description: data?.description || undefined,
                parentTask: parentTask ? parentTask?.id : null,
                projectId: parentTask ? parentTask?.projectId : data?.projectId,
              },
            };

            createTask(request, {
              onSuccess: () => {
                resetHandler();
              },
            });
          })}
        >
          {/* Forms Container */}
          <div className="py-4">
            {/* Task Name & Description Form */}
            <motion.div
              initial={{ height: "auto" }}
              animate={advance ? { height: 0 } : { height: "auto" }}
              transition={{
                duration: 0.3,
              }}
              className="overflow-hidden"
            >
              {/* Task Name */}
              <div>
                <Controller
                  control={control}
                  name="name"
                  render={({ field }) => (
                    <input
                      {...field}
                      className="text-4xl font-header outline-0 border-0 px-4 w-full h-full"
                      placeholder="Task Name"
                      autoFocus
                      autoComplete="off"
                    />
                  )}
                />
              </div>

              {/* Task Description */}
              <div>
                <Controller
                  control={control}
                  name="description"
                  render={({ field }) => (
                    <textarea
                      value={field.value || ""}
                      onChange={field.onChange}
                      name="description"
                      className="text-sm opacity-70 field-sizing-content min-h-16 max-h-42 px-4 outline-0 border-0 resize-none w-full scrollbar-none"
                      placeholder="Description (optional)"
                    />
                  )}
                />
              </div>

              {/* Current Settings Bar */}
              <div className="px-4 flex items-center justify-between mt-2 w-full">
                <span className="flex items-center gap-2 max-w-72">
                  {/* Deadline */}
                  <motion.div
                    variants={settingsVariants}
                    animate={deadline ? "visible" : "hidden"}
                    className="overflow-hidden"
                  >
                    <div
                      className={`${isValidDeadline ? "" : "bg-destructive/10 text-destructive"} px-4 py-1 min-w-48 capitalize max-w-48 border rounded-md flex items-center gap-2 text-xs`}
                    >
                      <AlarmClock className="w-4 h-4" />{" "}
                      {deadline
                        ? formatRelative(deadline, new Date())
                        : "Unset"}
                    </div>
                  </motion.div>
                </span>

                <span>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div
                        className={`flex px-2 py-1 bg-muted text-muted-foreground rounded-md items-center gap-1.5 text-xs`}
                      >
                        <CircleQuestionMark className="w-4 h-4" />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <NewTaskHelper />
                    </TooltipContent>
                  </Tooltip>
                </span>
              </div>
            </motion.div>

            {/* Task Advance Settings */}
            <motion.div
              initial={{ height: 0 }}
              animate={advance ? { height: "auto" } : { height: 0 }}
              transition={{
                duration: 0.3,
              }}
              className="overflow-hidden space-y-4"
            >
              {/* Priority */}
              <div className="px-4">
                <h1 className="flex items-center font-header text-xl gap-2 mb-2">
                  <Zap className="w-5 h-5" />
                  Priority
                </h1>

                {/* Container */}
                <div className="grid grid-cols-4 gap-2">
                  {PRIORITIES.map((item, index) => (
                    <PriorityButton
                      key={index}
                      setValue={setValue}
                      value={item}
                      priority={priority}
                    />
                  ))}
                </div>
              </div>

              {/* Deadline */}
              <div className="px-4">
                <h1 className="flex items-center font-header text-xl gap-2 mb-2">
                  <ClockAlert className="w-5 h-5" />
                  Deadline
                </h1>

                {/* Container */}
                <div>
                  <Controller
                    control={control}
                    name="deadlineAt"
                    render={({ field }) => (
                      <DatePicker
                        value={field.value || undefined}
                        onChange={(e) => {
                          field.onChange(e);
                          if (e) {
                            setIsDeadlineSetManually(true);
                          } else {
                            setIsDeadlineSetManually(false);
                          }
                        }}
                        classes={{ triggerClass: "w-full" }}
                        label="Set Deadline"
                        calendarProps={{
                          disabled: {
                            before: new Date(),
                          },
                        }}
                      />
                    )}
                  />
                </div>
              </div>

              {/* Reminder */}
              <div className="px-4">
                <h1 className="flex items-center font-header text-xl gap-2 mb-2">
                  <AlarmClock className="w-5 h-5" />
                  Reminder
                </h1>

                {/* Container */}
                <div>
                  <Controller
                    control={control}
                    name="reminderAt"
                    render={({ field }) => (
                      <DatePicker
                        value={field.value || undefined}
                        onChange={field.onChange}
                        classes={{ triggerClass: "w-full" }}
                        label="Set Reminder"
                        calendarProps={{
                          modifiers: {
                            deadline: deadline || undefined,
                          },
                          modifiersClassNames: {
                            deadline:
                              "bg-destructive text-destructive-foreground rounded-md hover:bg-destructive",
                          },
                          disabled: {
                            before: new Date(),
                            after: deadline || undefined,
                          },
                        }}
                        disabled={!deadline}
                      />
                    )}
                  />
                </div>
              </div>
            </motion.div>

            {/* Error */}
            <motion.div
              initial={{ height: 0 }}
              animate={error ? { height: "auto" } : { height: 0 }}
              transition={{
                duration: 0.3,
              }}
              className="overflow-hidden"
            >
              {/* Wrapper */}
              <div className="px-4 mt-4">
                <div className="text-xs bg-destructive/20 flex items-center gap-2 p-2 rounded-md text-destructive">
                  <CircleAlert />
                  {error}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Footer */}
          <footer className="flex items-center justify-between p-4 border-t">
            {/* Project Select */}
            <div className="flex gap-1.5">
              <Button
                type="button"
                variant={advance ? "default" : "outline"}
                onClick={() => {
                  setAdvance(!advance);
                }}
              >
                <Settings2 />
              </Button>
              {parentTask ? (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <motion.div
                      variants={settingsVariants}
                      animate={parentTask ? "visible" : "hidden"}
                      className="overflow-hidden"
                    >
                      <div
                        className={`${isValidDeadline ? "" : "bg-destructive/10 text-destructive"} px-4 py-1 min-w-55 max-w-55 h-full border rounded-md flex items-center justify-between gap-2 text-xs capitalize`}
                      >
                        <span className="flex items-center gap-2">
                          <Network className="max-h-4 max-w-4 min-w-4 min-h-4" />
                          <span className="truncate max-w-28">
                            {parentTask?.name}
                          </span>
                        </span>
                        <button
                          type="button"
                          className="cursor-pointer"
                          onClick={() => setParentTask(null)}
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </motion.div>
                  </TooltipTrigger>
                  <TooltipContent>{parentTask?.name}</TooltipContent>
                </Tooltip>
              ) : (
                <Select
                  value={activeProject?.id || ""}
                  onValueChange={(id) => {
                    const find = projects?.find((item) => item.id === id);
                    setActiveProject(find);
                  }}
                >
                  <SelectTrigger className="max-w-34 min-w-34 text-xs">
                    <SelectValue placeholder={"Project"}>
                      {ActiveProjectIcon} {activeProject?.name}
                    </SelectValue>
                  </SelectTrigger>

                  <SelectContent className="text-xs">
                    <SelectGroup>
                      <SelectLabel>Projects</SelectLabel>
                      {projects &&
                        Array.isArray(projects) &&
                        projects.map((item) => (
                          <SelectItem key={item.id} value={item.id}>
                            <RenderLucide iconName={item?.icon} /> {item.name}
                          </SelectItem>
                        ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            </div>

            {/* Controller */}
            <div className="flex gap-2 items-center">
              <Button
                className="hidden md:block"
                type="button"
                variant={"outline"}
                onClick={() => {
                  resetHandler();
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={
                  !isValid ||
                  !isReminderValid ||
                  isCreatingTask ||
                  (!isValidDeadline && deadline ? true : false)
                }
              >
                {isCreatingTask ? (
                  <>
                    <Loader2Icon className="animate-spin" />
                    Saving
                  </>
                ) : (
                  <>
                    <Save />
                    Save
                  </>
                )}
              </Button>
            </div>
          </footer>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NewTaskDialog;
