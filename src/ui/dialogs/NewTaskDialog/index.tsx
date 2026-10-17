"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { IconExclamationCircle, IconHelp, IconPlus } from "@tabler/icons-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { cn } from "cn";
import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useShallow } from "zustand/react/shallow";
import { useErrorTranslation } from "@/src/hooks/useErrorTranslation";
import { useHandleQueryError } from "@/src/hooks/useHandleQueryError";
import { useNewTask } from "@/src/hooks/useNewTask";
import { etzs } from "@/src/i18n/errorTranslation/schema";
import { useTRPC } from "@/src/lib/trpc/client/client";
import { NlDatePicker } from "../../components/ui/NLDatePicker";
import { Button } from "../../shadcn/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../shadcn/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "../../shadcn/components/ui/drawer";
import { Label } from "../../shadcn/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../../shadcn/components/ui/select";
import { useIsMobile } from "../../shadcn/hooks/use-mobile";

const Body = () => {
  const t = useTranslations();
  const { translate } = useErrorTranslation();
  const [data, reset] = useNewTask(useShallow((s) => [s.data, s.reset]));
  const [expand, setExpand] = useState(false);

  const trpc = useTRPC();
  const { toast } = useHandleQueryError();

  const { data: projectsData, isPending: isPendingProjects } = useQuery({
    ...trpc.project.get.queryOptions({}),
  });

  const projects = projectsData ?? [];

  const form = useForm({
    mode: "onChange",
    resolver: zodResolver(etzs.createTaskInput()),
    defaultValues: {
      name: "",
      description: "",
      projectId: data?.projectId ?? "",
      taskCategoryId: data?.taskCategoryId ?? null,
      deadlineAt: null,
      startAt: null,
    },
  });

  const projectId = form.watch("projectId");
  const categoryId = form.watch("taskCategoryId");
  const startAt = form.watch("startAt");
  const deadlineAt = form.watch("deadlineAt");

  const selectedProject = projects.find((p) => p?.id === projectId);

  const { data: selectedProjectData, isPending: isPendingSelectedProject } =
    useQuery({
      ...trpc.project.getProjectDetail.queryOptions({
        id: selectedProject?.id ?? "",
      }),
      enabled: !!selectedProject,
    });

  const categories = selectedProjectData?.taskCategories ?? [];

  const selectedCategory = categories.find((cat) => cat.id === categoryId);

  const { mutate: createTask, isPending: isCreatingTask } = useMutation({
    ...trpc.task.createTask.mutationOptions(),
    onError: (err) => {
      toast("error-creating-task", err, true);
    },
    onSettled: (_d, _err, _var, _omr, ctx) => {
      if (selectedProject) {
        ctx.client.invalidateQueries({
          queryKey: trpc.project.getProjectDetail.queryKey({
            id: selectedProject.id,
          }),
        });
      }

      reset();
    },
  });

  const startTimeBeforeDeadlineError =
    startAt && deadlineAt ? startAt.getTime() > deadlineAt.getTime() : false;

  return (
    <form
      className="flex flex-col gap-4 overflow-hidden max-h-full"
      onSubmit={form.handleSubmit((data) => {
        createTask({
          ...data,
        });
      })}
    >
      {/* Body */}
      <div className="space-y-1.5">
        <Controller
          control={form.control}
          name="name"
          render={({ field }) => (
            <input
              className="text-3xl font-bold outline-0"
              placeholder="Name"
              {...field}
              autoComplete="off"
            />
          )}
        />

        <Controller
          control={form.control}
          name="description"
          render={({ field: { value, ...field } }) => (
            <textarea
              className="w-full resize-none outline-0 field-sizing-content min-h-14 max-h-28 custom-scrollbar"
              placeholder="Description"
              {...field}
              autoComplete="off"
              value={value ?? ""}
            />
          )}
        />
      </div>

      <motion.div
        initial={{ height: 0 }}
        animate={expand ? { height: "auto" } : { height: 0 }}
        transition={{
          duration: 0.5,
          type: "tween",
        }}
        className="max-h-[50vh] overflow-hidden overflow-y-scroll custom-scrollbar px-2"
      >
        <div className="pb-2">
          {/* Project */}
          <div className="grid grid-cols-1 gap-2 mb-4">
            <Label>Project</Label>
            <Select
              defaultValue={null}
              disabled={isPendingProjects}
              value={projectId}
              onValueChange={(data) => {
                if (!data) return;
                form.setValue("projectId", data, { shouldValidate: true });
              }}
            >
              <SelectTrigger className={"w-full"} size="sm">
                <SelectValue>{selectedProject?.name}</SelectValue>
              </SelectTrigger>

              <SelectContent>
                <SelectGroup>
                  <SelectItem value={null} disabled>
                    Select Project
                  </SelectItem>
                  {projects.map((project) => (
                    <SelectItem value={project.id} key={project.id}>
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {/* Categories */}
          <div className="grid grid-cols-1 gap-2 mb-4">
            <Label>Category</Label>
            <Select
              disabled={!selectedProject || isPendingSelectedProject}
              value={categoryId}
              onValueChange={(data) => {
                form.setValue("taskCategoryId", data, {
                  shouldValidate: true,
                });
              }}
            >
              <SelectTrigger size="sm" className={"w-full"}>
                <SelectValue>
                  {selectedCategory?.name ?? "Select Category"}
                </SelectValue>
              </SelectTrigger>

              {selectedProject && (
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Categories</SelectLabel>

                    <SelectItem value={null}>Without Category</SelectItem>

                    {categories?.length ? (
                      categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.name}
                        </SelectItem>
                      ))
                    ) : (
                      <small className="text-center text-xs font-light opacity-50 block py-1">
                        No Category
                      </small>
                    )}
                  </SelectGroup>
                </SelectContent>
              )}
            </Select>
          </div>

          {/* Start At & Deadline At */}
          <div className="grid grid-cols-2 gap-2 mb-4">
            <Controller
              control={form.control}
              name="startAt"
              render={({ fieldState: state }) => (
                <NlDatePicker
                  label="Start At"
                  value={startAt}
                  onValueChange={(date) => {
                    form.clearErrors();
                    form.setValue("startAt", date, {
                      shouldValidate: true,
                    });
                  }}
                  isInvalid={
                    !!state?.error?.message || startTimeBeforeDeadlineError
                  }
                  message={
                    state?.error?.message
                      ? translate(state?.error.message)
                      : undefined
                  }
                />
              )}
            />

            <Controller
              control={form.control}
              name="deadlineAt"
              render={({ fieldState: state }) => (
                <NlDatePicker
                  label="Deadline At"
                  value={deadlineAt}
                  onValueChange={(date) => {
                    form.setValue("deadlineAt", date, {
                      shouldValidate: true,
                    });
                  }}
                  isInvalid={!!state?.error?.message}
                  message={
                    state?.error?.message
                      ? translate(state?.error?.message)
                      : undefined
                  }
                />
              )}
            />
          </div>

          <motion.div
            initial={{ height: 0, marginBottom: "0px" }}
            animate={
              startTimeBeforeDeadlineError
                ? { height: "auto", marginBottom: "16px" }
                : { height: 0, marginBottom: "0px" }
            }
            className="overflow-hidden"
          >
            <p className="p-2 bg-destructive/10 text-xs rounded-md font-light text-destructive flex items-center gap-2">
              <IconExclamationCircle className="w-4 h-4" />
              <span>{t("error.start_before_deadline")}</span>
            </p>
          </motion.div>

          {/* Reminder At */}
          <div className="mb-4">
            <Controller
              control={form.control}
              name="reminderAt"
              render={({ fieldState: state }) => (
                <NlDatePicker
                  label="Reminder"
                  value={form.getValues("reminderAt")}
                  onValueChange={(date) => {
                    form.setValue("reminderAt", date, {
                      shouldValidate: true,
                    });
                  }}
                  isInvalid={!!state.error?.message}
                  message={
                    state?.error?.message
                      ? translate(state.error.message)
                      : undefined
                  }
                />
              )}
            />
          </div>
        </div>

        <div className="flex items-center">
          {/* TODO: Implement tusky pedia */}
          <Button variant={"link"} className={"px-0"} disabled>
            <IconHelp />
            Tusky Pedia
          </Button>
        </div>
      </motion.div>

      {/* FOOTER */}
      <footer className="flex gap-2">
        <motion.div
          animate={expand ? { rotate: 140 } : { rotate: 0 }}
          transition={{
            duration: 0.5,
            type: "spring",
            damping: 8,
          }}
        >
          <Button
            variant={"outline"}
            size={"icon"}
            className={cn("transition-all duration-200")}
            onClick={() => {
              setExpand(!expand);
            }}
          >
            <IconPlus />
          </Button>
        </motion.div>

        <Button
          variant={"outline"}
          className={"flex-1"}
          onClick={() => {
            reset();
          }}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className={"flex-1"}
          disabled={
            isPendingProjects ||
            isPendingSelectedProject ||
            !form.formState.isValid ||
            form.formState.isValidating ||
            isCreatingTask
          }
        >
          Save
        </Button>
      </footer>
    </form>
  );
};

const NewTaskDialog = () => {
  const t = useTranslations();

  const isMobile = useIsMobile();

  const [data, reset] = useNewTask(useShallow((s) => [s.data, s.reset]));

  const [_open, _setOpen] = useState(false);

  const open = _open;

  useEffect(() => {
    if (!data) {
      _setOpen(false);
    } else {
      _setOpen(true);
    }
  }, [data]);

  const onOpenChange = (open: boolean) => {
    if (!open) {
      reset();
      _setOpen(false);
    } else {
      _setOpen(true);
    }
  };

  const title = t("component.NewTaskDialog.title");
  const desc = t("component.NewTaskDialog.desc");

  return isMobile ? (
    <Drawer {...{ open, onOpenChange }}>
      <DrawerContent>
        <DrawerHeader className="sr-only">
          <DrawerTitle>{title}</DrawerTitle>
          <DrawerDescription>{desc}</DrawerDescription>
        </DrawerHeader>

        <Body />
      </DrawerContent>
    </Drawer>
  ) : (
    <Dialog {...{ open, onOpenChange }}>
      <DialogContent className={"min-w-[678px]"}>
        <DialogHeader className="sr-only">
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{desc}</DialogDescription>
        </DialogHeader>

        <Body />
      </DialogContent>
    </Dialog>
  );
};
export default NewTaskDialog;
