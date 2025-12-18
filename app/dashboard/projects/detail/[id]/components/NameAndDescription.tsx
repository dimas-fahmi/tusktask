import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, motion } from "motion/react"; // Ensure correct import
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import z from "zod";
import type { ProjectType } from "@/src/db/schema/project";
import { queryIndex } from "@/src/lib/queries";
import { useUpdateProject } from "@/src/lib/queries/hooks/useUpdateProject";
import { useNotificationStore } from "@/src/lib/stores/notification";
import type { NotificationMessageType } from "@/src/lib/zod/notification";
import CommitMessageDialog from "@/src/ui/components/ui/CommitMessageDialog";
import Input from "@/src/ui/components/ui/Input/input";
import { Button } from "@/src/ui/shadcn/components/ui/button";
import { Skeleton } from "@/src/ui/shadcn/components/ui/skeleton";

const SkeletonContainer = () => {
  return (
    <div className="space-y-2">
      <Skeleton className="text-4xl h-11 w-72 font-semibold" />
      <div className="space-y-2">
        <Skeleton className="text-sm font-light opacity-70 min-h-4" />
        <Skeleton className="text-sm font-light opacity-70 min-h-4" />
        <Skeleton className="text-sm font-light opacity-70 min-h-4" />
      </div>
    </div>
  );
};

const NameAndDescription = ({ project }: { project?: ProjectType }) => {
  const [editMode, setEditMode] = useState(false);
  const [openCMD, setOpenCMD] = useState(false);

  const {
    control,
    reset,
    watch,
    trigger,
    getValues,
    formState: { isValid },
  } = useForm({
    resolver: zodResolver(
      z.object({
        name: z
          .string()
          .min(3, "Project name is required with 3 characters minimum length"),
        description: z.string().optional(),
      }),
    ),
    mode: "onChange",
    defaultValues: {
      name: project?.name || "",
      description: project?.description || "",
    },
  });

  const name = watch("name");
  const desc = watch("description");

  const { mutate: updateProject, isPending: isUpdatingProject } =
    useUpdateProject();

  useEffect(() => {
    if (!editMode) {
      reset({
        name: project?.name || "",
        description: project?.description || "",
      });
    }
  }, [reset, editMode, project?.name, project?.description]);

  const isTheSame =
    name === (project?.name || "") && desc === (project?.description || "");

  const { triggerToast } = useNotificationStore();

  const queryClient = useQueryClient();
  const query = queryIndex.self.projects({ id: project?.id });

  const handlePreSave = async () => {
    const isValid = await trigger();

    if (isValid) {
      setOpenCMD(true);
    }
  };

  const handleFinalSave = async (data: NotificationMessageType) => {
    if (!project) return;

    try {
      const parentData = getValues();

      updateProject(
        {
          projectId: project.id,
          newValue: {
            name: parentData?.name,
            description: parentData?.description,
          },
          message: data,
        },
        {
          onSuccess: () => {
            triggerToast(
              "Project Updated",
              {
                description: "Successfully updated this project",
              },
              "success",
            );

            queryClient.invalidateQueries({
              queryKey: query.queryKey,
            });

            setOpenCMD(false);
            setEditMode(false);
          },
          onError: () => {
            triggerToast(
              "Something Went Wrong",
              {
                description: "Failed to save changes, please try again.",
              },
              "error",
            );
          },
        },
      );
    } catch (_error) {
      triggerToast(
        "Something Went Wrong",
        {
          description: "Failed to save changes, please try again.",
        },
        "error",
      );
    }
  };

  return !project ? (
    <SkeletonContainer />
  ) : (
    <>
      <AnimatePresence mode="wait">
        {editMode ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Fields */}
            <div className="space-y-2">
              <Controller
                control={control}
                name="name"
                render={({ field, fieldState }) => (
                  <Input
                    className="text-4xl font-semibold font-header"
                    inputProps={{
                      ...field,
                      className:
                        "p-0 h-11 border-0 outline-0 rounded-none not-focus:animate-pulse",
                    }}
                    message={fieldState?.error?.message}
                    messageVariants={{ variant: "negative" }}
                  />
                )}
              />
              <Controller
                control={control}
                name="description"
                render={({ field }) => (
                  <textarea
                    className="resize-none w-full field-sizing-content outline-0 text-sm font-light opacity-70 not-focus:animate-pulse"
                    placeholder="Write something here"
                    {...field}
                  />
                )}
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-2 items-center mt-6" key={"button"}>
              <Button
                type="button"
                disabled={!isValid || isTheSame || isUpdatingProject}
                onClick={() => {
                  handlePreSave();
                }}
              >
                Save
              </Button>
              <Button
                type="button"
                variant={"outline"}
                onClick={() => setEditMode(false)}
              >
                Cancel
              </Button>
            </div>
          </motion.div>
        ) : (
          <motion.button
            type="button"
            className="space-y-2 text-left hover:scale-100 active:scale-100"
            onClick={() => setEditMode(true)}
            key={"view"}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            title="Click to edit"
          >
            <h1 className="text-4xl h-11 font-semibold">{project?.name}</h1>
            <p className="text-sm font-light opacity-70">
              {project?.description || "No description"}
            </p>
          </motion.button>
        )}
      </AnimatePresence>
      <CommitMessageDialog
        open={openCMD}
        isPending={isUpdatingProject}
        onOpenChange={setOpenCMD}
        onConfirm={handleFinalSave}
      />
    </>
  );
};

export default NameAndDescription;
