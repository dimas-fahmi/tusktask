"use client";

import type { IconProps } from "@tabler/icons-react";
import { cn } from "cn";
import React from "react";
import { ICONS, type IconName, isValidIconName } from "./collections";

export type IconrendererProps = {
  iconName: IconName;
  fallback?: IconName;
} & IconProps;

const IconRenderer = React.forwardRef<SVGSVGElement, IconrendererProps>(
  ({ iconName, fallback, className, ...props }, ref) => {
    const data = isValidIconName(iconName)
      ? ICONS[iconName]
      : ICONS[fallback ?? "beach"];

    return (
      <data.icon
        ref={ref}
        {...(data as { props?: IconProps })?.props}
        {...props}
        className={cn(
          (data as { props?: IconProps })?.props?.className,
          className,
        )}
      />
    );
  },
);

IconRenderer.displayName = "IconRenderer";

export default IconRenderer;
