import { cva, VariantProps } from "class-variance-authority";
import React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/src/ui/components/shadcn/ui/select";
import { cn } from "@/src/lib/shadcn/utils";

const SelectVariants = cva("", {
  variants: {
    variant: {
      default: "",
      secondary: "",
      error: "border-tt-tertiary text-tt-tertiary",
    },
    selectSize: {
      default: "",
      lg: "min-h-11",
    },
  },
  defaultVariants: {
    variant: "default",
    selectSize: "default",
  },
});

type SelectItemsObj = {
  label: string;
  value: string;
};

type SelectInputProps = {
  items: string[] | SelectItemsObj[];
  label: string;
  placeholder: string;
  error?: boolean;
} & VariantProps<typeof SelectVariants> &
  React.ComponentProps<"select"> & {
    value?: string;
    onChange?: (value: string) => void;
    name?: string;
    onBlur?: () => void;
    ref?: React.Ref<HTMLButtonElement>;
  };

const SelectInput = React.forwardRef<HTMLButtonElement, SelectInputProps>(
  (
    {
      variant,
      selectSize,
      className,
      items,
      label,
      placeholder,
      value,
      onChange,
      name,
      onBlur,
      error = false,
    },
    ref
  ) => {
    return (
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger
          className={cn(
            SelectVariants({
              variant: error ? "error" : variant,
              selectSize,
              className,
            })
          )}
          ref={ref}
          name={name}
          onBlur={onBlur}
        >
          <SelectValue className="capitalize" placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>{label}</SelectLabel>
            {items?.map((item, index) =>
              typeof item === "string" ? (
                <SelectItem className="capitalize" value={item} key={index}>
                  {item}
                </SelectItem>
              ) : (
                <SelectItem
                  className="capitalize"
                  value={item.value}
                  key={index}
                >
                  {item.label}
                </SelectItem>
              )
            )}
          </SelectGroup>
        </SelectContent>
      </Select>
    );
  }
);

SelectInput.displayName = "SelectInput";
export default SelectInput;
