import { cn } from "@/src/lib/shadcn/utils";
import { cva } from "class-variance-authority";
import { LucideIcon } from "lucide-react";
import React from "react";

interface PopoverActionProps {
  Icon: LucideIcon;
  title: string;
  action: () => void;
  subTitle?: string;
  variant?: "default" | "destructive";
}

const PopoverAction: React.FC<PopoverActionProps> = ({
  action,
  Icon,
  title,
  subTitle,
  variant = "default",
}) => {
  // Variant mechanism
  const PopoverActionVariant = cva(
    " cursor-pointer w-full flex justify-between p-2 rounded-md items-center text-sm transition-all duration-200",
    {
      variants: {
        variant: {
          default: "hover:bg-accent hover:text-accent-foreground ",
          destructive:
            "text-destructive hover:bg-destructive hover:text-destructive-foreground",
        },
      },
      defaultVariants: {
        variant: "default",
      },
    }
  );

  return (
    <button
      className={`${cn(PopoverActionVariant({ variant }))}`}
      title={title}
      role="button"
      aria-label={`${title} button`}
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
