import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "motion/react"; // Ensure correct import
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import z from "zod";
import type { ProjectType } from "@/src/db/schema/project";
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

  const {
    control,
    handleSubmit,
    reset,
    watch,
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

  useEffect(() => {
    if (!editMode) {
      reset({
        name: project?.name || "",
        description: project?.description || "",
      });
    }
  }, [reset, editMode, project?.name, project?.description]);

  const isTheSame = name === project?.name && desc === project?.description;

  return !project ? (
    <SkeletonContainer />
  ) : (
    <AnimatePresence mode="wait">
      {editMode ? (
        <motion.form
          onSubmit={handleSubmit(() => {})}
          key={"form"}
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
                      "p-0 border-0 outline-0 rounded-none not-focus:animate-pulse",
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
                  {...field}
                />
              )}
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-2 items-center mt-6" key={"button"}>
            <Button type="submit" disabled={!isValid || isTheSame}>
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
        </motion.form>
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
          <h1 className="text-4xl font-semibold">{project?.name}</h1>
          <p className="text-sm font-light opacity-70">
            {project?.description || "No description"}
          </p>
        </motion.button>
      )}
    </AnimatePresence>
  );
};

export default NameAndDescription;
