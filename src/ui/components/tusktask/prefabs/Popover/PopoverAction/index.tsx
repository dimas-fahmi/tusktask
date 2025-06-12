import { cn } from "@/src/lib/shadcn/utils";
import { cva, VariantProps } from "class-variance-authority";
import { LucideIcon } from "lucide-react";
import React from "react";

interface PopoverActionProps {
  Icon: LucideIcon;
  title: string;
  subTitle?: string;
  variant?: "default" | "destructive" | "disabled";
}

// Variant mechanism
const PopoverActionVariant = cva(
  " cursor-pointer w-full flex justify-between p-2 rounded-md items-center text-sm transition-all duration-200",
  {
    variants: {
      variant: {
        default: "hover:bg-accent hover:text-accent-foreground ",
        destructive:
          "text-destructive hover:bg-destructive hover:text-destructive-foreground",
        disabled: "opacity-50 cursor-auto hover:animate-pulse",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

const PopoverAction = ({
  Icon,
  title,
  subTitle,
  variant = "default",
  className,
  ...props
}: React.ComponentProps<"button"> &
  PopoverActionProps &
  VariantProps<typeof PopoverActionVariant>) => {
  return (
    <button
      className={`${cn(PopoverActionVariant({ variant, className }))} cursor`}
      title={title}
      role="button"
      aria-label={`${title} button`}
      {...props}
    >
      <div className="flex items-center gap-2">
        <span>
          <Icon className="w-4 h-4" />
        </span>
        <span>{title}</span>
      </div>
      <div className="text-xs opacity-60">{subTitle}</div>
    </button>
  );
};

export default PopoverAction;
