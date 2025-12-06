import { cva, type VariantProps } from "class-variance-authority";
import type React from "react";
import { cn } from "@/src/ui/shadcn/lib/utils";

const messageVariant = cva("", {
  variants: {
    variant: {
      default: "",
      negative: "",
      positive: "",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export interface InputProps {
  label?: string;
  className?: string;
  labelProps?: React.HTMLAttributes<HTMLLabelElement>;
  inputProps?: React.HTMLAttributes<HTMLInputElement> & {
    placeholder?: string;
  };

  message?: string;
  messageVariants?: VariantProps<typeof messageVariant>;
  messageProps?: React.HTMLAttributes<HTMLSpanElement>;
}

const Input = ({
  className,
  inputProps,
  label,
  labelProps,
  message,
  messageVariants,
  messageProps,
}: InputProps) => {
  const uuid = crypto.randomUUID();

  return (
    <div className={cn("flex flex-col gap-1", className)}>
      {/* Label */}
      {label && (
        <label
          htmlFor={uuid}
          {...labelProps}
          className={cn("font-header", labelProps?.className)}
        >
          {label}
        </label>
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
