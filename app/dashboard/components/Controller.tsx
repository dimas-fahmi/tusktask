"use client";

import {
  Calendar,
  CalendarArrowDown,
  ChevronLeft,
  ChevronRight,
  Loader,
  type LucideIcon,
} from "lucide-react";
import { DateTime } from "luxon";
import { useEffect, useState } from "react";
import { useDayByDayViewStore } from "@/src/lib/stores/dayByDayView";
import { Button } from "@/src/ui/shadcn/components/ui/button";
import { cn } from "@/src/ui/shadcn/lib/utils";

const IndexButton = ({
  isCooldown,
  icon: Icon,
  className,
  onClick,
  ...props
}: React.ComponentProps<"button"> & {
  isCooldown: boolean;
  icon: LucideIcon;
}) => {
  const [justClicked, setJustClicked] = useState(false);

  useEffect(() => {
    if (!justClicked) return;

    const debouncer = setTimeout(() => {
      setJustClicked(false);
    }, 1000);

    return () => clearTimeout(debouncer);
  }, [justClicked]);

  return (
    <Button
      variant={"outline"}
      aria-label="View previous date"
      disabled={isCooldown}
      {...props}
      className={cn("rounded-full w-8 h-8 disabled:animate-pulse", className)}
      onClick={(e) => {
        onClick?.(e);
        setJustClicked(true);
      }}
    >
      {justClicked ? <Loader className="animate-spin" /> : <Icon />}
    </Button>
  );
};

const Controller = () => {
  const { index, setIndex, getActiveDate } = useDayByDayViewStore();
  const [isCooldown, setIsCooldown] = useState(false);

  // biome-ignore lint/correctness/useExhaustiveDependencies: Rerender is needed for debouncer to trigger
  useEffect(() => {
    setIsCooldown(true);
    const debouncer = setTimeout(() => {
      setIsCooldown(false);
    }, 1000);

    return () => clearTimeout(debouncer);
  }, [index]);

  return (
    <div className="flex items-center justify-between">
      {/* Left Side */}
      <div>
        <h1 className="capitalize">
          {DateTime.fromJSDate(getActiveDate(index)).toRelativeCalendar()}
        </h1>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-2">
        <IndexButton
          icon={ChevronLeft}
          isCooldown={isCooldown}
          onClick={() => {
            setIndex(index - 1);
          }}
        />

        <IndexButton
          icon={CalendarArrowDown}
          isCooldown={isCooldown}
          onClick={() => {
            setIndex(0);
          }}
        />

        <IndexButton icon={Calendar} isCooldown={isCooldown} />

        <IndexButton
          icon={ChevronRight}
          isCooldown={isCooldown}
          onClick={() => {
            setIndex(index + 1);
          }}
        />
      </div>
    </div>
  );
};

export default Controller;
