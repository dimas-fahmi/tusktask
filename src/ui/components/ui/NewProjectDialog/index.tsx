import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import z from "zod";
import { useCreateNewProject } from "@/src/lib/queries/hooks/useCreateNewProject";
import { useNewProjectDialogStore } from "@/src/lib/stores/newProjectDialog";
import { useNotificationStore } from "@/src/lib/stores/notification";
import { Button } from "@/src/ui/shadcn/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/src/ui/shadcn/components/ui/dialog";
import Input from "../Input/input";

const NewProjectDialog = () => {
  const { open, setOpen: onOpenChange } = useNewProjectDialogStore();
  const { triggerToast } = useNotificationStore();

  const {
    control,
    handleSubmit,
    reset,
    formState: { isValid },
  } = useForm({
    resolver: zodResolver(
      z.object({
        projectName: z.string().min(3).max(120),
      }),
    ),
    mode: "onChange",
    defaultValues: {
      projectName: "",
    },
  });

  const { mutate: createNewProject, isPending: isCreatingNewProject } =
    useCreateNewProject();

  useEffect(() => {
    if (!open) {
      reset({ projectName: "" });
    }
  }, [open, reset]);

  return (
    <Dialog {...{ open, onOpenChange }}>
      <DialogContent>
        <DialogHeader className="mb-4">
          <DialogTitle>New Project</DialogTitle>
          <DialogDescription>
            Create new project and organize your tasks
          </DialogDescription>
        </DialogHeader>

        {/* Form */}
        <form
          className="space-y-6"
          onSubmit={handleSubmit((data) => {
            if (!isValid) return;

            createNewProject(
              {
                name: data.projectName,
              },
              {
                onSuccess: () => {
                  triggerToast(
                    "Project Created",
                    {
                      description: `${data.projectName} is created successfully`,
                    },
                    "success",
                  );
                  reset({ projectName: "" });
                  onOpenChange(false);
                },
                onError: () => {
                  triggerToast(
                    "Something Went Wrong",
                    {
                      description:
                        "An error happened when creating your project, please try again!",
                    },
                    "error",
                  );
                },
              },
            );
          })}
        >
          {/* Fields */}
          <div>
            <Controller
              control={control}
              name="projectName"
              render={({ field, fieldState }) => (
                <Input
                  inputProps={{ placeholder: "Project Name", ...field }}
                  messageVariants={{ variant: "negative" }}
                  message={fieldState?.error?.message}
                />
              )}
            />
          </div>

          {/* Footer */}
          <footer className="grid grid-cols-2 gap-2">
            <Button disabled={!isValid || isCreatingNewProject}>
              {isCreatingNewProject ? "Saving" : "Save"}
            </Button>

            <DialogClose asChild>
              <Button variant={"outline"}>Cancel</Button>
            </DialogClose>
          </footer>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NewProjectDialog;
