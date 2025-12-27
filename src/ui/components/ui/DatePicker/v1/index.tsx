"use client";

import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { motion } from "motion/react";
import * as React from "react";
import { Button } from "@/src/ui/shadcn/components/ui/button";
import {
  Calendar,
  type CalendarProps,
} from "@/src/ui/shadcn/components/ui/calendar";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/src/ui/shadcn/components/ui/dialog";
import { cn } from "@/src/ui/shadcn/lib/utils";

export interface DatePickerClasses {
  triggerClass?: string;
  triggerIconClass?: string;
  containerClass?: string;
}

export interface DatePickerProps {
  classes?: DatePickerClasses;
  calendarProps?: CalendarProps;
  value?: Date;
  onChange?: (d?: Date) => void;
  label?: string;
  disabled?: boolean;
}

export function DatePicker({
  classes,
  calendarProps,
  value,
  onChange,
  label,
  disabled,
}: DatePickerProps) {
  // Get current time for defaults
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();

  // Initialize time state with current time
  const [hour, setHour] = React.useState(currentHour % 12 || 12);
  const [minute, setMinute] = React.useState(currentMinute);
  const [meridiem, setMeridiem] = React.useState<"am" | "pm">(
    currentHour >= 12 ? "pm" : "am",
  );

  // Update time when value changes from parent
  React.useEffect(() => {
    if (value) {
      const v = new Date(value);
      const h = v?.getHours();
      const m = v?.getMinutes();
      setHour(h % 12 || 12);
      setMinute(m);
      setMeridiem(h >= 12 ? "pm" : "am");
    }
  }, [value]);

  const handleDateSelect = (selectedDate?: Date) => {
    if (!selectedDate) {
      onChange?.(undefined);
      return;
    }

    // Convert 12-hour format to 24-hour format
    let hour24 = hour;
    if (meridiem === "pm" && hour !== 12) {
      hour24 = hour + 12;
    } else if (meridiem === "am" && hour === 12) {
      hour24 = 0;
    }

    // Create new date with selected date and current time
    const newDate = new Date(selectedDate);
    newDate.setHours(hour24, minute, 0, 0);
    onChange?.(newDate);
  };

  const handleTimeChange = () => {
    if (!value) return;

    // Convert 12-hour format to 24-hour format
    let hour24 = hour;
    if (meridiem === "pm" && hour !== 12) {
      hour24 = hour + 12;
    } else if (meridiem === "am" && hour === 12) {
      hour24 = 0;
    }

    // Update time on existing date
    const newDate = new Date(value);
    newDate.setHours(hour24, minute, 0, 0);
    onChange?.(newDate);
  };

  const handleHourChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // biome-ignore lint/correctness/useParseIntRadix: HXD
    let newHour = parseInt(e.target.value) || 0;
    // Clamp hour between 1 and 12
    if (newHour > 12) newHour = 12;
    if (newHour < 1) newHour = 0;
    setHour(newHour);
  };

  const handleMinuteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // biome-ignore lint/correctness/useParseIntRadix: HXD
    let newMinute = parseInt(e.target.value) || 0;
    // Clamp minute between 0 and 59
    if (newMinute > 59) newMinute = 59;
    if (newMinute < 0) newMinute = 0;
    setMinute(newMinute);
  };

  // Trigger time update when meridiem changes
  // biome-ignore lint/correctness/useExhaustiveDependencies: NEEDED HERE
  React.useEffect(() => {
    handleTimeChange();
  }, [meridiem]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          data-empty={!value}
          className={cn(
            `data-[empty=true]:text-muted-foreground w-[280px] justify-start text-left font-normal`,
            classes?.triggerClass,
          )}
          disabled={disabled}
        >
          <CalendarIcon className={cn("", classes?.triggerIconClass)} />
          {value ? (
            format(value, "PPP - p")
          ) : (
            <span>{label || "Pick a date"}</span>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent
        className={cn(
          "overflow-hidden flex flex-col items-center w-fit p-4",
          classes?.containerClass,
        )}
      >
        {/* Header - Hidden */}
        <DialogHeader className="sr-only">
          <DialogTitle>Date Picker</DialogTitle>
          <DialogDescription>Date Picker</DialogDescription>
        </DialogHeader>

        {/* Calendar */}
        {calendarProps?.mode && calendarProps?.mode !== "single" ? (
          <Calendar {...calendarProps} />
        ) : (
          <Calendar
            {...calendarProps}
            mode="single"
            selected={value}
            onSelect={handleDateSelect}
          />
        )}

        {/* Time Select */}
        <div className="w-full grid grid-cols-1 gap-4 border-t pt-4">
          <div className="flex items-center gap-2 w-full justify-center">
            {/* Hour */}
            <input
              type="number"
              min="1"
              max="12"
              value={hour.toString().padStart(2, "0")}
              onChange={handleHourChange}
              onBlur={handleTimeChange}
              className="p-1 disable-appearance text-xl font-header appearance-none text-center border rounded-md min-w-14 max-w-14"
              placeholder="12"
            />

            {/* Separator */}
            <div>:</div>

            {/* Minute */}
            <input
              type="number"
              min="0"
              max="59"
              value={minute.toString().padStart(2, "0")}
              onChange={handleMinuteChange}
              onBlur={handleTimeChange}
              className="p-1 disable-appearance text-xl font-header appearance-none text-center border rounded-md min-w-14 max-w-14"
              placeholder="00"
            />
          </div>

          {/* Meridiems */}
          <div className="relative inline-flex border rounded-full w-full justify-between">
            {["am", "pm"].map((value) => (
              <button
                type="button"
                key={value}
                onClick={() => setMeridiem(value as "am" | "pm")}
                className={`${
                  meridiem === value ? "text-muted-foreground" : ""
                } relative z-10 flex-1 text-center py-1 text-xs uppercase cursor-pointer`}
              >
                {value}
                {meridiem === value && (
                  <motion.div
                    layoutId="highlight"
                    className="absolute inset-0 z-[-1] bg-muted rounded-full shadow-sm border"
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-2 w-full border-t pt-4">
          <motion.div
            initial={{ width: 0, flex: 0 }}
            animate={value ? { width: "auto", flex: 1 } : { width: 0, flex: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden p-0 m-0"
          >
            <Button
              className="w-full"
              size={"sm"}
              variant={"destructive"}
              onClick={() => {
                onChange?.(undefined);
              }}
            >
              Reset
            </Button>
          </motion.div>
          <DialogClose asChild>
            <Button className="flex-1 p-0 m-0" size={"sm"} variant={"outline"}>
              Close
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}
