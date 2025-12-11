import {
  Cable,
  Gamepad2,
  type LucideIcon,
  Monitor,
  RectangleGoggles,
  Smartphone,
  Tablet,
  Tv,
  Watch,
} from "lucide-react";
import type { DeviceType } from "ua-parser-js/enums";

export const DEVICE_TYPE_ICON: Record<
  (typeof DeviceType)[keyof typeof DeviceType],
  LucideIcon
> = {
  console: Gamepad2,
  desktop: Monitor,
  embedded: Cable,
  mobile: Smartphone,
  smarttv: Tv,
  tablet: Tablet,
  wearable: Watch,
  xr: RectangleGoggles,
} as const;
