import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { Button, type ButtonProps } from "@/src/ui/shadcn/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/src/ui/shadcn/components/ui/dialog";
import Input, { type InputProps } from "../Input/input";

export type SensitiveConfirmationDialogProps = {
  open: boolean;
  setOpen: (open: boolean) => void;

  title: string;
  description: string;

  isValid: boolean;
  setIsValid: (isValid: boolean) => void;

  confirmationText: string;

  inputProps?: InputProps;

  positiveText: string;
  negativeText: string;

  positiveButtonProps?: ButtonProps;
  negativeButtonProps?: ButtonProps;
};

const SensitiveConfirmationDialog = ({
  open,
  setOpen: onOpenChange,

  title,
  description,

  confirmationText,

  isValid,
  setIsValid,

  inputProps,

  positiveText,
  negativeText,

  negativeButtonProps,
  positiveButtonProps,
}: SensitiveConfirmationDialogProps) => {
  const { control, watch } = useForm({
    mode: "onChange",
    defaultValues: {
      confirmation: "",
    },
  });

  const confirmation = watch("confirmation");

  useEffect(() => {
    if (confirmation === confirmationText) {
      setIsValid(true);
    } else {
      setIsValid(false);
    }
  }, [confirmation, setIsValid, confirmationText]);

  return (
    <Dialog {...{ open, onOpenChange }}>
      <DialogContent className="space-y-4">
        <DialogHeader className="m-0">
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        {/* Confirmation Prompt */}
        <div>
          <Controller
            control={control}
            name="confirmation"
            render={({ field }) => (
              <Input
                message={`Type "${confirmationText}" to continue`}
                inputProps={{
                  className: "text-center",
                  ...field,
                }}
                messageProps={{
                  className: `text-center ${!isValid && !!confirmation.length ? "text-destructive" : ""}`,
                }}
                {...(inputProps || {})}
              />
            )}
          />
        </div>

        {/* Footer */}
        <footer className="grid grid-cols-2 gap-2">
          <Button {...(positiveButtonProps || {})}>{positiveText}</Button>
          <DialogClose asChild>
            <Button variant={"outline"} {...(negativeButtonProps || {})}>
              {negativeText}
            </Button>
          </DialogClose>
        </footer>
      </DialogContent>
    </Dialog>
  );
};

export default SensitiveConfirmationDialog;
