"use client";

import {
  IconExclamationCircle,
  IconKey,
  IconMail,
  IconSearch,
  IconTextSize,
  IconWorld,
  type TablerIcon,
} from "@tabler/icons-react";
import { cn } from "cn";
import { AnimatePresence, motion } from "motion/react";
import React from "react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from "../../shadcn/components/ui/input-group";
import { Label } from "../../shadcn/components/ui/label";

type MainInputType = "text" | "email" | "password" | "url" | "search";

const ICONS = {
  email: IconMail,
  text: IconTextSize,
  password: IconKey,
  search: IconSearch,
  url: IconWorld,
} as const satisfies Record<MainInputType, TablerIcon>;

export type MainInputProps = {
  icon?: TablerIcon;
  type?: MainInputType;
  hideIcon?: boolean;
  label?: string;
  hideLabel?: boolean;
  required?: boolean;
  message?: string;
  isInvalid?: boolean;
  textArea?: boolean;
} & (Omit<React.ComponentPropsWithRef<"input">, "type"> &
  React.ComponentPropsWithoutRef<"textarea">);

const MainInput = React.forwardRef<
  HTMLInputElement | HTMLTextAreaElement,
  MainInputProps
>(
  (
    {
      icon,
      type,
      hideIcon,
      label,
      hideLabel,
      message,
      isInvalid,
      required,
      id,
      textArea,
      ...props
    },
    ref,
  ) => {
    let Icon: TablerIcon | undefined;

    if (icon) {
      Icon = icon;
    }

    if (!Icon) {
      Icon = ICONS[type ?? "text"];
    }

    const _id = id ?? crypto.randomUUID();

    return (
      <InputGroup className="rounded-lg!">
        {/* Top Side */}
        <InputGroupAddon align={"block-start"} className="pb-1 min-h-8">
          <AnimatePresence mode="popLayout">
            {/* Icon */}
            {!isInvalid && (
              <motion.div
                key={"icon"}
                initial={{ opacity: 0, y: 1 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -1 }}
              >
                {!hideIcon && (
                  <Icon
                    className={cn(
                      "w-4 h-4",
                      isInvalid ? "text-destructive/70" : "",
                    )}
                  />
                )}
              </motion.div>
            )}

            {isInvalid && (
              <motion.div
                key={"icon"}
                initial={{ opacity: 0, y: 1 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -1 }}
              >
                {!hideIcon && (
                  <IconExclamationCircle
                    className={cn(
                      "w-4 h-4 pb-[2px]",
                      isInvalid ? "text-destructive/70" : "",
                    )}
                  />
                )}
              </motion.div>
            )}

            {/* Label */}
            {!hideLabel && !message && (
              <motion.div
                key={"label"}
                initial={{ opacity: 0, y: 1 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -1 }}
              >
                <InputGroupText
                  className={cn(
                    "text-xs",
                    isInvalid ? "text-destructive/75" : "",
                  )}
                >
                  <Label htmlFor={_id}>{label ?? "Label"}</Label>
                </InputGroupText>
              </motion.div>
            )}

            {message && (
              <motion.div
                key={"label-group-text"}
                initial={{ opacity: 0, y: 1 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -1 }}
              >
                <InputGroupText
                  className={cn(
                    "text-xs",
                    isInvalid ? "text-destructive/75" : "",
                  )}
                >
                  {message}
                </InputGroupText>
              </motion.div>
            )}
          </AnimatePresence>
        </InputGroupAddon>

        {textArea ? (
          <InputGroupTextarea
            ref={ref as React.ForwardedRef<HTMLTextAreaElement>}
            {...props}
            id={_id}
            aria-invalid={isInvalid}
            className={cn(
              "pt-0.5",
              isInvalid
                ? "placeholder:text-destructive/50 ring-[3px] text-destructive"
                : "",
              props?.className,
            )}
          />
        ) : (
          <InputGroupInput
            ref={ref as React.ForwardedRef<HTMLInputElement>}
            {...props}
            id={_id}
            aria-invalid={isInvalid}
            className={cn(
              "pt-0.5",
              isInvalid
                ? "placeholder:text-destructive/50 ring-[3px] text-destructive"
                : "",
            )}
          />
        )}
      </InputGroup>
    );
  },
);

MainInput.displayName = "MainInput";

export default MainInput;
