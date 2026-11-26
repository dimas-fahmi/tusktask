"use client";

import {
  IconBed,
  IconCalendarDown,
  IconCalendarUp,
  IconCalendarWeek,
  IconClockX,
  IconSofa,
} from "@tabler/icons-react";
import { cn } from "cn";
import { formatDate, formatDistance } from "date-fns";
import { useTranslations } from "next-intl";
import type React from "react";
import { type MouseEvent, useState } from "react";
import { useDateLocale } from "@/src/hooks/useDateLocale";
import { Button } from "@/src/ui/shadcn/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/src/ui/shadcn/components/ui/popover";
import { useIsMobile } from "@/src/ui/shadcn/hooks/use-mobile";
import { capitalizeFirstLetter } from "@/src/utils/capitalizeFirstLetter";
import { getDateTimes } from "@/src/utils/clientOnly/getDateTimes";
import { NlDatePicker } from "../../ui/NLDatePicker";

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
        "justify-start text-xs font-light opacity-80 hover:opacity-90",
        className,
      )}
    >
      {children}
    </Button>
  );
};

export interface DatePickerPopoverProps {
  date?: Date | null;
  setDate?: (date: Date | null) => void;
  open?: boolean;
  min?: Date | null;
  max?: Date | null;
  setOpen?: (open: boolean) => void;
  trigger: React.FC<React.ComponentPropsWithoutRef<"button">>;
  onSave?: (date: Date | null, event: MouseEvent<HTMLButtonElement>) => void;
  onValueChange?: (
    date: Date | null,
    event: MouseEvent<HTMLButtonElement>,
  ) => void;
  onToday?: (date: Date | null, event: MouseEvent<HTMLButtonElement>) => void;
  onTomorrow?: (
    date: Date | null,
    event: MouseEvent<HTMLButtonElement>,
  ) => void;
  onWeekend?: (date: Date | null, event: MouseEvent<HTMLButtonElement>) => void;
  onNextWeek?: (
    date: Date | null,
    event: MouseEvent<HTMLButtonElement>,
  ) => void;
  onNoDate?: (date: Date | null, event: MouseEvent<HTMLButtonElement>) => void;
}

export const DatePickerPopover = ({
  trigger: Trigger,
  date: _date,
  setDate: _setDate,
  onNextWeek,
  onNoDate,
  onValueChange,
  onToday,
  onTomorrow,
  onWeekend,
  open: _open,
  setOpen: _onOpenChange,
  onSave,
  max,
  min,
}: DatePickerPopoverProps) => {
  const isMobile = useIsMobile();

  const t = useTranslations();
  const dateLocale = useDateLocale();

  const [__date, __setDate] = useState<Date | null>(null);
  const [__open, __onOpenChange] = useState(false);

  const date = _date !== undefined ? _date : __date;
  const setDate = _setDate ?? __setDate;

  const open = _open !== undefined ? _open : __open;
  const onOpenChange = _onOpenChange ?? __onOpenChange;

  const isMinInvalid = (check: Date | null) => {
    if (!check) return false;
    return min ? check.getTime() < min.getTime() : false;
  };

  const isMaxInvalid = (check: Date | null) => {
    if (!check) return false;
    return max ? check.getTime() > max.getTime() : false;
  };

  return (
    <Popover {...{ open, onOpenChange }}>
      <PopoverTrigger
        render={(triggerProps) => <Trigger {...triggerProps} />}
      />

      <PopoverContent
        side={isMobile ? "bottom" : "left"}
        className={"p-0 overflow-hidden my-4"}
      >
        <div className="space-y-2">
          {/* Status */}
          <div className="flex px-4 pt-3 pb-2 border-b gap-2 opacity-80">
            <IconCalendarWeek />
            <div className="flex flex-col">
              <span className="text-sm">
                {date
                  ? capitalizeFirstLetter(
                      formatDate(date, "PPp", {
                        locale: dateLocale,
                      }),
                    )
                  : t("common.not_set")}
              </span>
              <small>
                {date
                  ? capitalizeFirstLetter(
                      formatDistance(date, Date.now(), {
                        locale: dateLocale,
                      }),
                    )
                  : "-"}
              </small>
            </div>
          </div>

          {/* Shortcuts */}
          <div className="grid px-1 grid-cols-1 gap-1 border-b pb-2">
            <MenuItem
              disabled={
                isMinInvalid(getDateTimes().today) ||
                isMaxInvalid(getDateTimes().today)
              }
              onClick={(e) => {
                const newValue = getDateTimes().today;

                onToday?.(newValue, e);
                onValueChange?.(newValue, e);

                if (e.defaultPrevented) return;
                onOpenChange(false);
                setDate(newValue);
              }}
            >
              <IconCalendarDown /> <span>{t("common.today")}</span>
            </MenuItem>

            <MenuItem
              disabled={
                isMinInvalid(getDateTimes().tomorrow) ||
                isMaxInvalid(getDateTimes().tomorrow)
              }
              onClick={(e) => {
                const newValue = getDateTimes().tomorrow;

                onTomorrow?.(newValue, e);
                onValueChange?.(newValue, e);

                if (e.defaultPrevented) return;
                onOpenChange(false);
                setDate(newValue);
              }}
            >
              <IconCalendarUp /> <span>{t("common.tomorrow")}</span>
            </MenuItem>
            <MenuItem
              disabled={
                isMinInvalid(getDateTimes().weekend) ||
                isMaxInvalid(getDateTimes().weekend)
              }
              onClick={(e) => {
                const newValue = getDateTimes().weekend;

                onWeekend?.(newValue, e);
                onValueChange?.(newValue, e);

                if (e.defaultPrevented) return;
                onOpenChange(false);
                setDate(newValue);
              }}
            >
              <IconSofa /> <span>{t("common.weekend")}</span>
            </MenuItem>
            <MenuItem
              disabled={
                isMinInvalid(getDateTimes().nextWeek) ||
                isMaxInvalid(getDateTimes().nextWeek)
              }
              onClick={(e) => {
                const newValue = getDateTimes().nextWeek;

                onNextWeek?.(newValue, e);
                onValueChange?.(newValue, e);

                if (e.defaultPrevented) return;
                onOpenChange(false);
                setDate(newValue);
              }}
            >
              <IconBed /> <span>{t("common.next_week")}</span>
            </MenuItem>

            <MenuItem
              disabled={!date}
              onClick={(e) => {
                onNoDate?.(null, e);
                onValueChange?.(null, e);

                if (e.defaultPrevented) return;
                onOpenChange(false);
                setDate(null);
              }}
            >
              <IconClockX /> <span>{t("common.unset_date_time")}</span>
            </MenuItem>
          </div>

          {/* Manual Input */}
          <div className="grid grid-cols-1 gap-2 border-b p-2 pt-1">
            <NlDatePicker
              hideLabel
              hidePicked
              value={date}
              onValueChange={(date) => setDate(date ?? null)}
            />
          </div>

          <div className="grid grid-cols-1 px-2 pt-1 pb-3 gap-2">
            {/* Status */}
            <Button
              variant={"outline"}
              size={"xs"}
              className={"bg-transparent"}
              onClick={(e) => {
                onSave?.(date, e);
                onValueChange?.(date, e);

                if (e.defaultPrevented) return;
                onOpenChange(false);
              }}
              disabled={isMinInvalid(date) || isMaxInvalid(date)}
            >
              {t("common.save")}
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
