import { cva, type VariantProps } from "class-variance-authority";
import type React from "react";
import { cn } from "@/src/ui/shadcn/lib/utils";

const messageVariant = cva("", {
  variants: {
    variant: {
      default: "text-foreground",
      negative: "text-destructive",
      positive: "text-success",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export interface InputProps {
  label?: string;
  className?: string;
  labelProps?: React.ComponentProps<"label">;
  inputProps?: React.ComponentProps<"input">;

  message?: string;
  messageVariants?: VariantProps<typeof messageVariant>;
  messageProps?: React.HTMLAttributes<HTMLSpanElement>;

  labelRight?: React.ReactNode;
}

const Input = ({
  className,
  inputProps,
  label,
  labelProps,
  message,
  messageVariants,
  messageProps,
  labelRight,
}: InputProps) => {
  const uuid = crypto.randomUUID();

  return (
    <div className={cn("flex flex-col gap-1", className)}>
      {/* Label */}
      {label && (
        <div className="flex justify-between items-center">
          <label
            htmlFor={uuid}
            {...labelProps}
            className={cn("font-header", labelProps?.className)}
          >
            {label}
          </label>
          <div>{labelRight}</div>
        </div>
      )}

      {/* Input */}
      <input
        id={uuid}
        {...inputProps}
        className={cn("border px-4 py-2 rounded-2xl", inputProps?.className)}
      />

      {/* Input Message */}
      {message && (
        <span
          {...messageProps}
          className={cn(
            messageVariant({ ...messageVariants }),
            "text-xs font-light",
            messageProps?.className,
          )}
        >
          {message}
        </span>
      )}
    </div>
  );
};

export default Input;
