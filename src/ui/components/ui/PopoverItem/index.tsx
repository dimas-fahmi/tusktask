import { cva, type VariantProps } from "class-variance-authority";
import type { LucideIcon } from "lucide-react";
import React from "react";
import { cn } from "@/src/ui/shadcn/lib/utils";

export const PopoverItemVariants = cva("", {
  variants: {
    variant: {
      default: "",
      negative: "text-destructive",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export type PopoverItemProps = React.HTMLAttributes<HTMLButtonElement> & {
  disabled?: boolean;
  icon: LucideIcon;
  title: string;
} & VariantProps<typeof PopoverItemVariants>;

const PopoverItem = React.forwardRef<HTMLButtonElement, PopoverItemProps>(
  ({ className, icon: Icon, title, variant, ...props }, ref) => {
    return (
      <button
        ref={ref}
        type="button"
        {...props}
        className={cn(
          "flex items-center gap-2 hover:scale-95 active:scale-90 transition-all duration-300 cursor-pointer w-full",
          PopoverItemVariants({ variant }),
          className,
        )}
      >
        {/* Icon */}
        <div>
          <Icon className="w-5 h-5" />
        </div>

        {/* Title */}
        <span className="text-sm">{title}</span>
      </button>
    );
  },
);

export default PopoverItem;
