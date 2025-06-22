import { cn } from "@/src/lib/shadcn/utils";
import React from "react";

export interface GhostTextarea {
  placeholder: string;
  rows?: number;
  className?: string;
}

const GhostTextarea = ({
  placeholder,
  rows,
  className,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement> & GhostTextarea) => {
  return (
    <textarea
      rows={rows ?? 3}
      className={cn(
        "border-0 text-sm block outline-0 ring-0 focus:ring-0 focus:border-0 w-full resize-none field-sizing-content min-h-11 max-h-60 text-wrap",
        className
      )}
      placeholder={placeholder}
      {...props}
    />
  );
};

export default GhostTextarea;
