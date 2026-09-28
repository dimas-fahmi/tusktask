"use client";

import {
  IconCheck,
  IconCircle,
  IconExclamationMark,
  IconLoader,
  type TablerIcon,
} from "@tabler/icons-react";
import { AnimatePresence, motion } from "motion/react";
import { Button, type ButtonProps } from "../../shadcn/components/ui/button";

export type IconProcessStatus = "idle" | "pending" | "success" | "error";

export type IconProcessButtonProps = {
  status: IconProcessStatus;
  idleIcon?: TablerIcon;
  setStatus?: (status: IconProcessButtonProps["status"]) => void;
} & Omit<ButtonProps, "children">;

const ICONS = {
  error: IconExclamationMark,
  idle: IconCircle,
  pending: IconLoader,
  success: IconCheck,
} as const satisfies Record<IconProcessButtonProps["status"], TablerIcon>;

const IconProcessButton = ({
  status,
  onClick,
  className,
  setStatus,
  idleIcon,
  ...props
}: IconProcessButtonProps) => {
  const Icon = status === "idle" ? (idleIcon ?? ICONS.idle) : ICONS[status];

  return (
    <motion.div
      initial={{
        rotate: 0,
      }}
      animate={{
        rotate: 720,
      }}
      transition={{
        duration: 0.8,
        damping: 10,
        stiffness: 80,
        type: "spring",
      }}
    >
      <Button
        variant={status === "error" ? "destructive" : "outline"}
        size={"icon"}
        {...props}
        onClick={(e) => {
          onClick?.(e);

          if (e.defaultPrevented) return;
          setStatus?.("pending");
        }}
      >
        <AnimatePresence mode="wait">
          {Object.keys(ICONS).map(
            (key) =>
              key === status && (
                <motion.div
                  key={key}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                >
                  <Icon
                    className={`${key === "pending" ? "animate-spin" : ""}`}
                  />
                </motion.div>
              ),
          )}
        </AnimatePresence>
      </Button>
    </motion.div>
  );
};

export default IconProcessButton;
