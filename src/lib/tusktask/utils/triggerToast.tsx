"use client";

import { toast } from "sonner";
import { AlarmClock, BellRing, CircleAlert, CircleCheck } from "lucide-react";
import { cva } from "class-variance-authority";
import { cn } from "../../shadcn/utils";
import React from "react";

export interface TriggerToastProps {
  type: "default" | "success" | "error" | "reminder";
  title: React.ReactNode;
  description?: React.ReactNode;
  className?: string;
  action?: React.ReactNode;
  duration?: number;
}

const icons: Record<TriggerToastProps["type"], React.ReactNode> = {
  default: <BellRing />,
  error: <CircleAlert />,
  success: <CircleCheck />,
  reminder: <AlarmClock />,
};

export const triggerToast = ({
  type,
  title,
  description,
  className,
  action,
  duration = 4000,
}: TriggerToastProps) => {
  const sonnerVariants = cva("!cursor-pointer !shadow-xl select-none", {
    variants: {
      variant: {
        default: "!bg-tt-primary !text-tt-primary-foreground",
        error: "!bg-tt-tertiary !text-tt-tertiary-foreground ",
        success: "!bg-tt-quaternary !text-tt-quaternary-foreground",
        reminder: "!bg-tt-quinary !text-tt-quinary-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  });

  toast(title, {
    description,
    classNames: {
      toast: `${cn(sonnerVariants({ variant: type, className }))}`,
      icon: "!me-2",
    },
    icon: icons[type],
    action,
    duration,
  });
};
