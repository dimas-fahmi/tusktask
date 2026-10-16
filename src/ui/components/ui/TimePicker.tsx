"use client";

import { IconChevronDown, IconChevronUp, IconTrash } from "@tabler/icons-react";
import { cn } from "cn";
import { motion } from "motion/react";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { type DayPickerLocale, getDefaultClassNames } from "react-day-picker";
import { enUS } from "react-day-picker/locale/en-US";
import { id } from "react-day-picker/locale/id";
import type { SupportedLocale } from "@/src/i18n";
import { Button } from "../../shadcn/components/ui/button";
import { Calendar } from "../../shadcn/components/ui/calendar";
import { Label } from "../../shadcn/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../../shadcn/components/ui/select";

export type TimePickerProps = {
  calendarProps?: {
    selected?: Date | undefined;
    defaultMonth?: Date | undefined;
    onSelect?: (date: Date | undefined) => void;
  };
  onOpenChange?: (open: boolean) => void;
};

const LOCALE = {
  en: enUS,
  id: id,
} as const satisfies Record<SupportedLocale, DayPickerLocale>;

const MONTHS = [
  "january",
  "february",
  "march",
  "april",
  "may",
  "june",
  "july",
  "august",
  "september",
  "october",
  "november",
  "december",
] as const;

const TimePicker = ({ calendarProps, onOpenChange }: TimePickerProps) => {
  const locale = useLocale();
  const t = useTranslations();

  const now = new Date();

  const years = Array.from({ length: 11 }, (_, i) => now.getFullYear() - 5 + i);

  const [month, setMonth] = useState(now);

  const [hour, setHour] = useState(now.getHours());
  const [minute, setMinute] = useState(now.getMinutes());

  useEffect(() => {
    if (!calendarProps?.selected) return;

    if (month !== calendarProps?.selected) {
      setMonth(calendarProps?.selected);
    }

    if (hour !== calendarProps?.selected?.getHours()) {
      setHour(calendarProps?.selected?.getHours());
    }

    if (minute !== calendarProps?.selected?.getMinutes()) {
      setMinute(calendarProps?.selected?.getMinutes());
    }
  }, [calendarProps?.selected, month, hour, minute]);

  return (
    <div
      className="p-2 max-w-80 pb-4"
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      {/* Calendar */}
      <Calendar
        mode="single"
        captionLayout="label"
        {...calendarProps}
        locale={LOCALE[locale]}
        month={month}
        onPrevClick={() => {
          const d = new Date(month);
          d.setMonth(d.getMonth() === 1 ? 12 : d.getMonth() - 1);
          setMonth(d);
        }}
        onNextClick={() => {
          const d = new Date(month);
          d.setMonth(d.getMonth() === 12 ? 1 : d.getMonth() + 1);
          setMonth(d);
        }}
        className="w-full"
        onSelect={(date) => {
          if (!date) {
            calendarProps?.onSelect?.(date);
            return;
          }

          const d = new Date(date);

          d.setHours(hour);
          d.setMinutes(minute);

          calendarProps?.onSelect?.(d);
        }}
        classNames={{
          button_previous: cn(
            calendarProps?.selected ? "opacity-20" : "opacity-100",
            getDefaultClassNames().button_previous,
          ),
          button_next: cn(
            calendarProps?.selected ? "opacity-20" : "opacity-100",
            getDefaultClassNames().button_next,
          ),
        }}
      />

      <footer className="px-4 flex flex-col gap-2">
        {/* Month & Year */}
        <div className="grid grid-cols-2 gap-2">
          {/* Month */}
          <div className="space-y-2">
            <Label>Month</Label>
            <Select
              value={month ? MONTHS[month?.getMonth()] : null}
              onValueChange={(value) => {
                if (!value) return;
                const d = new Date(month);

                d.setMonth(MONTHS.indexOf(value));

                setMonth(d);

                calendarProps?.onSelect?.(d);
              }}
            >
              <SelectTrigger size="sm" className={"text-xs w-full"}>
                <SelectValue>
                  {month
                    ? t(`time.months.${MONTHS[month.getMonth()]}`)
                    : "Select Month"}
                </SelectValue>
              </SelectTrigger>

              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Month</SelectLabel>
                  <SelectItem disabled value={null}>
                    Select Month
                  </SelectItem>

                  {MONTHS.map((month) => (
                    <SelectItem key={month} value={month}>
                      {t(`time.months.${month}`)}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {/* Year */}
          <div className="space-y-2">
            <Label>Year</Label>
            <Select
              defaultValue={month.getFullYear()}
              value={month ? month.getFullYear() : now.getFullYear()}
              onValueChange={(value) => {
                if (!value) return;

                const d = new Date(month);

                d.setFullYear(value);

                setMonth(d);
                calendarProps?.onSelect?.(d);
              }}
            >
              <SelectTrigger size="sm" className={"w-full text-xs"}>
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Year</SelectLabel>
                  <SelectItem disabled value={null}>
                    Select Year
                  </SelectItem>

                  {years.map((year) => (
                    <SelectItem key={year} value={year}>
                      {year === now.getFullYear() ? `${year} (Current)` : year}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Time */}
        <div>
          <Label>Time</Label>
          <div className="flex items-center justify-center gap-2">
            {/* Hour */}
            <div className="space-y-2">
              <div className="flex flex-col items-center">
                <Button
                  variant={"ghost"}
                  size={"icon-xs"}
                  onClick={() => {
                    const newH = hour >= 23 ? 0 : hour + 1;

                    setHour(newH);

                    const d = calendarProps?.selected
                      ? new Date(calendarProps?.selected)
                      : new Date();

                    d.setHours(newH);

                    calendarProps?.onSelect?.(d);
                  }}
                >
                  <IconChevronUp />
                </Button>
                <div className="text-center font-bold text-lg">
                  {String(hour).padStart(2, "0")}
                </div>
                <Button
                  variant={"ghost"}
                  size={"icon-xs"}
                  onClick={() => {
                    const newH = hour <= 0 ? 23 : hour - 1;
                    setHour(newH);

                    const d = calendarProps?.selected
                      ? new Date(calendarProps?.selected)
                      : new Date();

                    d.setHours(newH);

                    calendarProps?.onSelect?.(d);
                  }}
                >
                  <IconChevronDown />
                </Button>
              </div>
            </div>

            {/* Minute */}
            <div className="space-y-2">
              <div className="flex flex-col items-center">
                <Button
                  variant={"ghost"}
                  size={"icon-xs"}
                  onClick={() => {
                    const newM = minute === 59 ? 0 : minute + 1;
                    setMinute(newM);
                    const d = calendarProps?.selected
                      ? new Date(calendarProps?.selected)
                      : new Date();

                    let newH = d.getHours();

                    if (minute === 59) {
                      newH = hour >= 23 ? 0 : hour + 1;
                      setHour(newH);
                    }

                    d.setHours(newH);
                    d.setMinutes(newM);

                    calendarProps?.onSelect?.(d);
                  }}
                >
                  <IconChevronUp />
                </Button>
                <div className="text-center font-bold text-lg">
                  {String(minute).padStart(2, "0")}
                </div>
                <Button
                  variant={"ghost"}
                  size={"icon-xs"}
                  onClick={() => {
                    const newM = minute === 0 ? 59 : minute - 1;
                    setMinute(newM);
                    const d = calendarProps?.selected
                      ? new Date(calendarProps?.selected)
                      : new Date();

                    let newH = d.getHours();

                    if (minute === 0) {
                      newH = hour <= 0 ? 23 : hour - 1;
                      setHour(newH);
                    }

                    d.setHours(newH);
                    d.setMinutes(newM);

                    calendarProps?.onSelect?.(d);
                  }}
                >
                  <IconChevronDown />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Button */}
        <div className="flex items-center">
          <motion.div
            initial={
              calendarProps?.selected
                ? { width: "auto", marginRight: "4px" }
                : { width: 0, marginRight: "0px" }
            }
            animate={
              calendarProps?.selected
                ? { width: "auto", marginRight: "4px" }
                : { width: 0, marginRight: "0px" }
            }
            className="overflow-hidden"
          >
            <Button
              variant={"destructive"}
              size={"icon-xs"}
              onClick={() => {
                calendarProps?.onSelect?.(undefined);
              }}
            >
              <IconTrash />
            </Button>
          </motion.div>
          {onOpenChange && (
            <Button
              variant={"outline"}
              onClick={() => {
                onOpenChange(false);
              }}
              size={"xs"}
              className={"flex-1"}
            >
              Close
            </Button>
          )}
        </div>
      </footer>
    </div>
  );
};
export default TimePicker;
