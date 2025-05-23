import React from "react";
import {
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectItem,
  Select as SelectComp,
} from "../../../shadcn/ui/select";

interface SelectProps<T> {
  placeholder: string;

  children: React.ReactNode;
}

function Select<T>({
  placeholder,
  children,
  ...props
}: SelectProps<T> & React.ComponentProps<typeof SelectComp>) {
  return (
    <SelectComp {...props}>
      <SelectTrigger className="w-full border">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>{children}</SelectContent>
    </SelectComp>
  );
}

export { Select };
