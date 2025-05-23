import { cn } from "@/src/lib/shadcn/utils";
import { cva, VariantProps } from "class-variance-authority";
import React from "react";

const InputVariants = cva("px-4 py-2 rounded-md", {
  variants: {
    variant: {
      default: "border outline-0",
      ghost: "border-0 ring-0 outline-0",
    },
    size: {
      default: "text-base",
      sm: "text-sm",
      md: "text-xl",
      lg: "text-2xl",
      xl: "text-3xl",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

type InputProps = Omit<React.ComponentProps<"input">, "size"> &
  VariantProps<typeof InputVariants>;

function Input({ variant, size, className, ...props }: InputProps) {
  return (
    <input
      className={`${cn(InputVariants({ variant, size, className }))}`}
      {...props}
    />
  );
}

export { Input, InputVariants };
