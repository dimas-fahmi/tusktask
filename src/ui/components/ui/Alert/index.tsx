"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { CircleAlert, type LucideIcon, X } from "lucide-react";
import type React from "react";
import { useState } from "react";
import { cn } from "@/src/ui/shadcn/lib/utils";

export const alertVariants = cva("", {
  variants: {
    variant: {
      default: "bg-muted text-muted-foreground",
      destructive: "bg-destructive/15 text-destructive",
      success: "bg-sucess/15 text-success",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export type AlertClassNames = {
  container?: string;
  header?: string;
  title?: string;
  description?: string;
  body?: string;
  footer?: string;
};

export type AlertProps = VariantProps<typeof alertVariants> & {
  title: string;
  description: string;
  classNames?: AlertClassNames;
  children?: React.ReactNode;
  icon?: LucideIcon;
};

const Alert = ({
  title,
  description,
  variant,
  classNames,
  children,
  icon,
}: AlertProps) => {
  const [visible, setVisible] = useState(true);
  const Icon = icon ?? CircleAlert;

  return (
    visible && (
      <div
        className={cn(
          `p-4 rounded-2xl space-y-3`,
          alertVariants({ variant }),
          classNames?.container,
        )}
      >
        <header
          className={cn(
            "flex items-center justify-between",
            classNames?.header,
          )}
        >
          <div className="flex items-center gap-2">
            <Icon className="w-5 h-5" />
            <h1 className={cn("font-semibold text-lg", classNames?.title)}>
              {title}
            </h1>
          </div>

          <button
            aria-label="Close alert"
            type="button"
            onClick={() => {
              setVisible(false);
            }}
          >
            <X />
          </button>
        </header>

        {/* Body */}
        <div className={cn("", classNames?.body)}>
          <p className={cn("text-sm", classNames?.description)}>
            {description}
          </p>
        </div>

        {/* Footer */}
        {children && (
          <footer className={cn("", classNames?.footer)}>{children}</footer>
        )}
      </div>
    )
  );
};

export default Alert;
