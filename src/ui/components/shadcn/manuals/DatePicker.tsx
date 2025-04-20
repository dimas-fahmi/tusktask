"use client";

import * as React from "react";
import { addDays, format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import { cn } from "@/src/lib/shadcn/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

interface DatePickerProps {
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  placeholder: string;
  className?: string;
}

export function DatePicker({
  value,
  onChange,
  placeholder,
  className,
}: DatePickerProps) {
  const date = value ? new Date(value) : undefined;

  const handleDateChange = (newDate: Date | undefined) => {
    onChange?.(newDate);
  };

  return (
    <Dialog>
      <DialogTitle className="sr-only">
        Date and Time Picker for {placeholder}
      </DialogTitle>
      <DialogDescription className="sr-only">
        Date and Time Picker for {placeholder} with modal
      </DialogDescription>
      <DialogTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "justify-start text-left font-normal shadow-none",
            !date && "text-muted-foreground",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP 'at' HH:mm") : <span>{placeholder}</span>}
        </Button>
      </DialogTrigger>
      <DialogContent className="w-auto p-4 md:p-6">
        <Select
          onValueChange={(value) => {
            handleDateChange(addDays(new Date(), parseInt(value)));
          }}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent position="popper">
            <SelectItem value="0">Today</SelectItem>
            <SelectItem value="1">Tomorrow</SelectItem>
            <SelectItem value="3">In 3 days</SelectItem>
            <SelectItem value="7">In a week</SelectItem>
          </SelectContent>
        </Select>

        <Calendar
          mode="single"
          selected={date}
          onSelect={handleDateChange}
          initialFocus
          fromDate={new Date()}
        />

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-tt-primary-foreground/80">
              Hour
            </label>
            <Select
              value={date ? String(date.getHours()).padStart(2, "0") : "00"}
              onValueChange={(value) => {
                if (date) {
                  const newDate = new Date(date);
                  newDate.setHours(parseInt(value));
                  handleDateChange(newDate);
                }
              }}
              disabled={!date}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 24 }, (_, i) => (
                  <SelectItem key={i} value={String(i).padStart(2, "0")}>
                    {String(i).padStart(2, "0")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium text-tt-primary-foreground/80">
              Minute
            </label>
            <Select
              value={date ? String(date.getMinutes()).padStart(2, "0") : "00"}
              onValueChange={(value) => {
                if (date) {
                  const newDate = new Date(date);
                  newDate.setMinutes(parseInt(value));
                  handleDateChange(newDate);
                }
              }}
              disabled={!date}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 60 }, (_, i) => (
                  <SelectItem key={i} value={String(i).padStart(2, "0")}>
                    {String(i).padStart(2, "0")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
