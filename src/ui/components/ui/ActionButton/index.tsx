import React from "react";
import { cn } from "@/src/ui/shadcn/lib/utils";
import { Apple, Discord, Facebook, Github, Google } from "../../icons/brands";

export const actionButtonIcons = { Google, Apple, Facebook, Github, Discord };
export type ActionButtonIconsType = keyof typeof actionButtonIcons;

export interface ActionButtonProps
  extends React.HTMLAttributes<HTMLButtonElement> {
  text: string;
  icon: ActionButtonIconsType;
  disabled?: boolean;
}

const ActionButton = React.forwardRef<HTMLButtonElement, ActionButtonProps>(
  ({ text, className, icon, ...props }, ref) => {
    const Icon = actionButtonIcons[icon];

    return (
      <button
        type="button"
        className={cn(
          "group/button border py-2 px-4 rounded-md flex items-center gap-2 justify-center disabled:pointer-events-none disabled:opacity-50 w-full hover:bg-primary hover:text-primary-foreground transition-all duration-100",
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
    );
  },
);

ActionButton.displayName = "ActionButton";

export default ActionButton;
