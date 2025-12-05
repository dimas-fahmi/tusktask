import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/src/ui/shadcn/components/ui/tooltip";
import { cn } from "@/src/ui/shadcn/lib/utils";
import { Apple, Discord, Facebook, Github, Google } from "../../icons/brands";

export const actionButtonIcons = { Google, Apple, Facebook, Github, Discord };
export type ActionButtonIconsType = keyof typeof actionButtonIcons;

export interface ActionButtonProps
  extends React.HTMLAttributes<HTMLButtonElement> {
  text: string;
  icon: ActionButtonIconsType;
  tooltipContent?: React.ReactNode;
  disabled?: boolean;
}

const ActionButton = React.forwardRef<HTMLButtonElement, ActionButtonProps>(
  ({ text, className, icon, tooltipContent, ...props }, ref) => {
    const Icon = actionButtonIcons[icon];

    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            className={cn(
              "group/button border py-2 px-4 rounded-md flex items-center gap-2 justify-center disabled:opacity-50 w-full not-disabled:hover:bg-primary not-disabled:hover:text-primary-foreground transition-all duration-100 disabled:cursor-default",
              className,
            )}
            {...props}
            ref={ref}
          >
            {/* Icon */}
            <div>
              <Icon className="w-4 h-4 fill-current" />
            </div>

            {/* Text */}
            <div>{text}</div>
          </button>
        </TooltipTrigger>

        {tooltipContent && <TooltipContent>{tooltipContent}</TooltipContent>}
      </Tooltip>
    );
  },
);

ActionButton.displayName = "ActionButton";

export default ActionButton;
