"use client";

import { IconCalendarWeek } from "@tabler/icons-react";
import { en as enChrono, id as idChrono } from "chrono-node";
import { formatRelative } from "date-fns";
import { enUS } from "date-fns/locale/en-US";
import { id } from "date-fns/locale/id";
import { useLocale, useTranslations } from "next-intl";
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
  value?: Date | null;
  onValueChange?: (date?: Date | null) => void;
  message?: string;
  isInvalid?: boolean;
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

const CHRONO = {
  id: idChrono,
  en: enChrono,
};

export function NlDatePicker({
  label,
  value: _value,
  onValueChange: _onValueChange,
  message,
  isInvalid,
}: NLDatePickerProps) {
  const t = useTranslations();
  const locale = useLocale();

  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");
  const [_date, _setDate] = React.useState<Date | undefined>(
    CHRONO[locale].parseDate(value) || undefined,
  );

  const date = _value ?? _date;
  const setDate = _onValueChange ?? _setDate;

  return (
    <Field>
      <FieldLabel
        htmlFor={`${label ?? crypto.randomUUID()}-date-picker`}
        className={`${isInvalid ? "text-destructive" : ""}`}
      >
        {label ?? t("component.NLDatePicker.default_label")}
      </FieldLabel>
      <InputGroup>
        <InputGroupInput
          id={`${label ?? crypto.randomUUID()}-date-picker`}
          value={value}
          placeholder={t("component.NLDatePicker.placeholder")}
          onChange={(e) => {
            setValue(e.target.value);

            if (!e.target.value) {
              setDate(undefined);
            }

            const date = CHRONO[locale].parseDate(e.target.value);

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
          className={`${isInvalid ? "text-destructive" : ""}`}
          autoComplete="off"
        />
        <InputGroupAddon align="inline-end" aria-invalid={isInvalid}>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger
              render={
                <InputGroupButton
                  id="date-picker"
                  variant="ghost"
                  size="icon-xs"
                  aria-label="Select date"
                >
                  <IconCalendarWeek
                    stroke={1}
                    className={`${isInvalid ? "text-destructive" : ""}`}
                  />
                  <span className="sr-only">
                    {t("component.NLDatePicker.default_label")}
                  </span>
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
      <div
        className={`${isInvalid ? "text-destructive" : "text-muted-foreground"} px-1 text-xs font-light`}
      >
        {message ? (
          message
        ) : date ? (
          <span className="font-medium">
            {formatRelative(date, new Date(), {
              locale: locale === "en" ? enUS : id,
            })}
          </span>
        ) : (
          t("component.NLDatePicker.describer")
        )}
      </div>
    </Field>
  );
}
