import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/src/ui/shadcn/components/ui/dialog";
import { cn } from "@/src/ui/shadcn/lib/utils";
import DialogButton, { type DialogButtonProps } from "../DialogButton";

export interface TwoChoiceDialogClasses {
  dialogContent?: string;
  dialogTitle?: string;
  dialogDescription?: string;
  dialogFooter?: string;
}

export interface TwoChoiceDialogProps {
  title: string;
  description: string;
  positiveText: string;
  negativeText: string;
  positiveProps?: DialogButtonProps;
  negativeProps?: DialogButtonProps;
  classes?: TwoChoiceDialogClasses;
  open: boolean;
  setOpen: (state: boolean) => void;
}

const TwoChoiceDialog = (props: TwoChoiceDialogProps) => {
  return (
    <Dialog open={props.open} onOpenChange={props.setOpen}>
      <DialogContent
        className={cn(
          "space-y-2 bg-background/95",
          props?.classes?.dialogContent,
        )}
      >
        <DialogTitle className={cn("", props?.classes?.dialogTitle)}>
          {props.title}
        </DialogTitle>
        <DialogDescription
          className={cn("", props?.classes?.dialogDescription)}
        >
          {props.description}
        </DialogDescription>
        <footer
          className={cn("grid grid-cols-2 gap-2", props?.classes?.dialogFooter)}
        >
          <DialogButton {...props?.positiveProps}>
            {props.positiveText}
          </DialogButton>
          <DialogClose asChild>
            <DialogButton variant={"secondary"} {...props?.negativeProps}>
              {props.negativeText}
            </DialogButton>
          </DialogClose>
        </footer>
      </DialogContent>
    </Dialog>
  );
};

export default TwoChoiceDialog;
