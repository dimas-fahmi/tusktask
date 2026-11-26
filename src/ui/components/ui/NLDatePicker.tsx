"use client";

import { IconCalendarWeek } from "@tabler/icons-react";
import { en as enChrono, id as idChrono } from "chrono-node";
import { cn } from "cn";
import { formatRelative } from "date-fns";
import { useLocale, useTranslations } from "next-intl";
import * as React from "react";
import { useDateLocale } from "@/src/hooks/useDateLocale";
import { capitalizeFirstLetter } from "@/src/utils/capitalizeFirstLetter";
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
  hideLabel?: boolean;
  inputClassName?: string;
  hidePicked?: boolean;
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
  hideLabel,
  inputClassName,
  hidePicked,
}: NLDatePickerProps) {
  const id = React.useId();

  const t = useTranslations();

  const locale = useLocale();
  const dateLocale = useDateLocale();

  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");
  const [_date, _setDate] = React.useState<Date | undefined>(
    CHRONO[locale].parseDate(inputValue) || undefined,
  );

  const date = _value ?? _date;
  const setDate = _onValueChange ?? _setDate;

  return (
    <Field>
      {!hideLabel && (
        <FieldLabel
          htmlFor={id}
          className={`${isInvalid ? "text-destructive" : ""}`}
        >
          {label ?? t("component.NLDatePicker.default_label")}
        </FieldLabel>
      )}
      <InputGroup>
        <InputGroupInput
          id={id}
          value={inputValue}
          placeholder={t("component.NLDatePicker.placeholder")}
          onChange={(e) => {
            setInputValue(e.target.value);

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
          className={cn(
            `${isInvalid ? "text-destructive" : ""}`,
            inputClassName,
          )}
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
                    setInputValue(formatDate(date));
                  },
                }}
                onOpenChange={setOpen}
              />
            </PopoverContent>
          </Popover>
        </InputGroupAddon>
      </InputGroup>

      {!hidePicked && (
        <div
          className={`${isInvalid ? "text-destructive" : "text-muted-foreground"} px-1 text-xs font-light`}
        >
          {message ? (
            message
          ) : date ? (
            <span className="font-medium">
              {capitalizeFirstLetter(
                formatRelative(date, new Date(), {
                  locale: dateLocale,
                }),
              )}
            </span>
          ) : (
            t("component.NLDatePicker.describer")
          )}
        </div>
      )}
    </Field>
  );
}
