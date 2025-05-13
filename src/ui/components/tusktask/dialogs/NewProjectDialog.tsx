import React, { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../shadcn/ui/dialog";
import { Button } from "../../shadcn/ui/button";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { projectSchema } from "@/src/zod/projectSchema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createNewProject } from "@/src/lib/tusktask/mutators/creators/createNewProject";
import { ProjectInsertType } from "@/src/db/schema/projects";

export interface NewProjectDialogProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const NewProjectDialog = ({ open, setOpen }: NewProjectDialogProps) => {
  // Initialize form
  const { control, handleSubmit, formState, watch, reset } = useForm({
    resolver: zodResolver(projectSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const name = watch("name");

  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: createNewProject,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["projects"],
        exact: false,
      });
      reset();
      setOpen(false);
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader className="sr-only">
          <DialogTitle>Create A New Project</DialogTitle>
          <DialogDescription>A Dialog to create a new task</DialogDescription>
        </DialogHeader>
        <form
          onSubmit={handleSubmit((data) => {
            const request: Omit<ProjectInsertType, "ownerId"> = {
              name: data.name,
              description: data.description,
            };
            mutate(request);
          })}
        >
          {/* Projects Title And Description */}
          <div>
            <div className="space-y-4 mb-7 overflow-visible">
              <div className="flex flex-col overflow-visible">
                <Controller
                  control={control}
                  name="name"
                  render={({ field }) => (
                    <input
                      {...field}
                      type="text"
                      className="border-0 text-3xl flex items-center outline-0 ring-0 focus:ring-0 focus:border-0 w-full overflow-visible"
                      placeholder="Projects Name"
                    />
                  )}
                />
              </div>

              <div className="flex flex-col">
                <Controller
                  control={control}
                  name="description"
                  render={({ field }) => (
                    <textarea
                      value={field.value ?? ""}
                      onChange={field.onChange}
                      rows={3}
                      className="border-0 text-sm block outline-0 ring-0 focus:ring-0 focus:border-0 w-full resize-none field-sizing-content min-h-11 max-h-60"
                      placeholder="Description (optional)"
                    />
                  )}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              onClick={() => setOpen(false)}
              variant={"outline"}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={!formState.isValid || isPending}>
              {isPending ? "Saving" : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NewProjectDialog;
