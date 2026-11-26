"use client";

import { useDebouncedCallback } from "@tanstack/react-pacer";
import { cn } from "cn";
import { useTranslations } from "next-intl";
import type React from "react";
import { type MouseEvent, useEffect, useState } from "react";
import { Button } from "@/src/ui/shadcn/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/src/ui/shadcn/components/ui/popover";
import { Slider } from "@/src/ui/shadcn/components/ui/slider";
import { useIsMobile } from "@/src/ui/shadcn/hooks/use-mobile";
import { getTaskPriorityLabel } from "@/src/utils/getTaskPriorityLabel";
import PriorityIcon from "../PriorityIcon";

export interface PriorityPickerPopoverProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  priority?: number;
  setPriority?: (priority: number) => void;

  trigger: React.FC<React.ComponentPropsWithRef<"button">>;

  onValueChange?: (priority: number) => void;

  onSave?: (priority: number, event: MouseEvent<HTMLButtonElement>) => void;

  onUrgent?: (priority: number, event: MouseEvent<HTMLButtonElement>) => void;

  onHigh?: (priority: number, event: MouseEvent<HTMLButtonElement>) => void;

  onMedium?: (priority: number, event: MouseEvent<HTMLButtonElement>) => void;

  onLow?: (priority: number, event: MouseEvent<HTMLButtonElement>) => void;

  onTrivial?: (priority: number, event: MouseEvent<HTMLButtonElement>) => void;

  unDebouncedOnChangeValue?: (priority: number) => void;

  hideSaveButton?: boolean;
}

const MenuItem = ({
  children,
  className,
  ...props
}: React.ComponentPropsWithRef<"button">) => {
  return (
    <Button
      variant={"ghost"}
      size={"sm"}
      {...props}
      className={cn(
        "justify-start text-xs font-light opacity-80 hover:opacity-90 gap-2",
        className,
      )}
    >
      {children}
    </Button>
  );
};

export const PriorityPickerPopover = ({
  open: _open,
  onOpenChange: _onOpenChange,
  priority: _priority,
  setPriority: _setPriority,
  trigger: Trigger,
  onHigh,
  onLow,
  onMedium,
  onSave,
  onTrivial,
  onUrgent,
  onValueChange,
  unDebouncedOnChangeValue,
  hideSaveButton,
}: PriorityPickerPopoverProps) => {
  const t = useTranslations();

  const isMobile = useIsMobile();

  const [__open, __onOpenChange] = useState(false);
  const [__priority, __setPriority] = useState(50);

  const open = _open !== undefined ? _open : __open;
  const onOpenChange =
    _onOpenChange !== undefined ? _onOpenChange : __onOpenChange;

  const priority = _priority !== undefined ? _priority : __priority;
  const setPriority = _setPriority !== undefined ? _setPriority : __setPriority;

  const onValueChangeDebounce = useDebouncedCallback(
    (value: number) => {
      onValueChange?.(value);
    },
    {
      wait: 700,
    },
  );

  useEffect(() => {
    onValueChangeDebounce(priority);
    unDebouncedOnChangeValue?.(priority);
  }, [onValueChangeDebounce, priority, unDebouncedOnChangeValue]);

  return (
    <Popover {...{ open, onOpenChange }}>
      <PopoverTrigger render={(renderProps) => <Trigger {...renderProps} />} />

      <PopoverContent
        side={isMobile ? "bottom" : "left"}
        className={"p-0 overflow-hidden"}
      >
        <div className="space-y-2">
          <div className="flex px-4 pt-3 pb-2 border-b gap-2 opacity-80">
            <PriorityIcon priority={priority} />
            <div className="flex flex-col">
              <span className="text-sm">
                {t(`common.task_priorities.${getTaskPriorityLabel(priority)}`)}
              </span>
              <small>{priority}</small>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-1 px-1 pb-2 border-b">
            <MenuItem
              onClick={(e) => {
                onUrgent?.(10, e);

                if (e.defaultPrevented) return;
                setPriority(10);
                onOpenChange(false);
              }}
            >
              <PriorityIcon priority={10} />
              <span>{t("common.task_priorities.shorts.urgent")}</span>
            </MenuItem>

            <MenuItem
              onClick={(e) => {
                onHigh?.(25, e);

                if (e.defaultPrevented) return;
                setPriority(25);
                onOpenChange(false);
              }}
            >
              <PriorityIcon priority={25} />
              <span>{t("common.task_priorities.shorts.high")}</span>
            </MenuItem>
            <MenuItem
              onClick={(e) => {
                onMedium?.(50, e);

                if (e.defaultPrevented) return;
                setPriority(50);
                onOpenChange(false);
              }}
            >
              <PriorityIcon priority={50} />
              <span>{t("common.task_priorities.shorts.medium")}</span>
            </MenuItem>
            <MenuItem
              onClick={(e) => {
                onLow?.(75, e);

                if (e.defaultPrevented) return;
                setPriority(75);
                onOpenChange(false);
              }}
            >
              <PriorityIcon priority={75} />
              <span>{t("common.task_priorities.shorts.low")}</span>
            </MenuItem>
            <MenuItem
              onClick={(e) => {
                onTrivial?.(100, e);

                if (e.defaultPrevented) return;
                setPriority(100);
                onOpenChange(false);
              }}
            >
              <PriorityIcon priority={100} />
              <span>{t("common.task_priorities.shorts.trivial")}</span>
            </MenuItem>
          </div>

          <div
            className={`px-2 pt-1 ${hideSaveButton ? "pb-4" : "border-b pb-3"}`}
          >
            <Slider
              min={0}
              max={100}
              value={priority}
              step={1}
              onValueChange={(value) => {
                setPriority(value as number);
              }}
            />
          </div>

          {!hideSaveButton && (
            <div className="grid grid-cols-1 px-2 pt-1 pb-3 gap-2">
              {/* Status */}
              <Button
                variant={"outline"}
                size={"xs"}
                className={"bg-transparent"}
                onClick={(e) => {
                  onSave?.(priority, e);

                  if (e.defaultPrevented) return;
                  onOpenChange(false);
                }}
              >
                {t("common.save")}
              </Button>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};
