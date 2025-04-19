import React from "react";
import { Dialog, DialogContent, DialogFooter, DialogTitle } from "../ui/dialog";
import SelectInput from "../../tusktask/inputs/SelectInput";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { Controller, useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createNewTask } from "@/src/lib/tusktask/mutators/creators/createNewTask";
import useNotificationContext from "@/src/lib/tusktask/hooks/context/useNotificationContext";

interface NewTaskFormValues {
  name: string;
  description?: string;
}

const NewTaskDialog: React.FC<{
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ open, setOpen }) => {
  const queryClient = useQueryClient();
  const { triggerToast } = useNotificationContext();

  const {
    control,
    handleSubmit,
    formState: { isValid, isSubmitting },
  } = useForm<NewTaskFormValues>({
    mode: "onChange",
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const { mutate } = useMutation({
    mutationFn: createNewTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", "personal"] });
      triggerToast({
        title: "Task Created",
        description: "Your new task has been added successfully!",
        type: "success",
      });
      setOpen(false);
    },
    onError: () => {
      triggerToast({
        title: "Something went wrong",
        description: "Failed to create a new task, please try again",
        type: "error",
      });
    },
  });

  const onSubmit = (data: NewTaskFormValues) => mutate(data);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="bg-tt-primary border-0 shadow-2xl">
        <DialogTitle className="sr-only">Create New Item</DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 ">
            <div className="space-y-4 mb-7">
              <Controller
                control={control}
                name="name"
                rules={{ required: true }}
                render={({ field }) => (
                  <div className="flex flex-col">
                    <input
                      {...field}
                      type="text"
                      className="border-0 text-3xl block outline-0 ring-0 focus:ring-0 focus:border-0 w-full"
                      placeholder="Task Name"
                    />
                  </div>
                )}
              />

              <Controller
                control={control}
                name="description"
                render={({ field }) => (
                  <>
                    <input
                      {...field}
                      type="text"
                      className="border-0 text-base block outline-0 ring-0 focus:ring-0 focus:border-0 "
                      placeholder="Description (optional)"
                    />
                  </>
                )}
              />
            </div>
            <Separator />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant={"outline"}
              onClick={() => setOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={!isValid || isSubmitting}>
              {isSubmitting ? "Saving..." : "Done"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NewTaskDialog;
