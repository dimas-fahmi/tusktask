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
} & Omit<React.ComponentPropsWithRef<"input">, "type">;

const MainInput = React.forwardRef<HTMLInputElement, MainInputProps>(
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
      <InputGroup className="rounded-sm">
        {/* Top Side */}
        <InputGroupAddon align={"block-start"} className="pb-0.5 min-h-8">
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

        <InputGroupInput
          ref={ref}
          {...props}
          id={_id}
          aria-invalid={isInvalid}
          className={cn(
            "pt-0.5",
            isInvalid ? "placeholder:text-destructive/50 ring-[3px]" : "",
          )}
        />
      </InputGroup>
    );
  },
);

MainInput.displayName = "MainInput";

export default MainInput;
