// src/ui/components/ui/CommitMessageDialog.tsx
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  type NotificationMessageType,
  notificationMessageTypeSchema,
} from "@/src/lib/zod/notification";
import { Button } from "@/src/ui/shadcn/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/src/ui/shadcn/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/src/ui/shadcn/components/ui/form";
import Input from "../Input/input";

interface CommitMessageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (data: NotificationMessageType) => void;
  isPending?: boolean;
  title?: string;
  description?: string;
}

const CommitMessageDialog = ({
  open,
  onOpenChange,
  onConfirm,
  isPending = false,
  title = "Commit Message",
  description = "Write a note here outlining the changes you made and reason behind them.",
}: CommitMessageDialogProps) => {
  const form = useForm({
    resolver: zodResolver(notificationMessageTypeSchema),
    defaultValues: {
      subject: "",
      message: "",
    },
  });

  const handleSubmit = (data: NotificationMessageType) => {
    onConfirm(data);
  };

  // Reset form when dialog opens/closes to clear previous inputs
  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) form.reset();
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      inputProps={{
                        ...field,
                        placeholder: "Subject (Optional)",
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <textarea
                      className="resize-none min-h-48 p-4 border rounded-xl max-h-48 font-light text-sm"
                      placeholder="Description (Optional)"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline" disabled={isPending}>
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CommitMessageDialog;
