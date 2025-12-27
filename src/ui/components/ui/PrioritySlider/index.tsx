"use client";

import { getPriorityClassification } from "@/src/lib/utils/priorityParser";
import { Slider, type SliderProps } from "@/src/ui/shadcn/components/ui/slider";
import { cn } from "@/src/ui/shadcn/lib/utils";

export type PrioritySliderProps = SliderProps;

const PrioritySlider = ({ className, ...props }: PrioritySliderProps) => {
  return (
    <div className="space-y-1">
      <Slider {...props} min={0} max={50} className={cn("", className)} />

      <div className="text-xs font-light opacity-70 flex items-center justify-between">
        {/* Classification */}
        <span className="capitalize">
          {getPriorityClassification(props?.value?.[0] ?? 99)}
        </span>

        {/* Number Value */}
        <span>{props?.value?.[0] ?? 99}</span>
      </div>
    </div>
  );
};

export default PrioritySlider;
