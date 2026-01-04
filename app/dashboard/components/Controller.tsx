"use client";

import {
  Calendar,
  CalendarArrowDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { DateTime } from "luxon";
import { useDayByDayStore } from "@/src/lib/stores/DayByDayStore";
import { Button } from "@/src/ui/shadcn/components/ui/button";

const Controller = () => {
  const { index, setIndex, getActiveDate } = useDayByDayStore();

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
        <Button
          variant={"outline"}
          className="rounded-full w-8 h-8"
          onClick={() => {
            setIndex(index - 1);
          }}
          aria-label="View previous date"
        >
          <ChevronLeft />
        </Button>

        <Button
          variant={"outline"}
          className="rounded-full w-8 h-8"
          onClick={() => {
            setIndex(0);
          }}
          aria-label="Back to today"
        >
          <CalendarArrowDown />
        </Button>

        <Button
          variant={"outline"}
          className="rounded-full w-8 h-8"
          aria-label="Go to a specific date"
        >
          <Calendar />
        </Button>

        <Button
          variant={"outline"}
          className="rounded-full w-8 h-8"
          onClick={() => {
            setIndex(index + 1);
          }}
          aria-label="View the next date"
        >
          <ChevronRight />
        </Button>
      </div>
    </div>
  );
};

export default Controller;
