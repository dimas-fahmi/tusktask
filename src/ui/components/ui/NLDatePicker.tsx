"use client";

import { IconCalendarWeek } from "@tabler/icons-react";
import { parseDate } from "chrono-node";
import { formatRelative } from "date-fns";
import { enUS } from "date-fns/locale/en-US";
import { id } from "date-fns/locale/id";
import { useLocale } from "next-intl";
import * as React from "react";
import { Field, FieldLabel } from "../../shadcn/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "../../shadcn/components/ui/input-group";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../shadcn/components/ui/popover";
import TimePicker from "./TimePicker";

export type NLDatePickerProps = {
  label?: string;
};

function formatDate(date: Date | undefined) {
  if (!date) {
    return "";
  }
  return date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export function NlDatePicker({ label }: NLDatePickerProps) {
  const locale = useLocale();

  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");
  const [date, setDate] = React.useState<Date | undefined>(
    parseDate(value) || undefined,
  );

  return (
    <Field>
      <FieldLabel htmlFor="date-optional">
        {label ?? "Schedule Date"}
      </FieldLabel>
      <InputGroup>
        <InputGroupInput
          id="date-optional"
          value={value}
          placeholder="Tomorrow or next week"
          onChange={(e) => {
            setValue(e.target.value);
            const date = parseDate(e.target.value);
            if (date) {
              setDate(date);
            }
          }}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setOpen(true);
            }
          }}
          autoComplete="off"
        />
        <InputGroupAddon align="inline-end">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger
              render={
                <InputGroupButton
                  id="date-picker"
                  variant="ghost"
                  size="icon-xs"
                  aria-label="Select date"
                >
                  <IconCalendarWeek />
                  <span className="sr-only">Select date</span>
                </InputGroupButton>
              }
            />
            <PopoverContent
              className="w-auto overflow-hidden p-0"
              align="end"
              sideOffset={8}
            >
              <TimePicker
                calendarProps={{
                  selected: date,
                  defaultMonth: date,
                  onSelect: (date) => {
                    setDate(date);
                    setValue(formatDate(date));
                  },
                }}
                onOpenChange={setOpen}
              />
            </PopoverContent>
          </Popover>
        </InputGroupAddon>
      </InputGroup>
      <div className="px-1 text-xs font-light text-muted-foreground">
        {date ? (
          <span className="font-medium">
            {formatRelative(date, new Date(), {
              locale: locale === "en" ? enUS : id,
            })}
          </span>
        ) : (
          <>Describe when or select your date manually</>
        )}
      </div>
    </Field>
  );
}
