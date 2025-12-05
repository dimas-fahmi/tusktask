import { cva, type VariantProps } from "class-variance-authority";
import React from "react";
import { cn } from "@/src/ui/shadcn/lib/utils";

export const dialogButtonVariants = cva(
  "border p-3 rounded-full hover:scale-95 transition-all duration-300 active:scale-90",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground",
        secondary: "",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export type DialogButtonProps = React.HTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof dialogButtonVariants>;

const DialogButton = React.forwardRef<HTMLButtonElement, DialogButtonProps>(
  ({ className, variant, ...props }, ref) => {
    return (
      <button
        type="button"
        ref={ref}
        {...props}
        className={cn(dialogButtonVariants({ variant }), className)}
      />
    );
  },
);

export default DialogButton;
